"use client";

interface TLDSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TLDSearchBar({
  searchTerm,
  onSearchChange,
}: TLDSearchBarProps) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        className="w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        placeholder="Search TLDs by extension, name, or description..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
