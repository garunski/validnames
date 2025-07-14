import { Button } from "@/primitives/button";
import { PlusIcon } from "@heroicons/react/20/solid";

export function ApplicationsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Applications
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your domain checking applications and track availability across
          different TLDs.
        </p>
      </div>
      <Button href="/applications/new" className="shrink-0" color="blue">
        <PlusIcon className="size-4" />
        Add Application
      </Button>
    </div>
  );
}
