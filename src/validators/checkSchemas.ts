import { z } from "zod";

// Check schemas
export const checkCreateSchema = z.object({
  domainIds: z.array(z.string()).min(1, "At least one domain is required"),
  tldIds: z.array(z.string()).min(1, "At least one TLD is required"),
});

export const checkQuerySchema = z.object({
  applicationId: z.string().optional(),
  categoryId: z.string().optional(),
  domainId: z.string().optional(),
  status: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});
