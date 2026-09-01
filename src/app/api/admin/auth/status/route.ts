import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionToken(sessionCookie);

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}
