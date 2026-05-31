import { notFound } from "next/navigation";
import { serverContainer } from "@/shared/composition/server-container";
import { CategoryDetailScreen } from "@/modules/categories";
import { updateCategoryAction, deleteCategoryAction } from "../actions";

export const dynamic = "force-dynamic";

interface CategoryDetailPageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { categoryId } = await params;
  const container = await serverContainer();

  const [category, goals] = await Promise.all([
    container.categories.get.execute(categoryId).catch(() => null),
    container.goals.list.execute({ categoryId }).catch(() => []),
  ]);

  if (!category) notFound();

  const activeInstances = goals
    .map((g) => g.activeInstance)
    .filter((i) => i?.status === "IN_PROGRESS");
  const avgProgress =
    activeInstances.length > 0
      ? Math.round(
          activeInstances.reduce((s, i) => s + (i?.progress ?? 0), 0) /
            activeInstances.length,
        )
      : 0;

  const enrichedCategory = {
    ...category,
    goalCount: goals.length,
    activeGoals: activeInstances.length,
    completedGoals: goals.filter((g) => g.activeInstance?.status === "COMPLETED")
      .length,
    avgProgress,
  };

  return (
    <CategoryDetailScreen
      category={enrichedCategory}
      initialGoals={goals}
      updateAction={updateCategoryAction}
      deleteAction={deleteCategoryAction}
    />
  );
}
