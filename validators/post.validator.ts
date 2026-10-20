import z from "zod";
import { LIMITS } from "../config/limits";


export const createPostSchema = z.object({
  caption: z
    .string()
    .trim()
    .max(LIMITS.captionLength, `Caption must be at most ${LIMITS.captionLength} characters`)
    .optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;