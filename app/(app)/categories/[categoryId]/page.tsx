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

  const category = await container.categories.get
    .execute(categoryId)
    .catch(() => null);

  if (!category) notFound();

  return (
    <CategoryDetailScreen
      category={category}
      updateAction={updateCategoryAction}
      deleteAction={deleteCategoryAction}
    />
  );
}
