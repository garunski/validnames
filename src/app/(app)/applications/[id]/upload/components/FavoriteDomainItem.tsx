import { Button } from "@/primitives/button";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface FavoriteDomain {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
}

interface FavoriteDomainItemProps {
  domain: FavoriteDomain;
  isSelected: boolean;
  onToggle: () => void;
}

export function FavoriteDomainItem({
  domain,
  isSelected,
  onToggle,
}: FavoriteDomainItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${
        isSelected
          ? "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20"
          : "border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
      }`}
      onClick={onToggle}
    >
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {domain.name}
      </span>
      <div className="flex items-center gap-1">
        {isSelected ? (
          <div className="group flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded transition-colors">
              {/* Checkmark: visible unless hovered */}
              <span className="flex items-center group-hover:hidden">
                <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </span>
              {/* Red X: only visible on hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="hidden h-8 w-8 cursor-pointer items-center justify-center rounded bg-red-50 text-red-600 group-hover:flex hover:bg-red-100 hover:text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                title="Remove from input"
                tabIndex={0}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <Button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onToggle();
            }}
            plain
            className="!hover:text-blue-700 !hover:bg-blue-50 flex h-8 w-8 items-center justify-center text-xs !text-zinc-600 dark:text-zinc-400 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
            title="Add to input"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
