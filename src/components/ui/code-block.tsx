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
        "relative rounded-lg border border-zinc-800 bg-[#0d0d11] text-zinc-100 overflow-hidden text-xs sm:text-sm font-mono my-3 shadow-sm",
        className
      )}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/60 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-zinc-600"></span>
          <span className="text-zinc-400 font-medium uppercase text-[11px] tracking-wider">
            {language}
          </span>
          <span className="text-zinc-600 text-[11px]">({lines.length} lines)</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-700/40 transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Horizontal Scroll */}
      <div className="overflow-x-auto p-4 leading-relaxed font-mono">
        <pre className="flex">
          {showLineNumbers && (
            <div
              className="select-none text-zinc-600 text-right pr-4 border-r border-zinc-800/80 mr-4 font-mono text-xs"
              aria-hidden="true"
            >
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <code className="text-zinc-200 flex-1 whitespace-pre leading-6">
            {lines.map((line, i) => (
              <div key={i}>{line || "\n"}</div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
