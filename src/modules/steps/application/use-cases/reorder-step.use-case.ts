import type { StepGateway } from "../gateways/step.gateway";

export class ReorderStepUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(id: string, newOrder: number): Promise<void> {
    return this.gateway.reorder(id, newOrder);
  }
}
