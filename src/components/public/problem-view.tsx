"use client";

import * as React from "react";
import { ExternalLink, Lightbulb, Compass, Cpu, CheckCircle, Clock, Database, Tag } from "lucide-react";
import { Problem } from "@/types";
import { DifficultyBadge } from "../ui/badge";
import { CodeBlock } from "../ui/code-block";

export function ProblemView({ problem }: { problem: Problem }) {
  const [activeLang, setActiveLang] = React.useState<"cpp" | "python" | "java">("cpp");

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
        {/* Intuition / Observation */}
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

        {/* Key Concepts */}
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

      {/* Step-by-Step Logic & Algorithm */}
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

      {/* Dry Run */}
      {problem.dryRun && (
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
            <Cpu className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Dry Run & State Walkthrough
            </h3>
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-[#0d0d11] p-3.5 text-xs font-mono text-zinc-100 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
            {problem.dryRun}
          </div>
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

          {/* Language Switcher */}
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

        {/* Selected Code Display */}
        {activeLang === "cpp" && (
          <CodeBlock code={problem.solutions.cpp} language="cpp" />
        )}
        {activeLang === "python" && (
          <CodeBlock code={problem.solutions.python} language="python" />
        )}
        {activeLang === "java" && problem.solutions.java && (
          <CodeBlock code={problem.solutions.java} language="java" />
        )}
      </section>
    </div>
  );
}
