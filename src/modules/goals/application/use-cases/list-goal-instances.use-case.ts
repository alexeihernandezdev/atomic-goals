import type { GoalGateway } from "../gateways/goal.gateway";
import type { GoalInstance } from "@/modules/goals/domain/entities/goal";

export class ListGoalInstancesUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(goalId: string): Promise<GoalInstance[]> {
    return this.gateway.listInstances(goalId);
  }
}
