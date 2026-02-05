import { z } from "zod";


export const gradeSchema = z.object({
  name: z.string().trim().min(2, "Grade name is required").max(50),
  isActive: z.boolean().optional().default(true),
  sections: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().trim().min(1, "Section name is required").max(50),
      })
    )
    .min(1, "At least one section is required"),
});


export type GradeFormType = z.infer<typeof gradeSchema>;
