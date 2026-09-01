"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Shield,
  Menu,
  X,
  BookOpen,
  Layers,
  Trophy,
  LogOut,
  User,
  Loader2,
  Trash2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";
import { GitHubIcon } from "../ui/icons";
import { useAuth } from "@/lib/firebase/auth";
import { useToast } from "../ui/toast";
import { Button } from "../ui/button";

export function Header() {
  const pathname = usePathname();
  const { user, loading, signInWithGithub, signOut, deleteAccount } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Overview", icon: Layers },
    { href: "/days", label: "Challenges Archive", icon: BookOpen },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGithub();
      showToast({
        type: "success",
        title: "Signed In with GitHub",
        message: "Welcome! Your 100 Days profile is connected.",
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Sign In Failed",
        message: err?.message || "Could not complete GitHub sign-in.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    try {
      await signOut();
      showToast({
        type: "info",
        title: "Signed Out",
        message: "You have been logged out.",
      });
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setDeleteModalOpen(false);
      setUserDropdownOpen(false);
      showToast({
        type: "success",
        title: "Account Permanently Deleted",
        message: "All your submissions, streak data, and profile records have been wiped from Firestore.",
      });
    } catch (err: any) {
      console.error("Delete account error:", err);
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: err?.message || "Please re-authenticate and try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-800 dark:border-zinc-700/60 group-hover:border-zinc-600 transition-colors">
                <Terminal className="h-4 w-4 text-zinc-100 dark:text-zinc-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  100 Days of Code
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/40">
                    DSA
                  </span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/40"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-900"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Student Auth Section */}
            {loading ? (
              <div className="h-8 w-8 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Student"}
                      className="h-5 w-5 rounded-full ring-1 ring-zinc-200 dark:ring-zinc-700"
                    />
                  ) : (
                    <User className="h-4 w-4 text-zinc-500" />
                  )}
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[100px] hidden sm:inline">
                    {user.githubUsername || user.displayName || "Student"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-lg z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-850">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {user.displayName || "Student"}
                      </p>
                      {user.githubUsername && (
                        <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                          @{user.githubUsername}
                        </p>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Sign Out</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setDeleteModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        <span>Delete Account & Data</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                isLoading={authLoading}
                className="text-xs font-semibold h-8 px-2.5"
              >
                <GitHubIcon className="h-3.5 w-3.5 mr-1.5" />
                <span>Sign In</span>
              </Button>
            )}

            {/* Admin link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="Admin Portal"
            >
              <Shield className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 dark:border-rose-950 bg-white dark:bg-zinc-950 p-6 space-y-5 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Delete Account & Wipe All Data?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3.5 text-xs text-rose-800 dark:text-rose-300 space-y-1.5 leading-relaxed">
              <p className="font-semibold">The following data will be permanently wiped:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700 dark:text-rose-400">
                <li>Your profile and user document in Firestore</li>
                <li>Your active streak and challenge history</li>
                <li>All logged solution submissions</li>
                <li>Your ranking on the Global Leaderboard</li>
                <li>Your Firebase Authentication account</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                isLoading={isDeleting}
                onClick={handleDeleteAccount}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Yes, Delete Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
