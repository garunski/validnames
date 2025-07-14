import { TLDWithSelection } from "@/app/api/tlds/tld-operations/tldTypes";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

interface UseTLDActionsProps {
  filteredTlds: TLDWithSelection[];
  selectedTlds: string[];
  setSelectedTlds: Dispatch<SetStateAction<string[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
  router: AppRouterInstance;
}

export function useTLDActions({
  filteredTlds,
  selectedTlds,
  setSelectedTlds,
  setIsLoading,
  setMessage,
  router,
}: UseTLDActionsProps) {
  const queryClient = useQueryClient();

  // React Query mutation for saving TLD selections
  const mutation = useMutation({
    mutationFn: async (newSelectedTlds: string[]) => {
      const response = await fetchWithAuth("/api/tlds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedTlds: newSelectedTlds }),
      });
      return response.data;
    },
    onSuccess: (result) => {
      setMessage(`Saved ${result.selectedCount} TLD selections`);
      queryClient.invalidateQueries({ queryKey: ["tlds"] });
      router.refresh();
      setTimeout(() => setMessage(""), 3000);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save TLD selections";
      setMessage(`Error: ${errorMessage}`);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const saveSelections = async (newSelectedTlds: string[]) => {
    setIsLoading(true);
    setMessage("");
    await mutation.mutateAsync(newSelectedTlds);
  };

  const handleTldToggle = async (extension: string) => {
    const newSelectedTlds = selectedTlds.includes(extension)
      ? selectedTlds.filter((ext) => ext !== extension)
      : [...selectedTlds, extension];

    setSelectedTlds(newSelectedTlds);
    await saveSelections(newSelectedTlds);
  };

  const handleCategorySelectAll = async (category: string) => {
    const categoryTlds = filteredTlds.filter(
      (tld) => tld.category === category,
    );
    const categoryExtensions = categoryTlds.map((tld) => tld.extension);

    const newSelectedTlds = [
      ...selectedTlds.filter((ext) => !categoryExtensions.includes(ext)),
      ...categoryExtensions,
    ];

    setSelectedTlds(newSelectedTlds);
    await saveSelections(newSelectedTlds);
  };

  const handleCategorySelectNone = async (category: string) => {
    const categoryTlds = filteredTlds.filter(
      (tld) => tld.category === category,
    );
    const categoryExtensions = categoryTlds.map((tld) => tld.extension);

    const newSelectedTlds = selectedTlds.filter(
      (ext) => !categoryExtensions.includes(ext),
    );

    setSelectedTlds(newSelectedTlds);
    await saveSelections(newSelectedTlds);
  };

  const handleSelectAll = async () => {
    const newSelectedTlds = filteredTlds.map((tld) => tld.extension);
    setSelectedTlds(newSelectedTlds);
    await saveSelections(newSelectedTlds);
  };

  const handleSelectNone = async () => {
    setSelectedTlds([]);
    await saveSelections([]);
  };

  return {
    handleTldToggle,
    handleCategorySelectAll,
    handleCategorySelectNone,
    handleSelectAll,
    handleSelectNone,
  };
}
