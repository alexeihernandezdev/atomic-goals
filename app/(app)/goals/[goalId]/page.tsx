import { notFound } from "next/navigation";
import { serverContainer } from "@/shared/composition/server-container";
import { GoalDetailScreen } from "@/modules/goals";
import { updateGoalAction, deleteGoalAction } from "../actions";
import {
  createStepAction,
  updateStepMetadataAction,
  updateStepProgressAction,
  reorderStepAction,
  deleteStepAction,
} from "./steps-actions";

export const dynamic = "force-dynamic";

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;
  const container = await serverContainer();

  const [goal, categories] = await Promise.all([
    container.goals.get.execute(goalId).catch(() => null),
    container.categories.list.execute().catch(() => []),
  ]);

  if (!goal) notFound();

  const [instances, steps] = await Promise.all([
    container.goals.listInstances.execute(goalId).catch(() => []),
    goal.activeInstance
      ? container.steps.list.execute(goal.activeInstance.id).catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <GoalDetailScreen
      goal={goal}
      instances={instances}
      initialSteps={steps}
      categories={categories}
      updateAction={updateGoalAction}
      deleteAction={deleteGoalAction}
      createStepAction={createStepAction}
      updateStepMetadataAction={updateStepMetadataAction}
      updateStepProgressAction={updateStepProgressAction}
      reorderStepAction={reorderStepAction}
      deleteStepAction={deleteStepAction}
    />
  );
}
