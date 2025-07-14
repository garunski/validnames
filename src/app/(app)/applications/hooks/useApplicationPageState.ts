"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useApplicationPageState(
  setSelectedCategory: (categoryId: string | null) => void,
) {
  const queryClient = useQueryClient();

  // UI state - appropriate to keep as local state
  const [showTldSelector, setShowTldSelector] = useState(false);
  const [showNewCategoryFormState, setShowNewCategoryFormState] =
    useState(false);
  const [showAddDomainFormState, setShowAddDomainFormState] = useState(false);
  const [showOverview, setShowOverview] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"name" | "availability" | "recent">(
    "availability",
  );
  const [statusFilter, setStatusFilter] = useState<
    "available" | "unavailable" | "unknown" | null
  >(null);

  const handleAddCategory = () => {
    setShowNewCategoryFormState(true);
    setShowOverview(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowOverview(false);
  };

  const handleShowOverview = () => {
    setShowOverview(true);
    setSelectedCategory(null);
  };

  const handleToggleNewCategoryForm = () => {
    const newValue = !showNewCategoryFormState;
    setShowNewCategoryFormState(newValue);
    if (!newValue) {
      setShowOverview(false);
    }
  };

  const handleCategoryAdded = (category?: unknown) => {
    setShowNewCategoryFormState(false);
    // Use React Query invalidation instead of manual fetch
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["application"] });

    // Select the newly created category if data is available
    if (
      category &&
      typeof category === "object" &&
      category !== null &&
      "id" in category &&
      typeof category.id === "string"
    ) {
      setSelectedCategory(category.id);
      setShowOverview(false);
    }
  };

  const handleToggleAddDomainForm = () => {
    setShowAddDomainFormState(!showAddDomainFormState);
  };

  const handleDomainAdded = () => {
    setShowAddDomainFormState(false);
    // Use React Query invalidation instead of manual fetch
    queryClient.invalidateQueries({ queryKey: ["domains"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const handleShowTldSelector = () => {
    setShowTldSelector(true);
  };

  const handleCloseTldSelector = () => {
    setShowTldSelector(false);
  };

  const handleCategoryDeleted = () => {
    // Switch to overview mode when a category is deleted
    setShowOverview(true);
    setSelectedCategory(null);
    // Close any open forms
    setShowNewCategoryFormState(false);
    setShowAddDomainFormState(false);
  };

  return {
    // State
    showTldSelector,
    showNewCategoryForm: showNewCategoryFormState,
    showAddDomainForm: showAddDomainFormState,
    showOverview,
    viewMode,
    sortBy,
    statusFilter,

    // Setters
    setViewMode,
    setSortBy,
    setStatusFilter,

    // Handlers
    handleAddCategory,
    handleCategorySelect,
    handleShowOverview,
    handleToggleNewCategoryForm,
    handleCategoryAdded,
    handleToggleAddDomainForm,
    handleDomainAdded,
    handleShowTldSelector,
    handleCloseTldSelector,
    handleCategoryDeleted,
  };
}
