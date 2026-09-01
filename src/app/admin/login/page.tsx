"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("from") || "/admin";
  const { showToast } = useToast();

  const [secret, setSecret] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) {
      setError("Please enter the admin security passphrase.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please check your passphrase.");
        setIsLoading(false);
        return;
      }

      showToast({
        type: "success",
        title: "Authenticated Successfully",
        message: "Welcome to Admin Studio. Session cookie established.",
      });

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please ensure the development server is running.");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-lg"
    >
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <Input
          type="password"
          label="Admin Secret Passphrase"
          placeholder="Enter ADMIN_SECRET"
          value={secret}
          onChange={(e) => {
            setSecret(e.target.value);
            if (error) setError("");
          }}
          autoFocus
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full font-semibold"
        isLoading={isLoading}
      >
        Authenticate & Open Studio
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Brand Lock Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 mb-2 shadow-xs">
            <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            Admin Studio Login
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Enter your server administrator passphrase to manage challenge days and pipeline generation.
          </p>
        </div>

        {/* Suspense wrapped login form */}
        <Suspense
          fallback={
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 flex items-center justify-center shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>

        {/* Security Notice */}
        <div className="text-center text-[11px] text-zinc-500 dark:text-zinc-400 font-mono space-y-1">
          <div>Protected by server-side HMAC session cookie</div>
          <div className="text-zinc-400 dark:text-zinc-600 text-[10px]">
            Default dev secret: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">admin123</code> (configurable in .env.local)
          </div>
        </div>
      </div>
    </div>
  );
}
