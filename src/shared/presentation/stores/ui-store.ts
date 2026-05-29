"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getItem,
  setItem,
} from "@/shared/infrastructure/storage/local-storage";

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "ag-ui",
      storage: {
        getItem: (name) => {
          const value = getItem<{ state: UiState }>(name);
          return value ? { state: value.state } : null;
        },
        setItem: (name, value) => setItem(name, value),
        removeItem: (name) => {
          if (typeof window !== "undefined")
            window.localStorage.removeItem(name);
        },
      },
    },
  ),
);
