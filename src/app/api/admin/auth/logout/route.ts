import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );

  // Clear session cookie
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
