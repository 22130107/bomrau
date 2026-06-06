import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Lấy origin thật từ request — dựa vào header Host / X-Forwarded-Host
 * để hỗ trợ nhiều tên miền (multi-domain).
 */
function getOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || request.nextUrl.host;
  // Bắt buộc sử dụng https trên môi trường thực tế để tránh lỗi proxy/Cloudflare Flexible SSL
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = isLocalhost ? "http" : "https";
  return `${proto}://${host}`;
}

/**
 * OAuth 2.0 redirect flow — fallback cho iOS Safari khi GIS library bị chặn bởi ITP.
 * Redirect user tới Google Authorization Server.
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Missing GOOGLE_CLIENT_ID" }, { status: 500 });
  }

  // Xây dựng callback URL từ origin thật (dựa vào domain hiện tại)
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

  // Lưu state + origin vào cookie để verify khi callback
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 phút
  });
  // Lưu origin để callback biết redirect_uri & redirect về đúng domain
  response.cookies.set("google_oauth_origin", origin, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
