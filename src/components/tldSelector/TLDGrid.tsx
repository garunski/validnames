"use client";

interface TLD {
  id: string;
  extension: string;
}

interface TLDGridProps {
  tlds: TLD[];
  selectedTldExtensions: string[];
  onToggleTld: (tldExtension: string) => void;
  searchTerm: string;
}

export function TLDGrid({
  tlds,
  selectedTldExtensions,
  onToggleTld,
  searchTerm,
}: TLDGridProps) {
  const filteredTlds = tlds.filter((tld) =>
    tld.extension.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (filteredTlds.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500">
        {searchTerm
          ? "No TLDs match your search"
          : "No TLDs available. Go to TLD Management to select TLDs first."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {filteredTlds.map((tld) => (
        <button
          key={tld.id}
          onClick={() => onToggleTld(tld.extension)}
          className={`flex cursor-pointer items-center justify-center rounded-md border p-2 text-sm font-medium transition-colors ${
            selectedTldExtensions.includes(tld.extension)
              ? "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          } `}
        >
          {tld.extension}
          {selectedTldExtensions.includes(tld.extension) && (
            <span className="ml-1">✓</span>
          )}
        </button>
      ))}
    </div>
  );
}
