import { useEffect, useState } from "react";
import { Heart, ShoppingBag, CheckCircle2, MessageCircle, Info } from "lucide-react";

export type ToastPayload = {
  id?: string;
  message: string;
  type?: "success" | "info" | "heart" | "cart" | "whatsapp";
  duration?: number;
};

export function showToast(message: string, type: ToastPayload["type"] = "success", duration = 3000) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<ToastPayload>("mm:toast", {
        detail: { id: Math.random().toString(36).slice(2), message, type, duration },
      })
    );
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastPayload>;
      if (!customEvent.detail) return;
      const newToast = {
        ...customEvent.detail,
        id: customEvent.detail.id || Math.random().toString(36).slice(2),
      };

      setToasts((prev) => [...prev.slice(-2), newToast]); // keep max 3 visible

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 3000);
    };

    window.addEventListener("mm:toast", handleToast);
    return () => window.removeEventListener("mm:toast", handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md"
    >
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-brand-deepPlum/95 backdrop-blur-md text-brand-ivory text-xs sm:text-sm font-medium shadow-xl border border-brand-lilac/30 animate-heart-burst pointer-events-auto transition-all"
          >
            {toast.type === "heart" && (
              <span className="w-6 h-6 rounded-full bg-brand-plum flex items-center justify-center shrink-0">
                <Heart className="w-3.5 h-3.5 text-brand-blush fill-brand-blush" />
              </span>
            )}
            {toast.type === "cart" && (
              <span className="w-6 h-6 rounded-full bg-brand-plum flex items-center justify-center shrink-0">
                <ShoppingBag className="w-3.5 h-3.5 text-brand-ivory" />
              </span>
            )}
            {toast.type === "whatsapp" && (
              <span className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
              </span>
            )}
            {toast.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="w-4 h-4 text-brand-lilac shrink-0" />
            )}
            <span className="tracking-wide">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
