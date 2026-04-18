import {z} from "zod";

export const loginSchema = z.object({
    username : z.string ().trim().min(3, "Username must be at least 3 characters").max(12, "Username must be at most 12 characters"),
    password : z.string().min(6, "Password must be at least 6 characters"), 
})



export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Required"),
    newPassword: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export type LoginFormType  = z.infer<typeof loginSchema>;