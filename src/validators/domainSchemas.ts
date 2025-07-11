import { z } from "zod";

// Domain schemas
export const domainCreateSchema = z.object({
  name: z.string().min(1, "Domain name is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const domainBatchCreateSchema = z.object({
  domains: z.array(z.string()).min(1, "At least one domain is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const domainUpdateSchema = z.object({
  name: z.string().min(1, "Domain name is required").optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
});

// Category schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  applicationId: z.string().min(1, "Application ID is required"),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  description: z.string().optional(),
});
