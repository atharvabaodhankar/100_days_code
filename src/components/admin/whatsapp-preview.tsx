"use client";

import * as React from "react";
import { Copy, Check, Lock, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

export function WhatsAppPreview({
  message,
  dayNumber,
}: {
  message: string;
  dayNumber: number;
}) {
  const [copied, setCopied] = React.useState(false);

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
    <div className="rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-[#0d1410] p-5 space-y-4 shadow-xs relative overflow-hidden transition-colors">
      {/* Visual security ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-emerald-200 dark:border-emerald-900/40">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              Private Admin Content
              <span className="text-[10px] lowercase font-normal px-1.5 py-0.5 rounded bg-emerald-200/60 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40">
                admin-only
              </span>
            </h3>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
              This message is never rendered on public student pages. Copy to post in WhatsApp group.
            </p>
          </div>
        </div>

        {/* Copy CTA */}
        <Button
          type="button"
          onClick={handleCopy}
          variant="secondary"
          size="sm"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800/60 shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5 text-emerald-700 dark:text-emerald-400" />
              <span>Copy WhatsApp Message</span>
            </>
          )}
        </Button>
      </div>

      {/* Formatted Message Bubble Preview */}
      <div className="relative rounded-lg border border-emerald-200 dark:border-emerald-950 bg-white dark:bg-[#070b09] p-4 text-xs font-mono text-emerald-950 dark:text-emerald-100 whitespace-pre-wrap leading-relaxed shadow-inner">
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-500 font-sans uppercase tracking-wider mb-2 select-none border-b border-emerald-100 dark:border-emerald-950 pb-1.5">
          <MessageSquare className="h-3 w-3" />
          <span>WhatsApp Broadcast Draft Preview (Day {dayNumber})</span>
        </div>
        {message}
      </div>
    </div>
  );
}
