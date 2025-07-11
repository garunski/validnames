"use client";

import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { Badge } from "@/primitives/badge";
import { useQuery } from "@tanstack/react-query";

interface TLDDisplayProps {
  selectedTldExtensions: string[];
}

export function TLDDisplay({ selectedTldExtensions }: TLDDisplayProps) {
  const { data: tlds = [], isLoading: loading } = useQuery({
    queryKey: ["tlds"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/tlds");
      // The API returns { tlds: [...], selectedCount: ... }
      return Array.isArray(response.data?.tlds) ? response.data.tlds : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (loading) {
    return null;
  }

  // Filter TLDs by extension since selectedTldExtensions contains the actual extensions
  const selectedTlds = Array.isArray(tlds)
    ? tlds.filter((tld) => selectedTldExtensions.includes(tld.extension))
    : [];

  if (selectedTlds.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-amber-600 dark:text-amber-400">
          ⚠️ No TLDs selected
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {selectedTlds.map((tld) => (
          <Badge key={tld.id} color="blue" className="text-xs">
            {tld.extension}
          </Badge>
        ))}
      </div>
    </div>
  );
}
