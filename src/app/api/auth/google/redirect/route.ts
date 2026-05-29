import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Lấy origin thật — khi chạy sau reverse proxy (Nginx),
 * request.nextUrl.origin có thể trả về http://localhost:3000.
 */
function getOrigin(request: NextRequest): string {
  // Ưu tiên env var nếu có
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  // Đọc từ headers proxy
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host) {
    return `${proto}://${host}`;
  }
  return request.nextUrl.origin;
}

/**
 * OAuth 2.0 redirect flow — fallback cho iOS Safari khi GIS library bị chặn bởi ITP.
 * Redirect user tới Google Authorization Server.
 */
export async function GET(request: NextRequest) {
  // Nếu host của request hiện tại khác với NEXT_PUBLIC_BASE_URL,
  // ta redirect về đúng domain chính để đảm bảo đồng bộ Cookie khi callback.
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    try {
      const baseUrl = new URL(process.env.NEXT_PUBLIC_BASE_URL);
      const host = request.headers.get("host") || "";
      if (host && host !== baseUrl.host) {
        const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, process.env.NEXT_PUBLIC_BASE_URL);
        return NextResponse.redirect(targetUrl);
      }
    } catch (e) {
      console.error("Error parsing NEXT_PUBLIC_BASE_URL:", e);
    }
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Missing GOOGLE_CLIENT_ID" }, { status: 500 });
  }

  // Xây dựng callback URL từ origin thật
  const origin = getOrigin(request);
  const redirectUri = `${origin}/api/auth/callback/google`;

  // Tạo state token để chống CSRF
  const state = crypto.randomBytes(32).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    state,
    prompt: "select_account",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Lưu state vào cookie để verify khi callback
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 phút
  });

  return response;
}
