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
  const categories = await container.categories.list.execute().catch(() => []);

  return (
    <CategoryListScreen
      initialCategories={categories}
      createAction={createCategoryAction}
      updateAction={updateCategoryAction}
      deleteAction={deleteCategoryAction}
    />
  );
}
