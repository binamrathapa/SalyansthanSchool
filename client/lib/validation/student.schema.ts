import { z } from "zod";

export const studentSchema = z.object({
  photo: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("data:image/"),
      "Photo must be a valid image"
    ),

  name: z.string().min(2, "Student name is required"),

  grade: z.string().min(1, "Grade is required"),

  rollNo: z.string().min(1, "Roll number is required"),

  parent: z.string().min(2, "Parent name is required"),

  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),

  admissionDate: z
    .string()
    .min(1, "Admission date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),

  address: z.string().min(3, "Address is required"),

  // contact: z
  // .string()
  // .regex(/^[0-9]+$/, "Contact must be numeric")
  // .min(7, "Contact number is too short"),

  parentContact: z
    .string()
    .regex(/^[0-9]+$/, "Parent contact must be numeric")
    .min(7, "Parent contact is too short"),

  gender: z
    .string()
    .min(1, "Gender is required")
    .refine(
      (val) => ["Male", "Female", "Other"].includes(val),
      "Invalid gender"
    ),
});

export type StudentFormType = z.infer<typeof studentSchema>;
