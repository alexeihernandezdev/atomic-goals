import type {
  Step,
  CreateStepCommand,
  CreateStepsBatchCommand,
  UpdateStepMetadataCommand,
  UpdateStepProgressCommand,
} from "@/modules/steps/domain/entities/step";

export interface StepGateway {
  listByInstance(goalInstanceId: string): Promise<Step[]>;
  get(id: string): Promise<Step>;
  create(command: CreateStepCommand): Promise<Step>;
  createBatch(command: CreateStepsBatchCommand): Promise<Step[]>;
  updateMetadata(command: UpdateStepMetadataCommand): Promise<Step>;
  updateProgress(command: UpdateStepProgressCommand): Promise<Step>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<Step>;
  reorder(id: string, newOrder: number): Promise<void>;
}
