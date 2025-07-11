"use client";

import { useApplicationData } from "@/applications/hooks/useApplicationData";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { TLDSelector } from "@/components/tldSelector";
import { notFound } from "next/navigation";
import { useApplicationOverviewStats } from "../hooks/useApplicationOverviewStats";
import { useApplicationPageState } from "../hooks/useApplicationPageState";
import { ApplicationBreadcrumb } from "./ApplicationBreadcrumb";
import { ApplicationContentArea } from "./ApplicationContentArea";
import { ApplicationErrorState } from "./ApplicationErrorState";
import { ApplicationHeader } from "./ApplicationHeader";
import { ApplicationLoadingState } from "./ApplicationLoadingState";

interface ApplicationPageContentProps {
  id: string;
}

export function ApplicationPageContent({ id }: ApplicationPageContentProps) {
  const {
    application,
    categories,
    selectedCategory,
    setSelectedCategory,
    domains,
    loading,
    error,
    selectedTlds,
    updateSelectedTlds,
    handleCheckDomains,
    handleRefreshDomain,
  } = useApplicationData(id);

  const {
    showTldSelector,
    showNewCategoryForm,
    showAddDomainForm,
    showOverview,
    viewMode,
    sortBy,
    statusFilter,
    setViewMode,
    setSortBy,
    setStatusFilter,
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
  } = useApplicationPageState(setSelectedCategory);

  // Calculate overview statistics using extracted hook
  const overviewStats = useApplicationOverviewStats(categories);

  if (loading) {
    return <ApplicationLoadingState />;
  }

  if (error) {
    return (
      <ApplicationErrorState
        error={error instanceof Error ? error.message : String(error)}
      />
    );
  }

  if (!application) notFound();

  return (
    <FeatureErrorBoundary featureName="Application">
      <div className="space-y-6">
        <ApplicationBreadcrumb applicationName={application.name} />

        <ApplicationHeader
          application={{
            name: application.name,
            description: application.description,
            createdAt:
              typeof application.createdAt === "string"
                ? application.createdAt
                : application.createdAt
                  ? application.createdAt.toISOString()
                  : "",
          }}
          applicationId={id}
          selectedTlds={selectedTlds}
          onShowTldSelector={handleShowTldSelector}
        />

        <ApplicationContentArea
          application={application}
          categories={categories}
          selectedCategory={selectedCategory}
          domains={domains}
          selectedTlds={selectedTlds}
          showNewCategoryForm={showNewCategoryForm}
          showOverview={showOverview}
          showAddDomainForm={showAddDomainForm}
          viewMode={viewMode}
          sortBy={sortBy}
          statusFilter={statusFilter}
          overviewStats={overviewStats}
          applicationId={id}
          onCategorySelect={handleCategorySelect}
          onShowOverview={handleShowOverview}
          onToggleNewCategoryForm={handleToggleNewCategoryForm}
          onCategoryAdded={handleCategoryAdded}
          onAddCategory={handleAddCategory}
          onToggleAddDomainForm={handleToggleAddDomainForm}
          onDomainAdded={handleDomainAdded}
          onCheckDomains={handleCheckDomains}
          onRefreshDomain={handleRefreshDomain}
          onCategoryDeleted={handleCategoryDeleted}
          setViewMode={setViewMode}
          setSortBy={setSortBy}
          setStatusFilter={setStatusFilter}
        />

        <TLDSelector
          isOpen={showTldSelector}
          onClose={handleCloseTldSelector}
          selectedTldExtensions={selectedTlds}
          onSelectionChange={updateSelectedTlds}
        />
      </div>
    </FeatureErrorBoundary>
  );
}
