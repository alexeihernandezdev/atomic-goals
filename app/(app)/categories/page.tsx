import { serverContainer } from "@/shared/composition/server-container";
import { CategoryListScreen } from "@/modules/categories";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const container = await serverContainer();

  const [categories, goals] = await Promise.all([
    container.categories.list.execute().catch(() => []),
    container.goals.list.execute().catch(() => []),
  ]);

  const enriched = categories.map((cat) => {
    const catGoals = goals.filter((g) => g.categoryId === cat.id);
    const activeInstances = catGoals
      .map((g) => g.activeInstance)
      .filter((i) => i?.status === "IN_PROGRESS");
    const completedCount = catGoals.filter(
      (g) => g.activeInstance?.status === "COMPLETED",
    ).length;
    const avgProgress =
      activeInstances.length > 0
        ? Math.round(
            activeInstances.reduce((s, i) => s + (i?.progress ?? 0), 0) /
              activeInstances.length,
          )
        : 0;
    return {
      ...cat,
      goalCount: catGoals.length,
      activeGoals: activeInstances.length,
      completedGoals: completedCount,
      avgProgress,
    };
  });

  return (
    <CategoryListScreen
      initialCategories={enriched}
      createAction={createCategoryAction}
      updateAction={updateCategoryAction}
      deleteAction={deleteCategoryAction}
    />
  );
}
