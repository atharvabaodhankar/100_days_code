"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Lightbulb,
  Compass,
  Cpu,
  CheckCircle,
  Clock,
  Database,
  Tag,
  Code2,
  Send,
  Flame,
  CheckCircle2,
  GitCommit,
} from "lucide-react";
import { Problem } from "@/types";
import { DifficultyBadge } from "../ui/badge";
import { CodeBlock } from "../ui/code-block";
import { Button } from "../ui/button";
import { GitHubIcon } from "../ui/icons";
import { useAuth } from "@/lib/firebase/auth";
import { recordStudentSubmission } from "@/lib/firebase/gamification";
import { useToast } from "../ui/toast";

/**
 * Parses inline markdown tokens (e.g. `code`, **bold**, etc.) into React elements.
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-zinc-950 dark:text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="font-mono text-[11px] sm:text-xs bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-300/60 dark:border-zinc-700/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Formats dry run walkthrough strings into clean dual-theme step cards.
 */
function DryRunFormatted({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 p-4 sm:p-5 text-xs sm:text-[13px] text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed space-y-2 shadow-xs transition-colors">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Header lines like **i = 0**:
        if (trimmed.startsWith("**") || trimmed.startsWith("Let's trace")) {
          return (
            <div
              key={idx}
              className="pt-2 first:pt-0 font-semibold text-zinc-950 dark:text-zinc-100 border-t border-zinc-200/80 dark:border-zinc-800/80 first:border-t-0"
            >
              {parseInlineMarkdown(trimmed)}
            </div>
          );
        }

        // Bullet point lines (* or -)
        if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
          const content = trimmed.replace(/^[*-\s]+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2 shrink-0"></span>
              <span className="flex-1">{parseInlineMarkdown(content)}</span>
            </div>
          );
        }

        return <div key={idx}>{parseInlineMarkdown(trimmed)}</div>;
      })}
    </div>
  );
}

export function ProblemView({
  problem,
  dayNumber = 1,
}: {
  problem: Problem;
  dayNumber?: number;
}) {
  const { user, signInWithGithub } = useAuth();
  const { showToast } = useToast();

  const [activeLang, setActiveLang] = React.useState<"cpp" | "python" | "java">("cpp");
  const [userCodeLang, setUserCodeLang] = React.useState<"cpp" | "python" | "java">("cpp");
  const [userCode, setUserCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedStreak, setSubmittedStreak] = React.useState<number | null>(null);
  const [commitUrl, setCommitUrl] = React.useState<string | null>(null);

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({
        type: "error",
        title: "Sign In Required",
        message: "Please sign in with GitHub to save your solution and track your streak.",
      });
      return;
    }

    if (!userCode.trim()) {
      showToast({
        type: "error",
        title: "Empty Solution",
        message: "Please write or paste your solution before saving.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let gitCommitUrl = `https://github.com/${user.githubUsername || "student"}/100-days-of-code`;
      let gitCommitSha = "";

      try {
        const commitRes = await fetch("/api/github/commit-solution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            githubUsername: user.githubUsername || user.displayName || "student",
            dayNumber,
            problemOrder: problem.order,
            problemTitle: problem.title,
            topic: problem.topic,
            difficulty: problem.difficulty,
            statement: problem.statement,
            observation: problem.observation,
            logic: problem.logic,
            complexity: problem.complexity,
            language: userCodeLang,
            code: userCode,
          }),
        });

        if (commitRes.ok) {
          const commitData = await commitRes.json();
          gitCommitUrl = commitData.commitUrl || gitCommitUrl;
          gitCommitSha = commitData.commitSha || "";
          setCommitUrl(gitCommitUrl);
        }
      } catch (e) {
        console.warn("GitHub commit API attempt:", e);
      }

      const res = await recordStudentSubmission({
        uid: user.uid,
        displayName: user.displayName || user.githubUsername || "Student",
        githubUsername: user.githubUsername,
        avatarUrl: user.photoURL || undefined,
        dayNumber,
        problemOrder: problem.order,
        language: userCodeLang,
        code: userCode,
        commitSha: gitCommitSha,
        commitUrl: gitCommitUrl,
      });

      setSubmittedStreak(res.streak);
      showToast({
        type: "success",
        title: "Saved to GitHub & Logged!",
        message: `Day ${dayNumber} logged. Current Streak: ${res.streak} Days 🔥`,
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Submission Error",
        message: err?.message || "Failed to record your solution.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-mono tracking-wider">
              {problem.topic}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {problem.title}
          </h2>
        </div>

        {/* Source link */}
        {problem.sourceUrl && (
          <a
            href={problem.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors w-fit shadow-xs"
          >
            <span>Solve on {problem.sourceName}</span>
            <ExternalLink className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
          </a>
        )}
      </div>

      {/* Problem Statement Card */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 p-4 sm:p-5 space-y-4 shadow-xs">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            Problem Statement
          </h3>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
            {problem.statement}
          </p>
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Examples
            </h4>
            <div className="grid gap-2.5">
              {problem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-3 text-xs font-mono space-y-1"
                >
                  <div className="text-zinc-800 dark:text-zinc-300">
                    <span className="text-zinc-500 dark:text-zinc-400">Input:</span> {ex.input}
                  </div>
                  <div className="text-zinc-800 dark:text-zinc-200">
                    <span className="text-zinc-500 dark:text-zinc-400">Output:</span> {ex.output}
                  </div>
                  {ex.explanation && (
                    <div className="text-zinc-600 dark:text-zinc-400 font-sans text-xs pt-1 border-t border-zinc-200 dark:border-zinc-800/60 mt-1">
                      <span className="font-medium text-zinc-800 dark:text-zinc-300">Explanation:</span> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Constraints
            </h4>
            <ul className="list-disc list-inside text-xs font-mono text-zinc-700 dark:text-zinc-300 space-y-1">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Pedagogical Breakdown: Observation & Intuition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Lightbulb className="h-4 w-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Core Observation & Intuition
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {problem.observation}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300">
            <Tag className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Key Concepts & Patterns
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {problem.keyConcepts.map((concept, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/50"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Logic */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
          <Compass className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Step-by-Step Logic
          </h3>
        </div>
        <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line space-y-2 font-sans">
          {problem.logic}
        </div>
      </section>

      {/* Dry Run (Rendered with Clean Dual-Theme Format) */}
      {problem.dryRun && (
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
            <Cpu className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Dry Run & State Walkthrough
            </h3>
          </div>
          <DryRunFormatted text={problem.dryRun} />
        </section>
      )}

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider">Time Complexity</span>
          </div>
          <p className="text-xs font-mono text-zinc-800 dark:text-zinc-200 pt-0.5">
            {problem.complexity.time}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Database className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold uppercase tracking-wider">Space Complexity</span>
          </div>
          <p className="text-xs font-mono text-zinc-800 dark:text-zinc-200 pt-0.5">
            {problem.complexity.space}
          </p>
        </div>
      </div>

      {/* Reference Solutions */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Reference Solution
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-md border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveLang("cpp")}
              className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                activeLang === "cpp"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/50"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              C++
            </button>
            <button
              onClick={() => setActiveLang("python")}
              className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                activeLang === "python"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/50"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Python
            </button>
            {problem.solutions.java && (
              <button
                onClick={() => setActiveLang("java")}
                className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                  activeLang === "java"
                    ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/50"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Java
              </button>
            )}
          </div>
        </div>

        {activeLang === "cpp" && <CodeBlock code={problem.solutions.cpp} language="cpp" />}
        {activeLang === "python" && <CodeBlock code={problem.solutions.python} language="python" />}
        {activeLang === "java" && problem.solutions.java && (
          <CodeBlock code={problem.solutions.java} language="java" />
        )}
      </section>

      {/* STUDENT CODE SUBMISSION & GITHUB AUTO-COMMIT WORKSPACE */}
      <section className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10 p-5 space-y-4 shadow-xs mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <Code2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Your Solution Workspace & Auto-Commit
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Saves to your <span className="font-mono text-zinc-700 dark:text-zinc-300">100-days-of-code</span> GitHub repo & logs streak.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-md border border-zinc-200 dark:border-zinc-800 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setUserCodeLang("cpp")}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                userCodeLang === "cpp"
                  ? "bg-zinc-900 text-white dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              C++
            </button>
            <button
              type="button"
              onClick={() => setUserCodeLang("python")}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                userCodeLang === "python"
                  ? "bg-zinc-900 text-white dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Python
            </button>
            <button
              type="button"
              onClick={() => setUserCodeLang("java")}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                userCodeLang === "java"
                  ? "bg-zinc-900 text-white dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Java
            </button>
          </div>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleSubmitCode} className="space-y-4">
          <div className="relative">
            <textarea
              rows={8}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder={`// Paste your solved ${userCodeLang.toUpperCase()} code here...\n// e.g. class Solution {\n//   public int search(...) {\n//     ...\n//   }\n// }`}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 p-3.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {submittedStreak !== null ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Day {dayNumber} Solved! Current Streak: {submittedStreak} Days 🔥</span>
                </div>
                {commitUrl && (
                  <Link
                    href={commitUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white underline underline-offset-2"
                  >
                    <GitCommit className="h-3 w-3" />
                    <span>View Commit on GitHub ↗</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>Auto-commits solution + problem README to your GitHub repo.</span>
              </div>
            )}

            {user ? (
              <Button
                type="submit"
                variant="default"
                size="sm"
                isLoading={isSubmitting}
                className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-zinc-950 self-end sm:self-center"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Save & Push to GitHub
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={signInWithGithub}
                className="font-semibold text-xs self-end sm:self-center"
              >
                <GitHubIcon className="h-3.5 w-3.5 mr-1.5" />
                Sign in with GitHub to Save
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
