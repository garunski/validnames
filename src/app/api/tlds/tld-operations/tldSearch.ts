import { prisma } from "../../../database/client";
import { TLDData } from "./tldTypes";

/**
 * Search TLDs by name, extension, or description
 */
export async function searchTLDs(searchTerm: string): Promise<TLDData[]> {
  return await prisma.tLD.findMany({
    where: {
      OR: [
        {
          extension: {
            contains: searchTerm,
          },
        },
        {
          name: {
            contains: searchTerm,
          },
        },
        {
          description: {
            contains: searchTerm,
          },
        },
      ],
    },
    orderBy: [{ popularity: "desc" }, { extension: "asc" }],
  });
}
