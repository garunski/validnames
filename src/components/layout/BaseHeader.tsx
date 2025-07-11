import type { ReactNode } from "react";

interface BaseHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  metadata?: {
    icon: ReactNode;
    text: string;
  };
  actions?: ReactNode;
  secondaryContent?: ReactNode;
  secondaryActions?: ReactNode;
}

export function BaseHeader({
  icon,
  title,
  description,
  metadata,
  actions,
  secondaryContent,
  secondaryActions,
}: BaseHeaderProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {title}
              </h1>
            </div>
            {description && (
              <p className="mt-1 line-clamp-1 text-sm text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            )}
            {metadata && (
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                {metadata.icon}
                <span>{metadata.text}</span>
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </div>
      {/* Secondary Content */}
      {secondaryContent && (
        <div className="flex flex-col gap-2 border-t border-zinc-200 bg-zinc-50 px-6 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">{secondaryContent}</div>
          {secondaryActions && (
            <div className="flex shrink-0 items-center gap-3">
              {secondaryActions}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
