import { z } from "zod";

/* ================= CONSTANTS ================= */

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

const GENDERS = ["Male", "Female", "Other"] as const;

const today = new Date();
today.setHours(0, 0, 0, 0);

/* ================= SCHEMA ================= */

export const studentSchema = z
  .object({
    /* ================= PHOTO ================= */
    photo: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          val.startsWith("data:image/") ||
          val.startsWith("/uploads/"),
        "Photo must be a valid image"
      ),

    /* ================= BASIC INFO ================= */

    name: z
      .string()
      .trim()
      .min(2, "Student name is required")
      .max(100, "Student name is too long"),

    // These are required *in the form*, even if the API doesn’t send them
      gradeId: z.coerce
      .number()
      .int()
      .positive("Grade is required"),

    sectionId: z.coerce
      .number()
      .int()
      .positive("Section is required"),
    rollNo: z
      .string()
      .trim()
      .regex(/^\d+$/, "Roll number must be numeric")
      .min(1, "Roll number is required")
      .max(5, "Roll number is too long"),

    /* ================= PARENT INFO ================= */

    parent: z
      .string()
      .trim()
      .min(2, "Parent name is required")
      .max(100, "Parent name is too long"),

    parentContact: z
      .string()
      .trim()
      .regex(/^\d+$/, "Parent contact must be numeric")
      .min(7, "Parent contact is too short")
      .max(15, "Parent contact is too long")
      .refine((val) => !/^0{5,}/.test(val), "Invalid phone number"),

    /* ================= HEALTH ================= */

    bloodGroup: z
      .enum(BLOOD_GROUPS)
      .refine((val) => Boolean(val), {
        message: "Blood group is required",
      }),

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
            new Date(
              today.getFullYear(),
              birthDate.getMonth(),
              birthDate.getDate()
            )
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
      .refine(
        (val) => new Date(val) <= today,
        "Admission date cannot be in the future"
      ),

    /* ================= ADDRESS ================= */

    address: z
      .string()
      .trim()
      .min(3, "Address is required")
      .max(255, "Address is too long"),

    /* ================= GENDER ================= */

    gender: z
      .enum(GENDERS)
      .refine((val) => Boolean(val), {
        message: "Gender is required",
      }),
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

export type StudentFormType = z.infer<typeof studentSchema>;
