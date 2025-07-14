import { z } from "zod";

// TLD schemas
export const tldSelectionSchema = z.object({
  selectedTlds: z.array(z.string()).min(1, "At least one TLD must be selected"),
});

export const tldQuerySchema = z.object({
  category: z.string().optional(),
  enabledOnly: z.string().optional(),
  selectedTldExtensions: z.string().optional(),
});
