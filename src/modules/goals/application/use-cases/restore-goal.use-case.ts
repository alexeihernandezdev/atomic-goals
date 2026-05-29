import type { GoalGateway } from "../gateways/goal.gateway";
import type { Goal } from "@/modules/goals/domain/entities/goal";

export class RestoreGoalUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(id: string): Promise<Goal> {
    return this.gateway.restore(id);
  }
}
