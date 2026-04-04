import {z} from "zod";

export const loginSchema = z.object({
    username : z.string ().trim().min(3, "Username must be at least 3 charecters").max(12, "Username must be at most 12 charecters"),
    password : z.string().min(6, "Password must be at least 6 charecters"), 
})

export type LoginFormType  = z.infer<typeof loginSchema>;