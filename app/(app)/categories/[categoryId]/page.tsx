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

  return (
    <CategoryDetailScreen
      category={category}
      initialGoals={goals}
      updateAction={updateCategoryAction}
      deleteAction={deleteCategoryAction}
    />
  );
}
