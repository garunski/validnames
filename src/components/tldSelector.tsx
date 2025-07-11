"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { Button } from "@/primitives/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/primitives/dialog";
import { Input } from "@/primitives/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TLDActions } from "./tldSelector/TLDActions";
import { TLDGrid } from "./tldSelector/TLDGrid";

interface TLDSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTldExtensions: string[];
  onSelectionChange: (tldExtensions: string[]) => Promise<boolean> | void;
}

export function TLDSelector({
  isOpen,
  onClose,
  selectedTldExtensions,
  onSelectionChange,
}: TLDSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelection, setLocalSelection] = useState<string[]>(
    selectedTldExtensions,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const saveSelectionMutation = useMutation({
    mutationFn: async (tldExtensions: string[]) => {
      const result = await onSelectionChange(tldExtensions);
      return result;
    },
    onSuccess: (result) => {
      if (result !== false) {
        onClose();
      }
    },
    onError: (error: unknown) => {
      console.error("Failed to save TLD selection:", error);
    },
  });

  const { data: tlds = [] } = useQuery<{ id: string; extension: string }[]>({
    queryKey: ["tlds", "enabledOnly"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/tlds?enabledOnly=true");
      return Array.isArray(response.data?.tlds) ? response.data.tlds : [];
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (tlds.length > 0) {
      const availableTldExtensions = tlds.map((tld) => tld.extension);
      const filteredSelection = selectedTldExtensions.filter((extension) =>
        availableTldExtensions.includes(extension),
      );
      setLocalSelection(filteredSelection);
    }
  }, [tlds, selectedTldExtensions]);

  const handleToggleTld = (tldExtension: string) => {
    setLocalSelection((prev) =>
      prev.includes(tldExtension)
        ? prev.filter((extension) => extension !== tldExtension)
        : [...prev, tldExtension],
    );
  };

  const handleSelectAll = () => {
    const filteredTlds = tlds.filter((tld) =>
      tld.extension.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setLocalSelection(filteredTlds.map((tld) => tld.extension));
  };

  const handleClearAll = () => {
    setLocalSelection([]);
  };

  const handleSave = () => {
    if (localSelection.length === 0) {
      setValidationError("Please select at least one TLD.");
      return;
    }
    setValidationError(null);
    saveSelectionMutation.mutate(localSelection);
  };

  const handleCancel = () => {
    setLocalSelection(selectedTldExtensions);
    onClose();
  };

  return (
    <FeatureErrorBoundary featureName="TLD Selector">
      <Dialog open={isOpen} onClose={handleCancel} size="2xl">
        <DialogTitle>Enable/Disable TLDs for Domain Checking</DialogTitle>

        <DialogBody>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search TLDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            <TLDActions
              tlds={tlds}
              selectedTldExtensions={localSelection}
              searchTerm={searchTerm}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />

            {validationError && (
              <div className="px-2 py-1 text-sm font-medium text-red-600">
                {validationError}
              </div>
            )}

            <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <TLDGrid
                tlds={tlds}
                selectedTldExtensions={localSelection}
                onToggleTld={handleToggleTld}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </DialogBody>

        <DialogActions>
          <Button
            onClick={handleCancel}
            plain
            disabled={saveSelectionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveSelectionMutation.isPending}
          >
            {saveSelectionMutation.isPending
              ? "Saving..."
              : `Save Selection (${localSelection.length})`}
          </Button>
        </DialogActions>
      </Dialog>
    </FeatureErrorBoundary>
  );
}
