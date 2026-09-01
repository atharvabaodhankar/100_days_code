"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FileEdit,
  Clock,
  Eye,
  CheckCircle2,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { getAllAdminDays, saveAdminDraft } from "@/lib/firebase/firestore";
import { AdminDay } from "@/types";
import { WorkflowStepper } from "@/components/admin/workflow-stepper";
import { UrlInputForm } from "@/components/admin/url-input-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [days, setDays] = React.useState<AdminDay[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"new" | "drafts" | "published">("new");

  const loadDays = React.useCallback(async () => {
    try {
      const fetched = await getAllAdminDays();
      setDays(fetched);
    } catch (err) {
      console.error("Failed to load admin days:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDays();
  }, [loadDays]);

  const drafts = days.filter((d) => d.status === "draft");
  const published = days.filter((d) => d.status === "published");

  const handlePipelineSubmit = async (data: {
    dayNumber: number;
    topic: string;
    urls: string[];
    generatedDay?: AdminDay;
  }) => {
    if (data.generatedDay) {
      try {
        await saveAdminDraft(data.generatedDay);
      } catch (e) {
        console.warn("Could not write draft to Firestore directly:", e);
      }
    }
    showToast({
      type: "success",
      title: "Draft Created",
      message: `Day ${data.dayNumber} ready for editorial review.`,
    });
    router.push(`/admin/days/${data.dayNumber}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            Publishing Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Curate daily DSA problems, orchestrate AI pedagogical generation, and broadcast WhatsApp announcements via Firestore.
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
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Publishing Workflow Pipeline
        </h2>
        <WorkflowStepper currentStepIndex={0} />
      </section>

      {/* Pipeline Input Card */}
      {activeTab === "new" && (
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Create Day & Trigger AI Pipeline
            </h3>
          </div>
          <UrlInputForm onSubmit={handlePipelineSubmit} />
        </section>
      )}

      {/* Drafts Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            Active Drafts ({drafts.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 text-center flex items-center justify-center gap-2 text-xs text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading drafts from Firestore...</span>
          </div>
        ) : drafts.length > 0 ? (
          <div className="grid gap-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/10 hover:border-amber-300 dark:hover:border-amber-700/60 transition-colors shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-amber-100/80 dark:bg-zinc-800 px-2 py-0.5 rounded border border-amber-200 dark:border-zinc-700/50">
                      Day {draft.dayNumber}
                    </span>
                    <Badge variant="draft">Draft in Review</Badge>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {draft.problemCount} problems
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {draft.topic}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 text-center text-xs text-zinc-500 dark:text-zinc-400 shadow-xs">
            No pending drafts. Start a new day above!
          </div>
        )}
      </section>

      {/* Published Days History */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Published Days History ({published.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 text-center flex items-center justify-center gap-2 text-xs text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading published days from Firestore...</span>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-xs">
            {published.map((day) => (
              <div
                key={day.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-300">
                      Day {day.dayNumber}
                    </span>
                    <Badge variant="published">Published</Badge>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {day.problems.length} problems
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                    {day.topic}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link href={`/day/${day.dayNumber}`} target="_blank">
                    <Button variant="ghost" size="sm" className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">
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
        )}
      </section>
    </div>
  );
}
