import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

// Routes that require login
const protectedRoutes = ["/profile", "/admin", "/npp"];
// Routes only for guests (redirect to home if logged in)
const authRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);
  const isLoggedIn = !!session && new Date(session.expiresAt) > new Date();

  // If session exists but is expired, delete cookie
  if (sessionCookie && !isLoggedIn) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }

  // Redirect unauthenticated users from protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route)) && isLoggedIn) {
    // Redirect based on role
    const role = session?.role;
    const redirectTo = role === "admin" ? "/admin" : role === "npp" ? "/npp" : "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)",
  ],
};
