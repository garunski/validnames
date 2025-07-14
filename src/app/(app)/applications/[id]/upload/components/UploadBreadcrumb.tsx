import { Link } from "@/primitives/link";

interface UploadBreadcrumbProps {
  applicationName: string;
  applicationId: string;
}

export function UploadBreadcrumb({
  applicationName,
  applicationId,
}: UploadBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/applications"
        className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Applications
      </Link>
      <span className="text-zinc-300 dark:text-zinc-600">/</span>
      <Link
        href={`/applications/${applicationId}`}
        className="text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        {applicationName}
      </Link>
      <span className="text-zinc-300 dark:text-zinc-600">/</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-100">
        Upload
      </span>
    </div>
  );
}
