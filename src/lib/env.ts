/**
 * Centralized Environment Configuration
 * Sensitive keys (AWS, Admin, AI) must only be accessed on the server.
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

  // Firebase Client SDK Configuration
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "challenge-705a4",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  },

  // AWS Backend Credentials (Server-Side Only)
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "ap-south-1",
  },

  // Public Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  isProduction: process.env.NODE_ENV === "production",
};
