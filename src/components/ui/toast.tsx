"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback(
    ({ type = "info", title, message }: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5",
              toast.type === "success" && "border-emerald-800/60 bg-zinc-900 text-emerald-300",
              toast.type === "error" && "border-rose-800/60 bg-zinc-900 text-rose-300",
              toast.type === "info" && "border-zinc-800 bg-zinc-900 text-zinc-200"
            )}
          >
            {toast.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />}
            {toast.type === "info" && <Info className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />}
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-zinc-100">{toast.title}</h4>
              {toast.message && <p className="mt-0.5 text-xs text-zinc-400">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
      toasts: [],
      removeToast: () => {},
    };
  }
  return context;
}
