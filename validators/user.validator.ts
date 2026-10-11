import z from "zod";
import { userNameRule } from "./auth.validator";


export const updateProfileSchema = z
  .object({
    username: userNameRule.optional(),
    fullName: z.string().trim().max(50, "Name is too long").optional(),
    bio: z.string().trim().max(160, "Bio must be at most 160 characters").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;