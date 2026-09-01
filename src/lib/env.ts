/**
 * Centralized Environment Configuration
 * Sensitive keys must only be accessed on the server.
 */

export const env = {
  // Admin Authentication
  ADMIN_SECRET: process.env.ADMIN_SECRET || "admin123",
  SESSION_SECRET: process.env.SESSION_SECRET || "default-development-session-secret-min-32-chars-long",

  // AI Providers — parsed into arrays for Round-Robin rotation and rate-limit failover
  get GEMINI_API_KEYS(): string[] {
    const raw = process.env.GEMINI_API_KEY || "";
    return raw.split(",").map((k) => k.trim()).filter(Boolean);
  },
  get GROQ_API_KEYS(): string[] {
    const raw = process.env.GROQ_API_KEY || "";
    return raw.split(",").map((k) => k.trim()).filter(Boolean);
  },

  // Firebase Configuration (Server Only)
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || "",

  // Public Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  isProduction: process.env.NODE_ENV === "production",
};
