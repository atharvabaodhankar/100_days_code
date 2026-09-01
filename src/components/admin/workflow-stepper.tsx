import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
}

export function WorkflowStepper({
  currentStepIndex = 0,
}: {
  currentStepIndex?: number;
}) {
  const steps: { id: string; label: string }[] = [
    { id: "urls", label: "Paste URLs" },
    { id: "fetch", label: "Fetch & Parse" },
    { id: "generate", label: "AI Generate" },
    { id: "review", label: "Review & Edit" },
    { id: "publish", label: "Publish Day" },
    { id: "whatsapp", label: "WhatsApp Broadcast" },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1">
        {steps.map((step, idx) => {
          const isComplete = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.id} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                  isComplete && "bg-emerald-950/40 text-emerald-300 border-emerald-800/40",
                  isCurrent && "bg-zinc-800 text-zinc-100 border-zinc-600 shadow-xs",
                  !isComplete && !isCurrent && "bg-zinc-950/40 text-zinc-500 border-zinc-850"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="font-mono text-[10px] text-zinc-400">{idx + 1}.</span>
                )}
                <span>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="h-3 w-3 text-zinc-700 shrink-0 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
