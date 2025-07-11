"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import type { FileUploadStatus } from "../uploadTypes";

interface FileUploadStatusListProps {
  fileUploads: FileUploadStatus[];
  onClearCompleted: () => void;
}

export function FileUploadStatusList({ fileUploads, onClearCompleted }: FileUploadStatusListProps) {
  if (fileUploads.length === 0) {
    return null;
  }

  const hasCompletedUploads = fileUploads.some(
    (upload) => upload.status === "success" || upload.status === "error",
  );

  return (
    <FeatureErrorBoundary>
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Upload Status ({fileUploads.length} files)
          </h3>
          {hasCompletedUploads && (
            <button
              onClick={onClearCompleted}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Clear completed
            </button>
          )}
        </div>

        <div className="space-y-2">
          {fileUploads.map((upload) => (
            <div
              key={upload.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                upload.status === "success"
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  : upload.status === "error"
                    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                    : upload.status === "uploading"
                      ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                      : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {upload.status === "success" && (
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {upload.status === "error" && (
                    <svg
                      className="h-5 w-5 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  {upload.status === "uploading" && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-200 border-t-amber-500"></div>
                  )}
                  {upload.status === "pending" && (
                    <div className="h-5 w-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {upload.file.name}
                  </p>
                  {upload.status === "success" && upload.result && (
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {upload.result.stats.categoriesProcessed} categories,{" "}
                      {upload.result.stats.domainsProcessed} domains processed
                    </p>
                  )}
                  {upload.status === "error" && upload.error && (
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {upload.error}
                    </p>
                  )}
                  {upload.status === "uploading" && (
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Processing...
                    </p>
                  )}
                  {upload.status === "pending" && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Waiting to upload...
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
