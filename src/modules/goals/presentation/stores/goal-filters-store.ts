"use client";

import { create } from "zustand";
import type { GoalType } from "@/modules/goals/domain/enums/goal-type";

type StatusFilter = "active" | "completed" | "all";
type ViewMode = "grid" | "list";

interface GoalFiltersState {
  query: string;
  categoryId: string | null;
  type: GoalType | "all";
  status: StatusFilter;
  view: ViewMode;
  setQuery: (q: string) => void;
  setCategoryId: (id: string | null) => void;
  setType: (t: GoalType | "all") => void;
  setStatus: (s: StatusFilter) => void;
  setView: (v: ViewMode) => void;
  clearFilters: () => void;
}

export const useGoalFilters = create<GoalFiltersState>((set) => ({
  query: "",
  categoryId: null,
  type: "all",
  status: "active",
  view: "grid",
  setQuery: (query) => set({ query }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setType: (type) => set({ type }),
  setStatus: (status) => set({ status }),
  setView: (view) => set({ view }),
  clearFilters: () => set({ query: "", categoryId: null, type: "all" }),
}));
