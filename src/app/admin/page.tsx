"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  FileEdit,
  Clock,
  Eye,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { getAllAdminDays } from "@/lib/mock-data";
import { WorkflowStepper } from "@/components/admin/workflow-stepper";
import { UrlInputForm } from "@/components/admin/url-input-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const allDays = getAllAdminDays();

  const [activeTab, setActiveTab] = React.useState<"new" | "drafts" | "published">("new");

  const drafts = allDays.filter((d) => d.status === "draft");
  const published = allDays.filter((d) => d.status === "published");

  const handlePipelineSubmit = (data: { dayNumber: number; topic: string; urls: string[] }) => {
    showToast({
      type: "success",
      title: "AI Generation Complete",
      message: `Scraped ${data.urls.length} problems & generated Day ${data.dayNumber} draft.`,
    });
    router.push(`/admin/days/${data.dayNumber}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Publishing Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Curate daily DSA problems, orchestrate AI pedagogical generation, and broadcast WhatsApp announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "new" ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveTab("new")}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            New Challenge Pipeline
          </Button>
        </div>
      </div>

      {/* Visual Pipeline Workflow Banner */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Publishing Workflow Pipeline
        </h2>
        <WorkflowStepper currentStepIndex={0} />
      </section>

      {/* Pipeline Input Card */}
      {activeTab === "new" && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Create Day & Trigger AI Pipeline
            </h3>
          </div>
          <UrlInputForm onSubmit={handlePipelineSubmit} />
        </section>
      )}

      {/* Drafts Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Active Drafts ({drafts.length})
          </h2>
        </div>

        {drafts.length > 0 ? (
          <div className="grid gap-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-amber-900/40 bg-amber-950/10 hover:border-amber-700/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded">
                      Day {draft.dayNumber}
                    </span>
                    <Badge variant="draft">Draft in Review</Badge>
                    <span className="text-xs text-zinc-400">
                      {draft.problemCount} problems
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {draft.topic}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Generated via {draft.generationMetadata?.providerUsed || "Gemini"} • Last updated {formatDate(draft.updatedAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link href={`/admin/days/${draft.dayNumber}`}>
                    <Button variant="default" size="sm">
                      <FileEdit className="h-3.5 w-3.5 mr-1.5" />
                      Review & Publish
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 text-center text-xs text-zinc-400">
            No pending drafts. Start a new day above!
          </div>
        )}
      </section>

      {/* Published Days History */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Published Days History ({published.length})
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 divide-y divide-zinc-800 overflow-hidden">
          {published.map((day) => (
            <div
              key={day.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-zinc-900/60 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-zinc-300">
                    Day {day.dayNumber}
                  </span>
                  <Badge variant="published">Published</Badge>
                  <span className="text-xs text-zinc-400">
                    {day.problems.length} problems
                  </span>
                </div>
                <h3 className="text-sm font-medium text-zinc-200">
                  {day.topic}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link href={`/day/${day.dayNumber}`} target="_blank">
                  <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-zinc-200">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Public View
                  </Button>
                </Link>
                <Link href={`/admin/days/${day.dayNumber}`}>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <FileEdit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
