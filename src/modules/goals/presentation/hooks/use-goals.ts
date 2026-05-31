"use client";

import * as React from "react";

import type { Goal } from "@/modules/goals/domain/entities/goal";

import { clientContainer } from "@/shared/composition/client-container";

import { handleClientUnauthorized } from "@/shared/presentation/auth/session-expired-client";

export function useGoals(initial: Goal[]) {
  const [goals, setGoals] = React.useState<Goal[]>(initial);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setGoals(initial);
  }, [initial]);

  const refresh = React.useCallback(async () => {
    setLoading(true);

    try {
      const result = await clientContainer().goals.list.execute();

      setGoals(result);
    } catch (e) {
      if (handleClientUnauthorized(e)) return;

      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeGoal = React.useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { goals, setGoals, loading, refresh, removeGoal };
}
