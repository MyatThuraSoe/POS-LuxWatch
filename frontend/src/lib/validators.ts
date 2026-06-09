import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email address.");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s().-]{6,}$/, "Enter a valid phone number.");

export const requiredString = (label: string) => z.string().trim().min(1, `${label} is required.`);

export const passwordSchema = z.string().min(8, "Password must be at least 8 characters.");

export function formatValidationError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}
