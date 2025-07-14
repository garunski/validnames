export function ApplicationLoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <div className="mt-4 text-zinc-500 dark:text-zinc-400">
          Loading application...
        </div>
      </div>
    </div>
  );
}
