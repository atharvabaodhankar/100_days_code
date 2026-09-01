import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Admin authentication is handled by Firebase Auth checking baodhankaratharva@gmail.com in AdminLayout
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
