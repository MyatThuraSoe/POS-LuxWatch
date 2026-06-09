import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "OWNER" | "EMPLOYEE";

export type UserRoleName = UserRole | "admin" | "owner" | "employee" | string;

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status?: string;
  role: UserRoleName;
  roles: UserRoleName[];
  permissions: string[];
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  intendedPath: string | null;
  setSession: (user: AuthUser, token: string, refreshToken?: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setIntendedPath: (path: string | null) => void;
  clearSession: () => void;
  updatePermissions: (permissions: string[]) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      intendedPath: null,
      setSession: (user, token, refreshToken = null) =>
        set({ user, token, refreshToken, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: Boolean(user || get().token) }),
      setIntendedPath: (intendedPath) => set({ intendedPath }),
      clearSession: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          intendedPath: null,
        }),
      updatePermissions: (permissions) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, permissions } });
        }
      },
    }),
    {
      name: "luxwatch-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
