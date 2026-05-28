import { serverContainer } from "@/shared/composition/server-container";
import { GoalListScreen } from "@/modules/goals";
import {
  createGoalAction,
  updateGoalAction,
  deleteGoalAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const container = await serverContainer();
  const [goals, categories] = await Promise.all([
    container.goals.list.execute().catch(() => []),
    container.categories.list.execute().catch(() => []),
  ]);

  return (
    <GoalListScreen
      initialGoals={goals}
      categories={categories}
      createAction={createGoalAction}
      updateAction={updateGoalAction}
      deleteAction={deleteGoalAction}
    />
  );
}
