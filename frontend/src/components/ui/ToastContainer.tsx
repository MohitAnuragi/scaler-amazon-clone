import { useUIStore } from "../../store/uiStore";
import { Toast } from "./Toast";

export const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore();
  if (!toasts.length) return null;

  return (
    <div className="fixed right-6 top-6 z-50 flex w-80 flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-[slide-in_0.3s_ease-out]"
        >
          <Toast toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};
