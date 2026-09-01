/**
 * Centralized Environment Configuration
 */

export const env = {
  // Admin Email Authorization
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "baodhankaratharva@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),

  // AI Providers (Server-side / Lambda)
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

  // Allowed Allowed Production Domains (Custom Domain & Specific Vercel Domain)
  ALLOWED_DOMAINS: [
    "https://challenge.atharvabaodhankar.me",
    "https://100dayscode-gamma.vercel.app",
  ],

  // Dynamic App URL resolution (Custom domain, 100dayscode-gamma.vercel.app, or localhost)
  get NEXT_PUBLIC_APP_URL(): string {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return "https://100dayscode-gamma.vercel.app";
  },

  isProduction: process.env.NODE_ENV === "production",
};
