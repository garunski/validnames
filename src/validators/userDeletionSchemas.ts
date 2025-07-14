import { z } from "zod";

/**
 * Schema for deleting user account
 */
export const initiateDeletionSchema = z.object({
  reason: z.string().optional(),
  confirmDeletion: z.boolean().refine((val) => val === true, {
    message: "You must confirm that you want to delete your account",
  }),
});

/**
 * Schema for data export options
 */
export const dataExportSchema = z.object({
  includeApplications: z.boolean().default(true),
  includeCategories: z.boolean().default(true),
  includeDomains: z.boolean().default(true),
  includeProfile: z.boolean().default(true),
});

/**
 * Type exports
 */
export type InitiateDeletionRequest = z.infer<typeof initiateDeletionSchema>;
export type DataExportRequest = z.infer<typeof dataExportSchema>;
