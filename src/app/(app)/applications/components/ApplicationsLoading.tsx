export function ApplicationsLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <div className="mt-4 text-zinc-500">Loading applications...</div>
      </div>
    </div>
  );
}
