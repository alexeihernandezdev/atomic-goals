import { z } from "zod";

// React Hook Form with valueAsNumber submits NaN for empty number inputs.
// This converts NaN → undefined so optional fields validate correctly when
// the user switches between step types (e.g. PROGRESS_BAR → CHECK).
const nanToUndefined = (v: unknown) =>
  typeof v === "number" && isNaN(v) ? undefined : v;

const optionalNum = (inner: z.ZodNumber) =>
  z.preprocess(nanToUndefined, inner.optional());

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
    target: optionalNum(z.number().min(1)),
    unit: z.string().max(20).optional(),
    // COUNTER fields
    max: optionalNum(z.number().min(1)),
    min: optionalNum(z.number().min(0)),
    // STATUS fields
    statuses: z.array(statusOptionSchema).min(2).optional(),
    // dates (conclusive goals only)
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    // day-within-cycle (cyclic goals): "1"-"7" weekly, "1"-"31" monthly,
    // "YYYY-MM-DD" yearly, "1"-N custom
    cycleDay: z.string().optional(),
    estimatedDurationMinutes: optionalNum(z.number().int().min(1)),
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
