import type { GoalGateway } from "../gateways/goal.gateway";
import type { Goal, UpdateGoalCommand } from "@/modules/goals/domain/entities/goal";

export class UpdateGoalUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(command: UpdateGoalCommand): Promise<Goal> {
    return this.gateway.update(command);
  }
}
