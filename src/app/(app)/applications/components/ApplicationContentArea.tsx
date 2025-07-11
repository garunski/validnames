"use client";

import {
  ApplicationWithCategoriesAndTlds,
  CategoryWithRelations,
  DomainWithRelations,
} from "@/app/api/applications/applicationTypes";
import { ApplicationOverview } from "@/category/components/ApplicationOverview";
import { CategoryContent } from "@/category/components/CategoryContent";
import { CategoryNavigation } from "@/category/components/CategoryNavigation";

interface ApplicationContentAreaProps {
  application: ApplicationWithCategoriesAndTlds;
  categories: CategoryWithRelations[];
  selectedCategory: string | null;
  domains: DomainWithRelations[];
  selectedTlds: string[];
  showNewCategoryForm: boolean;
  showOverview: boolean;
  showAddDomainForm: boolean;
  viewMode: "grid" | "list";
  sortBy: "name" | "availability" | "recent";
  statusFilter: "available" | "unavailable" | "unknown" | null;
  overviewStats: {
    totalDomains: number;
    totalChecks: number;
    availableCount: number;
    unavailableCount: number;
    unknownCount: number;
    lastCheckTime: Date | null;
  };
  applicationId: string;
  onCategorySelect: (categoryId: string) => void;
  onShowOverview: () => void;
  onToggleNewCategoryForm: () => void;
  onCategoryAdded: (category?: unknown) => void;
  onAddCategory: () => void;
  onToggleAddDomainForm: () => void;
  onDomainAdded: () => void;
  onCheckDomains: () => void;
  onRefreshDomain: (domainId: string) => void;
  onCategoryDeleted?: () => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "name" | "availability" | "recent") => void;
  setStatusFilter: (
    filter: "available" | "unavailable" | "unknown" | null,
  ) => void;
}

export function ApplicationContentArea({
  application,
  categories,
  selectedCategory,
  domains,
  selectedTlds,
  showNewCategoryForm,
  showOverview,
  showAddDomainForm,
  viewMode,
  sortBy,
  statusFilter,
  overviewStats,
  applicationId,
  onCategorySelect,
  onShowOverview,
  onToggleNewCategoryForm,
  onCategoryAdded,
  onAddCategory,
  onToggleAddDomainForm,
  onDomainAdded,
  onCheckDomains,
  onRefreshDomain,
  onCategoryDeleted,
  setViewMode,
  setSortBy,
  setStatusFilter,
}: ApplicationContentAreaProps) {
  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory,
  );

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <CategoryNavigation
        categories={categories}
        selectedCategory={selectedCategory}
        showNewCategoryForm={showNewCategoryForm}
        showOverview={showOverview}
        onCategorySelect={onCategorySelect}
        onShowOverview={onShowOverview}
        onToggleNewCategoryForm={onToggleNewCategoryForm}
        onCategoryAdded={onCategoryAdded}
        applicationId={applicationId}
      />

      {/* Content Area */}
      {showOverview && categories.length > 0 ? (
        <ApplicationOverview
          application={application}
          categories={categories}
          totalDomains={overviewStats.totalDomains}
          totalChecks={overviewStats.totalChecks}
          availableCount={overviewStats.availableCount}
          unavailableCount={overviewStats.unavailableCount}
          unknownCount={overviewStats.unknownCount}
          lastCheckTime={overviewStats.lastCheckTime}
          applicationId={applicationId}
          onAddCategory={onAddCategory}
        />
      ) : selectedCategoryData ? (
        <CategoryContent
          selectedCategory={selectedCategoryData}
          domains={domains}
          selectedTlds={selectedTlds}
          showAddDomainForm={showAddDomainForm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onToggleAddDomainForm={onToggleAddDomainForm}
          onDomainAdded={onDomainAdded}
          onCheckDomains={onCheckDomains}
          onRefreshDomain={onRefreshDomain}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCategoryDeleted={onCategoryDeleted}
        />
      ) : null}
    </div>
  );
}
