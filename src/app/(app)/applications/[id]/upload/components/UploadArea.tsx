"use client";

import { useRef } from "react";

interface UploadAreaProps {
  dragActive: boolean;
  uploading: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadArea({
  dragActive,
  uploading,
  onDrag,
  onDrop,
  onFileUpload,
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all ${
        dragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : uploading
            ? "border-amber-300 bg-amber-50 dark:bg-amber-900/20"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        multiple
        onChange={onFileUpload}
        disabled={uploading}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />

      <div className="space-y-4">
        {uploading ? (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500"></div>
            <p className="text-lg font-medium text-amber-700 dark:text-amber-300">
              Processing your files...
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 p-4 dark:bg-blue-900/50">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                Drop your JSON files here
              </p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                or click to browse files
              </p>
            </div>
            <div className="flex justify-center gap-4 text-sm text-zinc-500">
              <span>✓ JSON files only</span>
              <span>✓ Multiple files supported</span>
              <span>✓ Drag & drop supported</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
