import type { GoalGateway, GoalWithInstance } from "../gateways/goal.gateway";

export class GetGoalUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(id: string): Promise<GoalWithInstance> {
    return this.gateway.get(id);
  }
}
