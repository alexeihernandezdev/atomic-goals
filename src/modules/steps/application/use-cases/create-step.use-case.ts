import type { StepGateway } from "../gateways/step.gateway";
import type { Step, CreateStepCommand } from "../../domain/entities/step";

export class CreateStepUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(command: CreateStepCommand): Promise<Step> {
    return this.gateway.create(command);
  }
}
