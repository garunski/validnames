"use client";

import { BaseHeader } from "@/components/layout/BaseHeader";
import { TLDDisplay } from "@/components/tldDisplay";
import { Button } from "@/primitives/button";
import {
  CalendarIcon,
  CloudArrowUpIcon,
  FolderIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { useApplicationDeletion } from "../hooks/useApplicationDeletion";
import { ApplicationDeleteConfirmation } from "./ApplicationDeleteConfirmation";

interface ApplicationHeaderProps {
  application: { name: string; description?: string | null; createdAt: string };
  applicationId: string;
  selectedTlds: string[];
  onShowTldSelector: () => void;
}

export function ApplicationHeader({
  application,
  applicationId,
  selectedTlds,
  onShowTldSelector,
}: ApplicationHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteApplication, isDeleting } = useApplicationDeletion();

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteApplication(applicationId);
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <BaseHeader
        icon={<FolderIcon className="size-5" />}
        title={application.name}
        description={application.description || undefined}
        metadata={{
          icon: <CalendarIcon className="size-3" />,
          text: `Created ${new Date(application.createdAt).toLocaleDateString()}`,
        }}
        actions={
          <div className="flex items-center gap-3">
            <Button href={`/applications/${applicationId}/upload`} color="blue">
              <CloudArrowUpIcon
                className="size-4 !text-white"
                data-slot="icon"
              />
              Upload Domains
            </Button>
            <Button
              onClick={handleDeleteClick}
              outline
              className="!border-red-500 !text-red-600 hover:border-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <TrashIcon className="size-4 !text-red-600" />
              Delete Application
            </Button>
          </div>
        }
        secondaryContent={
          <>
            <TagIcon className="size-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Active TLDs ({selectedTlds.length}):
            </span>
            <div className="min-w-0 flex-1">
              <TLDDisplay selectedTldExtensions={selectedTlds} />
            </div>
          </>
        }
        secondaryActions={
          <Button onClick={onShowTldSelector} outline className="shrink-0">
            Manage TLDs
          </Button>
        }
      />

      <ApplicationDeleteConfirmation
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        applicationName={application.name}
        isDeleting={isDeleting}
      />
    </>
  );
}
