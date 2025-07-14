"use client";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { FileUploadStatusList } from "./components/FileUploadStatusList";
import { QuickActionsSidebar } from "./components/QuickActionsSidebar";
import { UploadBreadcrumb } from "./components/UploadBreadcrumb";
import { UploadHeader } from "./components/UploadHeader";
import { UploadHelpSection } from "./components/UploadHelpSection";
import { UploadZone } from "./components/UploadZone";
import { useFileUploadState } from "./hooks/useFileUploadState";

interface UploadPageProps {
  params: Promise<{ id: string }>;
}

export default function UploadPage({ params }: UploadPageProps) {
  const { id } = use(params);
  return (
    <FeatureErrorBoundary featureName="Upload">
      <UploadPageContent id={id} />
    </FeatureErrorBoundary>
  );
}

function UploadPageContent({ id }: { id: string }) {
  const {
    fileUploads,
    handleFilesSelected,
    handleFileUploadStart,
    handleFileUploadSuccess,
    handleFileUploadError,
    handleClearCompletedUploads,
  } = useFileUploadState();

  const [aiTopic, setAiTopic] = useState("");
  const [helpTab, setHelpTab] = useState<string>("prompt");
  const [selectedPromptCategory, setSelectedPromptCategory] =
    useState<string>("creative");

  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/applications/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleResetAiTopic = () => {
    setAiTopic("");
  };

  const handleSelectVariationsPrompt = () => {
    setSelectedPromptCategory("variations");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">Failed to load application</div>
      </div>
    );
  }

  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <UploadBreadcrumb
        applicationName={application.name}
        applicationId={application.id}
      />

      <UploadHeader application={application} />

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <UploadZone
                id={id}
                onFilesSelected={handleFilesSelected}
                onFileUploadStart={handleFileUploadStart}
                onFileUploadSuccess={handleFileUploadSuccess}
                onFileUploadError={handleFileUploadError}
                fileUploads={fileUploads}
              />
            </div>
            <div className="w-80">
              <QuickActionsSidebar
                onResetAiTopic={handleResetAiTopic}
                setHelpTab={setHelpTab}
                helpTab={helpTab}
              />
            </div>
          </div>

          <FileUploadStatusList
            fileUploads={fileUploads}
            onClearCompleted={handleClearCompletedUploads}
          />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <UploadHelpSection
          aiTopic={aiTopic}
          onTopicChange={setAiTopic}
          selectedTab={helpTab}
          setSelectedTab={setHelpTab}
          applicationId={id}
          onSelectVariationsPrompt={handleSelectVariationsPrompt}
          selectedPromptCategory={selectedPromptCategory}
          onPromptCategoryChange={setSelectedPromptCategory}
        />
      </div>
    </div>
  );
}
