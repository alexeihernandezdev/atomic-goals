import type { StepGateway } from "../gateways/step.gateway";
import type { Step, UpdateStepProgressCommand } from "../../domain/entities/step";

export class UpdateStepProgressUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(command: UpdateStepProgressCommand): Promise<Step> {
    return this.gateway.updateProgress(command);
  }
}
