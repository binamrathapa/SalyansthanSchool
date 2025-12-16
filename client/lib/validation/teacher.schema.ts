import { z } from "zod";

export const teacherSchema = z.object({
  photo: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  subject: z.string().min(2, "Subject is required"),
  qualification: z.string().min(2, "Qualification is required"),
  designation: z.string().min(2, "Designation is required"),
  experience: z.string().min(1, "Experience is required"),
  dob: z.string().min(1, "Date of birth is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  address: z.string().min(3, "Address is required"),
  contact: z.string().min(10, "Contact is required"),
  panNumber: z.string().min(5, "PAN Number is required"),
  nidNumber: z.string().min(5, "NID Number is required").optional(),
  citizenshipNumber: z.string().min(5, "Citizenship Number is required"),
  gender: z.enum(["Male", "Female", "Other"]),
});

export type TeacherFormType = z.infer<typeof teacherSchema>;
