import { z } from "zod";

// Base schemas
export const idSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Application schemas
export const applicationCreateSchema = z.object({
  name: z.string().min(1, "Application name is required"),
  description: z.string().optional(),
});

export const applicationTldUpdateSchema = z.object({
  selectedTldExtensions: z
    .array(z.string())
    .min(1, "At least one TLD must be selected"),
});
