import type { GoalGateway } from "../gateways/goal.gateway";
import type { Goal, ListGoalsQuery } from "@/modules/goals/domain/entities/goal";

export class ListGoalsUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(query?: ListGoalsQuery): Promise<Goal[]> {
    return this.gateway.list(query);
  }
}
