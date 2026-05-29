"use client";

import { useState, useCallback } from "react";
import type { Goal } from "@/modules/goals/domain/entities/goal";
import { clientContainer } from "@/shared/composition/client-container";

export function useGoals(initial: Goal[]) {
  const [goals, setGoals] = useState<Goal[]>(initial);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await clientContainer().goals.list.execute();
      setGoals(result);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { goals, setGoals, loading, refresh, removeGoal };
}
