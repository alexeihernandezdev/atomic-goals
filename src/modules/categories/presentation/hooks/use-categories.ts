"use client";



import * as React from "react";

import { clientContainer } from "@/shared/composition/client-container";

import type { Category } from "@/modules/categories/domain/entities/category";

import { handleClientUnauthorized } from "@/shared/presentation/auth/session-expired-client";



export function useCategories(initial: Category[] = []) {

  const [categories, setCategories] = React.useState<Category[]>(initial);

  const [loading, setLoading] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);



  React.useEffect(() => {

    setCategories(initial);

  }, [initial]);



  const refresh = React.useCallback(async () => {

    setLoading(true);

    setError(null);

    try {

      const list = await clientContainer().categories.list.execute();

      setCategories(list);

    } catch (e) {

      if (handleClientUnauthorized(e)) return;

      setError(e instanceof Error ? e.message : "Error al cargar categorías.");

    } finally {

      setLoading(false);

    }

  }, []);



  return { categories, setCategories, loading, error, refresh };

}

