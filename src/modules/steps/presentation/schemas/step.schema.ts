import { z } from "zod";

const statusOptionSchema = z.object({
  label: z.string().min(1, "El nombre del estado es obligatorio"),
  percentage: z.number().min(0).max(100),
  order: z.number().int().min(0),
});

export const createStepSchema = z
  .object({
    type: z.enum(["PROGRESS_BAR", "CHECK", "STATUS", "COUNTER"]),
    title: z.string().min(1, "El título es obligatorio").max(200),
    description: z.string().max(1000).optional(),
    weight: z.number().min(0.1).max(100),
    // PROGRESS_BAR fields
    target: z.number().min(1).optional(),
    unit: z.string().max(20).optional(),
    // COUNTER fields
    max: z.number().min(1).optional(),
    min: z.number().min(0).optional(),
    // STATUS fields
    statuses: z.array(statusOptionSchema).min(2).optional(),
    // dates
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    estimatedDurationMinutes: z.number().int().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "PROGRESS_BAR" && !data.target) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["target"],
        message: "El objetivo es obligatorio para barra de progreso",
      });
    }
    if (data.type === "COUNTER" && !data.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max"],
        message: "El máximo es obligatorio para contador",
      });
    }
    if (data.type === "STATUS" && (!data.statuses || data.statuses.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["statuses"],
        message: "Se necesitan al menos 2 estados",
      });
    }
  });

export type CreateStepFormValues = z.infer<typeof createStepSchema>;
