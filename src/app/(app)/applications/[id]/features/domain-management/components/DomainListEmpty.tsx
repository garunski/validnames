import { Button } from "@/primitives/button";
import { GlobeAltIcon, PlusIcon } from "@heroicons/react/24/outline";

interface DomainListEmptyProps {
  onAddDomain: () => void;
  filtered?: boolean;
  hasOtherDomains?: boolean;
}

export function DomainListEmpty({
  onAddDomain,
  filtered = false,
  hasOtherDomains = false,
}: DomainListEmptyProps) {
  const showFiltered = filtered && hasOtherDomains;
  return (
    <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 py-16 text-center dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex justify-center">
          <GlobeAltIcon className="h-16 w-16 text-blue-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {showFiltered ? "No filtered domains found" : "No domains yet"}
        </h3>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          {showFiltered
            ? "No domains match your current filters. Try adjusting your filters to see more domains."
            : "Get started by adding your first domain to check its availability across different TLDs."}
        </p>
        <Button onClick={onAddDomain} className="px-6 py-2">
          <span className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            {showFiltered ? "Add Domain" : "Add Your First Domain"}
          </span>
        </Button>
      </div>
    </div>
  );
}
