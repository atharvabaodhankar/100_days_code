import { env } from "../env";

export const ADMIN_COOKIE_NAME = "100_days_admin_session";
const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Creates an HMAC-SHA256 signed session token for admin authentication.
 */
export async function createSessionToken(): Promise<string> {
  const payload = {
    role: "admin",
    createdAt: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_SECONDS * 1000,
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString("base64url");
  const signature = await generateSignature(base64Payload, env.SESSION_SECRET);

  return `${base64Payload}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token.
 */
export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [base64Payload, signature] = parts;

  try {
    const expectedSignature = await generateSignature(base64Payload, env.SESSION_SECRET);
    if (signature !== expectedSignature) return false;

    const payloadJson = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    if (payload.role !== "admin") return false;
    if (payload.exp && Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Generates an HMAC-SHA256 hex signature using Web Crypto API.
 */
async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(data)
  );

  return Buffer.from(signatureBuffer).toString("hex");
}
