import type { StepGateway } from "../gateways/step.gateway";
import type { Step } from "../../domain/entities/step";

export class ListStepsUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(goalInstanceId: string): Promise<Step[]> {
    return this.gateway.listByInstance(goalInstanceId);
  }
}
