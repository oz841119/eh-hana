import { create } from "zustand";
import { fetchMe, logout as logoutApi, type AuthUser } from "@/lib/auth";

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  init: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  loading: true,

  init: async () => {
    set({ loading: true });
    const user = await fetchMe();
    set({ user, isLoggedIn: !!user, loading: false });
  },

  logout: async () => {
    await logoutApi();
    set({ user: null, isLoggedIn: false });
  },
}));
