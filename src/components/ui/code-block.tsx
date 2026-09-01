"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

/**
 * Lightweight, robust syntax highlighter for C++, Python, and Java
 * with high-contrast dual theme support (Light & Dark).
 */
function highlightLine(line: string, lang: string): React.ReactNode {
  if (!line) return "\n";

  // 1. Comments
  if (lang === "python" && line.trim().startsWith("#")) {
    return <span className="text-zinc-500 dark:text-zinc-400 italic">{line}</span>;
  }
  if ((lang === "cpp" || lang === "java") && line.trim().startsWith("//")) {
    return <span className="text-zinc-500 dark:text-zinc-400 italic">{line}</span>;
  }

  // Handle inline comments
  let mainCode = line;
  let inlineComment = "";

  if (lang === "python" && line.includes("#")) {
    const idx = line.indexOf("#");
    mainCode = line.slice(0, idx);
    inlineComment = line.slice(idx);
  } else if ((lang === "cpp" || lang === "java") && line.includes("//")) {
    const idx = line.indexOf("//");
    mainCode = line.slice(0, idx);
    inlineComment = line.slice(idx);
  }

  // Tokenize strings, keywords, types, numbers, functions
  const tokens = mainCode.split(/(".*?"|'.*?'|\b(?:class|public|private|protected|static|void|int|double|float|bool|boolean|char|string|std::vector|vector|std|std::swap|swap|return|if|else|for|while|def|import|from|in|range|new|sizeof|const)\b|\b\d+\b|[{}()[\];,])/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (!token) return null;

        // Strings
        if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
          return (
            <span key={i} className="text-emerald-600 dark:text-emerald-400 font-medium">
              {token}
            </span>
          );
        }

        // Keywords
        if (/^(class|def|return|if|else|for|while|import|from|in|new)$/.test(token)) {
          return (
            <span key={i} className="text-purple-600 dark:text-purple-400 font-semibold">
              {token}
            </span>
          );
        }

        // Types & Access Modifiers
        if (/^(public|private|protected|static|void|int|double|float|bool|boolean|char|string|std::vector|vector|std|const)$/.test(token)) {
          return (
            <span key={i} className="text-blue-600 dark:text-blue-400 font-medium">
              {token}
            </span>
          );
        }

        // Functions / Builtins
        if (/^(std::swap|swap|range|sizeof|selectionSort|sort)$/.test(token)) {
          return (
            <span key={i} className="text-amber-600 dark:text-amber-400 font-medium">
              {token}
            </span>
          );
        }

        // Numbers
        if (/^\d+$/.test(token)) {
          return (
            <span key={i} className="text-orange-600 dark:text-orange-400">
              {token}
            </span>
          );
        }

        // Default code text
        return <span key={i} className="text-zinc-800 dark:text-zinc-200">{token}</span>;
      })}
      {inlineComment && (
        <span className="text-zinc-500 dark:text-zinc-400 italic">{inlineComment}</span>
      )}
    </>
  );
}

export function CodeBlock({
  code,
  language = "cpp",
  className,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const lines = code.trim().split("\n");

  return (
    <div
      className={cn(
        "relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden text-xs sm:text-[13px] font-mono my-3 shadow-xs transition-colors",
        className
      )}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400/80"></span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
          </div>
          <span className="text-zinc-700 dark:text-zinc-300 font-semibold uppercase text-[11px] tracking-wider ml-1">
            {language}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">({lines.length} lines)</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/60 shadow-2xs transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Dual-Theme Syntax Highlight */}
      <div className="overflow-x-auto p-4 leading-relaxed font-mono">
        <pre className="flex">
          {showLineNumbers && (
            <div
              className="select-none text-zinc-400 dark:text-zinc-600 text-right pr-3.5 border-r border-zinc-200 dark:border-zinc-800 mr-3.5 font-mono text-xs"
              aria-hidden="true"
            >
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <code className="flex-1 whitespace-pre leading-6">
            {lines.map((line, i) => (
              <div key={i}>{highlightLine(line, language.toLowerCase())}</div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
