import { z } from "zod";

/* ================= CONSTANTS ================= */

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const GENDERS = ["Male", "Female", "Other"] as const;

const today = new Date();
today.setHours(0, 0, 0, 0);

/* ================= SCHEMA ================= */

export const studentSchema = z
  .object({
    photo: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val))
      .refine(
        (val) =>
          !val ||
          val.startsWith("data:image/") ||
          val.startsWith("/uploads/") ||
          val.startsWith("http"),
        "Photo must be a valid image"
      ),


    /* ================= NAMES ================= */
    firstName: z.string().trim().min(2, "First name is required").max(50),
    middleName: z.string().trim().max(50).optional(),
    lastName: z.string().trim().min(2, "Last name is required").max(50),

    /* ================= ROLL ================= */
    rollNo: z
      .number()
      .optional(),

    /* ================= BASIC INFO ================= */
    gradeId: z.coerce.number().int().positive("Grade is required"),
    gradeName: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    sectionId: z.coerce.number().int().positive("Section is required"),
    sectionName: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),



    /* ================= PARENT INFO ================= */
    parent: z.string().trim().min(2, "Parent name is required").max(100),
    parentContact: z
      .string()
      .trim()
      .regex(/^9[7-8]\d{8}$/, "Parent contact must be a valid Nepali mobile number"),

    /* ================= HEALTH ================= */
    bloodGroup: z.enum(BLOOD_GROUPS),
    gender: z.enum(GENDERS),

    /* ================= DATES ================= */
    dob: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
      .refine((val) => new Date(val) <= today, "Date of birth cannot be in the future")
      .refine(
        (val) => {
          const birthDate = new Date(val);
          const age =
            today.getFullYear() -
            birthDate.getFullYear() -
            (today <
              new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
              ? 1
              : 0);
          return age >= 1;
        },
        "Student must be at least 1 year old"
      ),
    admissionDate: z
      .string()
      .min(1, "Admission date is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
      .refine((val) => {
        const inputDate = new Date(val + "T00:00:00");
        const todayDate = new Date(new Date().toISOString().split("T")[0] + "T00:00:00");
        return inputDate <= todayDate;
      }, "Admission date cannot be in the future"),


    /* ================= ADDRESS ================= */
    address: z.string().trim().min(3, "Address is required").max(255),

    /* ================= STATUS ================= */
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (!data.dob || !data.admissionDate) return true;
      return new Date(data.admissionDate) >= new Date(data.dob);
    },
    {
      message: "Admission date cannot be before date of birth",
      path: ["admissionDate"],
    }
  );

/* ================= TYPE ================= */

export type StudentFormType = z.infer<typeof studentSchema> & {
  rollNo?: number;
};
