import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createSession } from "@/lib/session";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface GoogleTokenResponse {
  id_token: string;
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  role: "admin" | "npp" | "user";
}

/**
 * Lấy origin thật — phải khớp với redirect route.
 */
function getOrigin(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host) {
    return `${proto}://${host}`;
  }
  return request.nextUrl.origin;
}

/**
 * OAuth 2.0 callback — Google redirect về đây sau khi user đồng ý.
 * Đổi authorization code lấy token, verify, tạo session.
 */
export async function GET(request: NextRequest) {
  try {
    const origin = getOrigin(request);
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // User từ chối hoặc lỗi
    if (error) {
      return NextResponse.redirect(new URL("/login?error=google_denied", origin));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/login?error=missing_params", origin));
    }

    // Verify state token chống CSRF
    const savedState = request.cookies.get("google_oauth_state")?.value;
    if (!savedState || savedState !== state) {
      return NextResponse.redirect(new URL("/login?error=invalid_state", origin));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
      return NextResponse.redirect(new URL("/login?error=server_config", origin));
    }

    const redirectUri = `${origin}/api/auth/callback/google`;

    // Đổi authorization code lấy tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Token exchange failed:", errText);
      return NextResponse.redirect(new URL("/login?error=token_exchange", origin));
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Lấy thông tin user từ Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      console.error("Failed to fetch user info:", await userInfoRes.text());
      return NextResponse.redirect(new URL("/login?error=user_info", origin));
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json();

    if (!googleUser.sub) {
      return NextResponse.redirect(new URL("/login?error=no_sub", origin));
    }

    const googleId = googleUser.sub;
    const email = googleUser.email || "";
    const name = googleUser.name || email.split("@")[0] || "user";

    // Tìm hoặc tạo user (giống logic trong route.ts gốc)
    const [existing] = await pool.query<UserRow[]>(
      "SELECT id, username, role FROM users WHERE google_id = ? LIMIT 1",
      [googleId]
    );

    let user: UserRow;

    if (existing.length > 0) {
      user = existing[0];
      // Cập nhật username nếu tên Google thay đổi
      const cleanName = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 20);
      if (cleanName && cleanName !== user.username) {
        const [sameName] = await pool.query<RowDataPacket[]>(
          "SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1",
          [cleanName, user.id]
        );
        if (sameName.length === 0) {
          await pool.query("UPDATE users SET username = ? WHERE id = ?", [cleanName, user.id]);
          user.username = cleanName;
        }
      }
    } else {
      let baseUsername = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 20);

      if (!baseUsername) {
        baseUsername = `user_${googleId.slice(0, 8)}`;
      }

      const [sameName] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE username = ? LIMIT 1",
        [baseUsername]
      );

      if (sameName.length > 0) {
        baseUsername = `${baseUsername}_${Math.random().toString(36).slice(2, 6)}`;
      }

      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO users (username, email, password_hash, google_id, role, is_active) VALUES (?, ?, '', ?, 'user', 1)",
        [baseUsername, email || null, googleId]
      );

      user = { id: result.insertId, username: baseUsername, role: "user" } as UserRow;
    }

    await createSession(user.id, user.username, user.role);

    // Xóa state cookie và redirect về trang chủ
    const response = NextResponse.redirect(new URL("/", origin));
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    const origin = getOrigin(request);
    return NextResponse.redirect(new URL("/login?error=server_error", origin));
  }
}
