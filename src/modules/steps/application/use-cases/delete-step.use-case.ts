import type { StepGateway } from "../gateways/step.gateway";

export class DeleteStepUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(id: string): Promise<void> {
    return this.gateway.delete(id);
  }
}
