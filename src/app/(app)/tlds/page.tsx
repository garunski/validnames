import { getCurrentUser } from "@/app/api/auth/authOperations";
import { getTLDsWithSelection } from "@/app/api/tlds/tld-operations/tldQueries";
import { prisma } from "@/app/database/client";
import { Link } from "@/primitives/link";
import { redirect } from "next/navigation";
import { TLDManagementHeader } from "./components/TLDManagementHeader";
import TLDSelector from "./components/TLDSelector";

async function getUserSelectedTlds(userId: string) {
  try {
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    const selectedTldIds = userSettings?.selectedTldIds
      ? JSON.parse(userSettings.selectedTldIds)
      : [];

    // Convert TLD IDs to extensions
    if (selectedTldIds.length > 0) {
      const selectedTlds = await prisma.tLD.findMany({
        where: { id: { in: selectedTldIds } },
        select: { extension: true },
      });
      return selectedTlds.map((tld) => tld.extension);
    }

    return [];
  } catch (error) {
    console.error("Error fetching user TLD selections:", error);
    return [];
  }
}

export default async function TLDSelectionPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const selectedTldExtensions = await getUserSelectedTlds(user.id);
  const tldData = await getTLDsWithSelection(selectedTldExtensions);

  // Placeholder for loading and error states
  // const loading = false;
  // const error = null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/applications"
          className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Applications
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          TLD Management
        </span>
      </div>

      {/* Header */}
      <TLDManagementHeader selectedTlds={selectedTldExtensions} />

      {/* Main Content Card */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-6">
          <TLDSelector
            tlds={tldData}
            initialSelectedCount={selectedTldExtensions.length}
          />
        </div>
      </div>
    </div>
  );
}
