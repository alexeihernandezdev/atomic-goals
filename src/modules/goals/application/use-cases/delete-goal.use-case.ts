import type { GoalGateway } from "../gateways/goal.gateway";

export class DeleteGoalUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(id: string): Promise<void> {
    return this.gateway.delete(id);
  }
}
