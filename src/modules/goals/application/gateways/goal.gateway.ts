import type {
  Goal,
  GoalInstance,
  CreateGoalCommand,
  UpdateGoalCommand,
  ListGoalsQuery,
} from "@/modules/goals/domain/entities/goal";

export interface GoalWithInstance extends Goal {
  activeInstance?: GoalInstance | null;
}

export interface GoalGateway {
  list(query?: ListGoalsQuery): Promise<Goal[]>;
  get(id: string): Promise<GoalWithInstance>;
  create(command: CreateGoalCommand): Promise<GoalWithInstance>;
  update(command: UpdateGoalCommand): Promise<Goal>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<Goal>;
  listInstances(goalId: string): Promise<GoalInstance[]>;
}
