import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "./lib/auth/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(sessionCookie);

    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and visiting /admin/login, redirect to /admin
  if (pathname === "/admin/login") {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(sessionCookie);

    if (isValid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
