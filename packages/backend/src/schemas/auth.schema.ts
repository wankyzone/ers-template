import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const registerSchema = z.object({
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long"),
  name: z.string().trim().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});
                