import { ApplicationWithCategories } from "@/app/api/applications/applicationTypes";
import { Badge } from "@/primitives/badge";
import { Link } from "@/primitives/link";
import { CalendarIcon, FolderIcon } from "@heroicons/react/20/solid";

interface ApplicationCardProps {
  application: ApplicationWithCategories;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link href={`/applications/${application.id}`} className="group block">
      <div className="h-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <FolderIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {application.name}
              </h3>
            </div>
          </div>
          <Badge color="blue" className="shrink-0">
            {application.categories.length}
          </Badge>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {application.description || "No description provided"}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-3" />
            <span>
              Created {new Date(application.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FolderIcon className="size-3" />
            <span>
              {application.categories.length}{" "}
              {application.categories.length === 1 ? "category" : "categories"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
