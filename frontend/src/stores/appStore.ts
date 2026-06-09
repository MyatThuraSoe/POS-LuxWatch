import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "../config/constants";

export type ThemeMode = "light" | "dark";

export type NotificationItem = {
  id: string;
  title: string;
  message?: string;
  variant?: "info" | "success" | "warning" | "error";
  createdAt: string;
};

type AppState = {
  theme: ThemeMode;
  sidebarOpen: boolean;
  notifications: NotificationItem[];
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  pushNotification: (notification: Omit<NotificationItem, "id" | "createdAt">) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
};

function createId() {
  return crypto.randomUUID();
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      sidebarOpen: false,
      notifications: [],
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      pushNotification: (notification) =>
        set({
          notifications: [
            {
              ...notification,
              id: createId(),
              createdAt: new Date().toISOString(),
            },
            ...get().notifications,
          ],
        }),
      dismissNotification: (id) =>
        set({
          notifications: get().notifications.filter((notification) => notification.id !== id),
        }),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    },
  ),
);
