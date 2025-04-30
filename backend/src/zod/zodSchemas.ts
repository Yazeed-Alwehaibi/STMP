// zodSchemas.ts
import { z } from "zod";

export const registerUserSchema = z.object({
  userID: z
    .string()
    .regex(/^[0-9]+$/, "User ID must be numeric")
    .max(8, "Max 8 digits allowed"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["Supervisor", "Student", "Training Representative"]),
  department: z.string().optional(),
  extrainfo: z.string().optional(),
});
