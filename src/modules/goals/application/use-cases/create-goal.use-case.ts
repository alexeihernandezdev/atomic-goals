import type { GoalGateway, GoalWithInstance } from "../gateways/goal.gateway";
import type { CreateGoalCommand } from "@/modules/goals/domain/entities/goal";

export class CreateGoalUseCase {
  constructor(private readonly gateway: GoalGateway) {}
  async execute(command: CreateGoalCommand): Promise<GoalWithInstance> {
    return this.gateway.create(command);
  }
}
