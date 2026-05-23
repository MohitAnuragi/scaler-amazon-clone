import { useEffect } from "react";
import type { Toast as ToastType } from "../../store/uiStore";

type ToastProps = {
  toast: ToastType;
  onClose: (id: string) => void;
};

const colorMap: Record<ToastType["type"], string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-orange-500",
  info: "bg-blue-600",
};

export const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      className={`flex w-full items-center gap-3 rounded px-4 py-3 text-sm text-white shadow ${colorMap[toast.type]}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        className="text-white/80 hover:text-white"
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};
