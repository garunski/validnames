import { BatchCheckRequest } from "@/app/api/checks/domainCheckingTypes";
import { validateAndPrepareBackgroundJobData } from "./backgroundJobValidation";
import {
  processDomainCheck,
  processDomainCheckWithError,
} from "./domainCheckProcessor";

export async function startBackgroundDomainCheck(
  userId: string,
  request: BatchCheckRequest & { tldExtensions?: string[] },
) {
  // Process domain checks directly
  return await processDomainChecks(userId, request);
}

export async function processDomainChecks(
  userId: string,
  request: BatchCheckRequest & { tldExtensions?: string[] },
) {
  const { batchId } = request;
  const generatedBatchId = batchId || crypto.randomUUID();

  // Validate and prepare data
  const { domains, tlds } = await validateAndPrepareBackgroundJobData(
    userId,
    request,
  );

  let errorCount = 0;

  // Process domain checks directly
  for (const domain of domains) {
    for (const tld of tlds) {
      try {
        await processDomainCheck(
          domain.name,
          tld.extension,
          domain.categoryId,
          generatedBatchId,
        );
      } catch (error) {
        errorCount++;
        console.error(
          `Error checking domain ${domain.name}.${tld.extension}:`,
          error,
        );

        // Create error record
        await processDomainCheckWithError(
          domain.name,
          tld.extension,
          domain.categoryId,
          generatedBatchId,
        );
      }
    }
  }

  return { batchId: generatedBatchId, errorCount };
}
