import z from "zod";

export const registerSchema = z.object({
    userName:z
    .string()
    .trim()
    .min(3,{message:"Username must be at least 3 characters long"})
    .max(20,{message:"Username must be at most 20 characters long"})
    .regex(/^[a-z0-9]+$/,{message:"only letters,numbers and underscore are allowed"}),

    email:z
    .string()
    .trim()
    .toLowerCase()
    .email({message:"Invalid email address"}),

    password:z
    .string()
    .trim()
    .min(8,{message:"Password must be at least 8 characters long"})
    .max(72,{message:"Password must be at most 72 characters long"})
})

export type registerInput = z.infer<typeof registerSchema>