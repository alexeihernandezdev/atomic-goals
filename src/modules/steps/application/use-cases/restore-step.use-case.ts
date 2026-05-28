import type { StepGateway } from "../gateways/step.gateway";
import type { Step } from "../../domain/entities/step";

export class RestoreStepUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(id: string): Promise<Step> {
    return this.gateway.restore(id);
  }
}
