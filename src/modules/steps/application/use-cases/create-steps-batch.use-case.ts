import type { StepGateway } from "../gateways/step.gateway";
import type { Step, CreateStepsBatchCommand } from "../../domain/entities/step";

export class CreateStepsBatchUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(command: CreateStepsBatchCommand): Promise<Step[]> {
    return this.gateway.createBatch(command);
  }
}
