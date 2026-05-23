import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../config/api";
import { useCartStore } from "./cartStore";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  hydrated: boolean;
  setStatus: (status: AuthStatus) => void;
  setHydrated: (hydrated: boolean) => void;
  signIn: (payload: { user: AuthUser; token: string }) => void;
  signOut: () => void;
  restoreSession: () => Promise<void>;
};

const AUTH_TOKEN_KEY = "authToken";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: "loading",
      hydrated: false,
      setStatus: (status) => set({ status }),
      setHydrated: (hydrated) => set({ hydrated }),
      signIn: ({ user, token }) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        set({ user, token, status: "authenticated" });
        void (async () => {
          try {
            const res = await apiClient.getCart();
            const cart = res.data.data;
            useCartStore.getState().setCart(cart.items, cart.subtotal);
          } catch {
            // Ignore cart hydration errors; auth interceptor handles invalid tokens.
          }
        })();
      },
      signOut: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        useCartStore.getState().resetCart();
        set({ user: null, token: null, status: "unauthenticated" });
      },
      restoreSession: async () => {
        const stateToken = get().token;
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const token = stateToken || storedToken;

        if (!token) {
          useCartStore.getState().resetCart();
          set({ status: "unauthenticated", hydrated: true });
          return;
        }

        if (!stateToken && token) {
          set({ token });
        }
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        const existingUser = get().user;
        set({
          status: "authenticated",
          hydrated: true,
          user: existingUser ?? get().user,
        });
        try {
          const res = await apiClient.getMe();
          const profile = res.data.data;
          set({
            user: { id: profile.id, name: profile.name, email: profile.email },
            status: "authenticated",
            hydrated: true,
          });
          try {
            const cartRes = await apiClient.getCart();
            const cart = cartRes.data.data;
            useCartStore.getState().setCart(cart.items, cart.subtotal);
          } catch {
            // Cart hydration is best-effort; avoid blocking session restore.
          }
        } catch (error: any) {
          const status = error?.response?.status;
          if (status === 401 || status === 403) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            set({ user: null, token: null, status: "unauthenticated", hydrated: true });
            useCartStore.getState().resetCart();
          } else {
            set({ status: "authenticated", hydrated: true });
          }
        }
      },
    }),
    {
      name: "amazon-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        void state.restoreSession();
      },
    }
  )
);
