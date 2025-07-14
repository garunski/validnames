"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { ApplicationsEmpty } from "./components/ApplicationsEmpty";
import { ApplicationsError } from "./components/ApplicationsError";
import { ApplicationsHeader } from "./components/ApplicationsHeader";
import { ApplicationsList } from "./components/ApplicationsList";
import { ApplicationsLoading } from "./components/ApplicationsLoading";

import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useQuery } from "@tanstack/react-query";

export default function ApplicationsPage() {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/applications");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Ensure applications is always an array
  const applications = Array.isArray(data) ? data : [];

  if (loading) {
    return <ApplicationsLoading />;
  }

  if (error) {
    return (
      <ApplicationsError
        error={error instanceof Error ? error.message : String(error)}
      />
    );
  }

  return (
    <FeatureErrorBoundary featureName="Applications">
      <div className="space-y-8">
        <ApplicationsHeader />

        {applications.length === 0 ? (
          <ApplicationsEmpty />
        ) : (
          <ApplicationsList applications={applications} />
        )}
      </div>
    </FeatureErrorBoundary>
  );
}
