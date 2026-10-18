import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;