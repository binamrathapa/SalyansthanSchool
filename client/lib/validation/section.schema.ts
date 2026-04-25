import { z } from "zod";

export const sectionSchema = z.object({
  sectionName: z.string().trim().min(1, "Section name is required").max(50),
  isActive: z.boolean().optional().default(true),
});

export type SectionFormType = z.infer<typeof sectionSchema>;
