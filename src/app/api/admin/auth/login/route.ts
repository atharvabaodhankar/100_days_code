import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret } = body;

    if (!secret || typeof secret !== "string") {
      return NextResponse.json(
        { error: "Admin secret is required." },
        { status: 400 }
      );
    }

    // Compare with server secret from environment variable
    if (secret.trim() !== env.ADMIN_SECRET.trim()) {
      return NextResponse.json(
        { error: "Invalid admin passphrase. Access denied." },
        { status: 401 }
      );
    }

    // Generate signed session token
    const token = await createSessionToken();

    const response = NextResponse.json(
      { success: true, message: "Authentication successful." },
      { status: 200 }
    );

    // Set secure, HTTP-only session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An internal error occurred during authentication." },
      { status: 500 }
    );
  }
}
