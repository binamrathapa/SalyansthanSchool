import { z } from "zod";

export const teacherSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email address"),
  mobileNo: z.string().min(10, "Mobile number is required"),
  address: z.string().optional(),
  panNumber: z.string().min(5, "PAN Number is required"),
  nidNumber: z.string().optional(),
  citizenshipNumber: z.string().optional(),
  qualification: z.string().min(2, "Qualification is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  photo: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type TeacherFormType = z.infer<typeof teacherSchema>;
