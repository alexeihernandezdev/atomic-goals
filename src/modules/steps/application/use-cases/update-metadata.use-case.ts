import type { StepGateway } from "../gateways/step.gateway";
import type { Step, UpdateStepMetadataCommand } from "../../domain/entities/step";

export class UpdateStepMetadataUseCase {
  constructor(private readonly gateway: StepGateway) {}

  async execute(command: UpdateStepMetadataCommand): Promise<Step> {
    return this.gateway.updateMetadata(command);
  }
}
