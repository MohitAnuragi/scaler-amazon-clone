import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

/** Ensures persisted auth is validated against the API on app load. */
export const useAuthInit = () => {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) {
      void restoreSession();
    }
  }, [hydrated, restoreSession]);
};
