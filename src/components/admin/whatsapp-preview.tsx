"use client";

import * as React from "react";
import { Copy, Check, Lock, MessageSquare, ExternalLink, Edit3, Eye } from "lucide-react";
import { Button } from "../ui/button";

/**
 * Parses WhatsApp formatting syntax:
 * - *bold text* -> <strong>
 * - _italic text_ -> <em>
 * - ~strikethrough~ -> <del>
 * - ```code``` -> <code>
 * - https://... -> <a>
 */
function renderWhatsAppFormatted(text: string): React.ReactNode {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={lineIdx} className="h-2" />;
    }

    // Horizontal separator
    if (line.trim() === "---") {
      return (
        <hr
          key={lineIdx}
          className="my-2 border-zinc-200 dark:border-zinc-700/60"
        />
      );
    }

    // Tokenize WhatsApp formatting tokens and URLs
    const parts = line.split(/(\*.*?\*|_.*?_|~.*?~|https?:\/\/[^\s]+)/g);

    return (
      <div key={lineIdx} className="leading-relaxed">
        {parts.map((part, partIdx) => {
          if (!part) return null;

          // *bold*
          if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return (
              <strong key={partIdx} className="font-bold text-zinc-950 dark:text-zinc-50">
                {part.slice(1, -1)}
              </strong>
            );
          }

          // _italic_
          if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
            return (
              <em key={partIdx} className="italic text-zinc-800 dark:text-zinc-200">
                {part.slice(1, -1)}
              </em>
            );
          }

          // ~strike~
          if (part.startsWith("~") && part.endsWith("~") && part.length > 2) {
            return (
              <del key={partIdx} className="line-through text-zinc-400">
                {part.slice(1, -1)}
              </del>
            );
          }

          // URLs
          if (part.startsWith("http://") || part.startsWith("https://")) {
            return (
              <a
                key={partIdx}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono inline-flex items-center gap-0.5"
              >
                <span>{part}</span>
                <ExternalLink className="h-2.5 w-2.5 inline" />
              </a>
            );
          }

          return <span key={partIdx}>{part}</span>;
        })}
      </div>
    );
  });
}

export function WhatsAppPreview({
  message,
  dayNumber,
}: {
  message: string;
  dayNumber: number;
}) {
  const [copied, setCopied] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"formatted" | "raw">("formatted");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy WhatsApp message:", err);
    }
  };

  return (
    <div className="rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-[#0c140f] p-5 space-y-4 shadow-xs relative overflow-hidden transition-colors">
      {/* Header & Copy CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-emerald-200 dark:border-emerald-900/40">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              WhatsApp Broadcast Announcement
              <span className="text-[10px] lowercase font-normal px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40">
                admin-only
              </span>
            </h3>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
              Formatted for direct pasting into your WhatsApp student announcement channel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Mode Switcher */}
          <div className="flex items-center bg-white dark:bg-zinc-900 p-0.5 rounded-lg border border-emerald-200 dark:border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode("formatted")}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === "formatted"
                  ? "bg-emerald-600 text-white font-medium shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === "raw"
                  ? "bg-emerald-600 text-white font-medium shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Edit3 className="h-3 w-3" />
              <span>Raw Text</span>
            </button>
          </div>

          {/* Copy Button */}
          <Button
            type="button"
            onClick={handleCopy}
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-zinc-950 font-semibold shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                <span>Copy WhatsApp Message</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Realistic WhatsApp Chat Bubble Container */}
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-emerald-200/80 dark:border-zinc-800 bg-[#e7f8ef]/60 dark:bg-[#111b15] p-3 sm:p-4 shadow-sm">
          {/* Chat Bubble */}
          <div className="rounded-xl bg-white dark:bg-[#1f2c24] border border-emerald-100 dark:border-emerald-950/60 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-zinc-100 dark:border-zinc-800/80 text-[11px] text-emerald-700 dark:text-emerald-400 font-sans font-medium">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp Chat Message Preview (Day {dayNumber})</span>
            </div>

            {viewMode === "formatted" ? (
              <div className="text-xs sm:text-[13px] text-zinc-900 dark:text-zinc-100 font-sans space-y-1.5 selection:bg-emerald-200 dark:selection:bg-emerald-900">
                {renderWhatsAppFormatted(message)}
              </div>
            ) : (
              <div className="text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                {message}
              </div>
            )}

            <div className="text-right text-[10px] text-zinc-400 dark:text-zinc-500 pt-2 font-sans select-none">
              Just now • WhatsApp Broadcast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
