import { prisma } from "../../../database/client";

/**
 * Validate TLD extensions against database
 */
export async function validateTLDExtensions(
  extensions: string[],
): Promise<string[]> {
  const validTLDs = await prisma.tLD.findMany({
    where: {
      extension: {
        in: extensions,
      },
    },
    select: {
      extension: true,
    },
  });

  return validTLDs.map((tld) => tld.extension);
}
