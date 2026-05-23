import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type UIState = {
  searchQuery: string;
  selectedCategory: string | null;
  toasts: Toast[];
  setSearch: (query: string) => void;
  setCategory: (category: string | null) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      searchQuery: "",
      selectedCategory: null,
      toasts: [],
      setSearch: (query) => set({ searchQuery: query }),
      setCategory: (category) => set({ selectedCategory: category }),
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { ...toast, id: `${Date.now()}-${Math.random()}` },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
    }),
    { name: "amazon-ui" }
  )
);
