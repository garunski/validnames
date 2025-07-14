import {
  HiddenCategory,
  TLDCategory,
  TLDWithSelection,
} from "@/app/api/tlds/tld-operations/tldTypes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTLDActions } from "./useTLDActions";
import { useTLDFiltering } from "./useTLDFiltering";

interface UseTLDSelectorProps {
  tlds: TLDWithSelection[];
}

export function useTLDSelector({ tlds }: UseTLDSelectorProps) {
  const [selectedTlds, setSelectedTlds] = useState<string[]>(
    tlds.filter((tld) => tld.selected).map((tld) => tld.extension),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TLDCategory | "All">(
    "All",
  );
  const [showHiddenCategories, setShowHiddenCategories] = useState<
    Set<HiddenCategory>
  >(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { filteredTlds, groupedTlds, categoryCounts } = useTLDFiltering({
    tlds,
    searchTerm,
    selectedCategory,
    showHiddenCategories,
    selectedTlds,
  });

  const {
    handleTldToggle,
    handleCategorySelectAll,
    handleCategorySelectNone,
    handleSelectAll,
    handleSelectNone,
  } = useTLDActions({
    filteredTlds,
    selectedTlds,
    setSelectedTlds,
    setIsLoading,
    setMessage,
    router,
  });

  const toggleHiddenCategory = (category: HiddenCategory) => {
    const newShowHidden = new Set(showHiddenCategories);
    if (newShowHidden.has(category)) {
      newShowHidden.delete(category);
    } else {
      newShowHidden.add(category);
    }
    setShowHiddenCategories(newShowHidden);
  };

  return {
    selectedTlds,
    searchTerm,
    selectedCategory,
    showHiddenCategories,
    isLoading,
    message,
    filteredTlds,
    groupedTlds,
    categoryCounts,
    setSearchTerm,
    setSelectedCategory,
    handleTldToggle,
    handleCategorySelectAll,
    handleCategorySelectNone,
    handleSelectAll,
    handleSelectNone,
    toggleHiddenCategory,
  };
}
