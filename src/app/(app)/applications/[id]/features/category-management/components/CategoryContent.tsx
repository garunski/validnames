"use client";

import { AddDomainForm } from "@/app/(app)/applications/[id]/features/domain-management/components/AddDomainForm";
import { DomainList } from "@/app/(app)/applications/[id]/features/domain-management/components/DomainList";
import { FavoriteMessage } from "@/app/(app)/applications/[id]/features/domain-management/components/FavoriteMessage";
import type { DomainWithRelations } from "@/app/api/applications/applicationTypes";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import type { Application, Category, Domain } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CategoryDeleteDialog } from "./CategoryDeleteDialog";
import { CategoryHeader } from "./CategoryHeader";

interface CategoryContentProps {
  selectedCategory: Category & { domains: Domain[]; application: Application };
  domains: DomainWithRelations[];
  selectedTlds: string[];
  showAddDomainForm: boolean;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "name" | "availability" | "recent";
  setSortBy: (sort: "name" | "availability" | "recent") => void;
  onToggleAddDomainForm: () => void;
  onDomainAdded: () => void;
  onCheckDomains: () => void;
  onRefreshDomain?: (domainId: string) => void;
  statusFilter: "available" | "unavailable" | "unknown" | null;
  setStatusFilter: (
    filter: "available" | "unavailable" | "unknown" | null,
  ) => void;
  onCategoryDeleted?: () => void;
}

type ToastItem = {
  id: string;
  message: string;
  type: "success" | "error";
  isVisible: boolean;
};

export function CategoryContent({
  selectedCategory,
  domains,
  selectedTlds,
  showAddDomainForm,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  onToggleAddDomainForm,
  onDomainAdded,
  onCheckDomains,
  onRefreshDomain,
  statusFilter,
  setStatusFilter,
  onCategoryDeleted,
}: CategoryContentProps) {
  const domainCount = domains.length;
  const hasSelectedTlds = selectedTlds.length > 0;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const queryClient = useQueryClient();

  const showFavoriteMessage = (message: string, type: "success" | "error") => {
    const id = uuidv4();
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type, isVisible: true }];
      // Keep only the last 3 toasts (newest)
      return newToasts.slice(-3);
    });
  };

  // Called by each toast when it should hide (after timer)
  const handleToastHide = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isVisible: false } : t)),
    );
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  };

  const handleCheckDomainsClick = () => {
    onCheckDomains();
  };

  const handleDeleteCategory = async () => {
    setIsDeleting(true);
    try {
      await fetchWithAuth(`/api/categories?categoryId=${selectedCategory.id}`, {
        method: "DELETE",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      queryClient.invalidateQueries({ queryKey: ["application"] });

      setShowDeleteDialog(false);
      onCategoryDeleted?.();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <FeatureErrorBoundary>
      <div className="mt-0">
        <CategoryHeader
          selectedCategory={selectedCategory}
          hasSelectedTlds={hasSelectedTlds}
          domainCount={domainCount}
          showAddDomainForm={showAddDomainForm}
          onToggleAddDomainForm={onToggleAddDomainForm}
          onCheckDomains={handleCheckDomainsClick}
          onDeleteCategory={() => setShowDeleteDialog(true)}
        />

        {/* Add Domain Form */}
        {showAddDomainForm && (
          <div className="border-b border-zinc-200 p-6 dark:border-zinc-700">
            <AddDomainForm
              categoryId={selectedCategory.id}
              onSuccess={onDomainAdded}
              onCancel={onToggleAddDomainForm}
            />
          </div>
        )}

        {/* Domain Results */}
        <div className="p-6">
          <DomainList
            domains={domains}
            selectedTlds={selectedTlds}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onAddDomain={onToggleAddDomainForm}
            onRefreshDomain={onRefreshDomain}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onFavoriteMessage={showFavoriteMessage}
          />
        </div>

        <CategoryDeleteDialog
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          selectedCategory={selectedCategory}
          domainCount={domainCount}
          isDeleting={isDeleting}
          onDeleteConfirm={handleDeleteCategory}
        />

        {/* Growl Notification Stack */}
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
          {toasts.map((toast) => (
            <FavoriteMessage
              key={toast.id}
              message={toast.message}
              type={toast.type}
              isVisible={toast.isVisible}
              onHide={() => handleToastHide(toast.id)}
            />
          ))}
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
