"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, ArrowRight, Lock, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [secret, setSecret] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) {
      setError("Please enter the admin security passphrase.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Mock authentication transition
    setTimeout(() => {
      setIsLoading(false);
      showToast({
        type: "success",
        title: "Authenticated",
        message: "Welcome back, Atharva. Redirecting to admin studio.",
      });
      router.push("/admin");
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Lock Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 mb-2">
            <Lock className="h-5 w-5 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Admin Studio Login
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your server administrator passphrase to manage challenge days and pipeline generation.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 shadow-lg"
        >
          <div>
            <Input
              type="password"
              label="Admin Secret Passphrase"
              placeholder="••••••••••••••••"
              value={secret}
              onChange={(e) => {
                setSecret(e.target.value);
                if (error) setError("");
              }}
              error={error}
              autoFocus
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            isLoading={isLoading}
          >
            Authenticate
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {/* Security Notice */}
        <div className="text-center text-[11px] text-zinc-400 font-mono">
          <span>Protected by server secret & HTTP-Only cookie auth</span>
        </div>
      </div>
    </div>
  );
}
