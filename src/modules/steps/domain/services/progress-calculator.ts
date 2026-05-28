import type { Step } from "../entities/step";

export class ProgressCalculator {
  static forStep(step: Step): number {
    switch (step.type) {
      case "PROGRESS_BAR":
        if (step.target === 0) return 0;
        return Math.min(100, Math.round((step.current / step.target) * 100));
      case "CHECK":
        return step.done ? 100 : 0;
      case "STATUS": {
        const status = step.statuses.find((s) => s.id === step.currentStatusId);
        return status?.percentage ?? 0;
      }
      case "COUNTER":
        if (step.max === step.min) return 0;
        return Math.min(
          100,
          Math.round(
            ((step.current - step.min) / (step.max - step.min)) * 100,
          ),
        );
    }
  }

  static weightedAverage(steps: Step[]): number {
    const total = steps.reduce((sum, s) => sum + s.weight, 0);
    if (total === 0) return 0;
    const weighted = steps.reduce(
      (sum, s) => sum + ProgressCalculator.forStep(s) * s.weight,
      0,
    );
    return Math.round(weighted / total);
  }
}
