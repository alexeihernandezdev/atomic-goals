import { z } from "zod";

export const CYCLE_PERIODS = [
  { value: "DAILY", label: "Diaria" },
  { value: "WEEKLY", label: "Semanal" },
  { value: "MONTHLY", label: "Mensual" },
  { value: "YEARLY", label: "Anual" },
  { value: "CUSTOM_DAYS", label: "Personalizada (días)" },
] as const;

export const goalFormSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido").max(120),
    description: z.string().max(500).optional(),
    categoryId: z.string().min(1, "La categoría es requerida"),
    type: z.enum(["CONCLUSIVE", "CYCLIC"]),
    cyclePeriod: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM_DAYS"])
      .optional(),
    customCycleDays: z.number().int().min(1).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    estimatedDurationMinutes: z.number().int().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "CYCLIC" && !data.cyclePeriod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las metas cíclicas requieren un período",
        path: ["cyclePeriod"],
      });
    }
    if (
      data.cyclePeriod === "CUSTOM_DAYS" &&
      (!data.customCycleDays || data.customCycleDays < 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Especifica el número de días",
        path: ["customCycleDays"],
      });
    }
  });

export type GoalFormValues = z.infer<typeof goalFormSchema>;
