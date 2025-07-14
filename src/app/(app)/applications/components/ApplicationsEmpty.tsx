import { Button } from "@/primitives/button";
import { FolderIcon, PlusIcon } from "@heroicons/react/20/solid";

export function ApplicationsEmpty() {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <FolderIcon className="h-12 w-12 text-zinc-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
          No applications yet
        </h3>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Get started by creating your first application to check domain
          availability across different TLDs.
        </p>
        <Button href="/applications/new" className="px-6 py-3" color="blue">
          <PlusIcon className="size-4" />
          Create Your First Application
        </Button>
      </div>
    </div>
  );
}
