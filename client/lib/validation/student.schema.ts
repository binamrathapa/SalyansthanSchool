import { z } from "zod";

export const studentSchema = z.object({
  photo: z.string().optional().or(z.null()).default(""),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  grade: z.string().min(1, "Grade is required"),
  rollNo: z.string().min(1, "Roll Number is required"),
  parent: z
    .string()
    .min(2, "Parent/Guardian name must be at least 2 characters long"),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for Date of Birth",
  }),
  admissionDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for Admission Date",
  }),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  contact: z
    .string()
    .min(7, "Contact Number must be at least 7 characters long"),
  parentContact: z
    .string()
    .min(7, "Parent Contact Number must be at least 7 characters long"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender is required",
  }),
});

export type StudentFormType = z.infer<typeof studentSchema>;
