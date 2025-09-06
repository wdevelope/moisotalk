"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastVariant = "info" | "success" | "error";
type Toast = { id: number; message: string; variant: ToastVariant };

type ToastContextType = {
  show: (
    message: string,
    opts?: { variant?: ToastVariant; durationMs?: number }
  ) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(
    (
      message: string,
      opts?: { variant?: ToastVariant; durationMs?: number }
    ) => {
      const id = idRef.current++;
      const variant = opts?.variant ?? "info";
      const duration = opts?.durationMs ?? 3500;
      setToasts((t) => [...t, { id, message, variant }]);
      window.setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 px-2 w-full max-w-md">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto rounded-lg border shadow-md px-4 py-3 text-sm md:text-base transition-all",
              t.variant === "success" && "bg-mint/10 border-mint/30 text-mint",
              t.variant === "error" &&
                "bg-orange/10 border-orange/30 text-orange",
              t.variant === "info" &&
                "bg-accent/10 border-accent/30 text-accent",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
