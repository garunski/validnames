"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { FileUploadStatus, UploadResult } from "../uploadTypes";
import { UploadArea } from "./UploadArea";

interface UploadZoneProps {
  id: string;
  onFilesSelected: (files: File[]) => void;
  onFileUploadStart: (fileId: string) => void;
  onFileUploadSuccess: (fileId: string, result: UploadResult) => void;
  onFileUploadError: (fileId: string, error: string) => void;
  fileUploads: FileUploadStatus[];
}

export function UploadZone({
  id,
  onFilesSelected,
  onFileUploadStart,
  onFileUploadSuccess,
  onFileUploadError,
  fileUploads,
}: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // React Query mutation for file upload
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/applications/${id}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      return result;
    },
  });

  // Process pending files sequentially
  useEffect(() => {
    const processPendingFiles = async () => {
      const pendingFiles = fileUploads.filter(
        (upload) => upload.status === "pending",
      );

      if (pendingFiles.length === 0 || isProcessing) {
        return;
      }

      setIsProcessing(true);

      for (const upload of pendingFiles) {
        try {
          onFileUploadStart(upload.id);
          const result = await uploadMutation.mutateAsync(upload.file);
          onFileUploadSuccess(upload.id, result);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";
          onFileUploadError(upload.id, errorMessage);
        }
      }

      setIsProcessing(false);
    };

    processPendingFiles();
  }, [
    fileUploads,
    isProcessing,
    uploadMutation,
    onFileUploadStart,
    onFileUploadSuccess,
    onFileUploadError,
  ]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Filter for JSON files only
    const jsonFiles = files.filter((file) => file.type === "application/json");
    if (jsonFiles.length !== files.length) {
      alert("Only JSON files are supported. Non-JSON files will be ignored.");
    }

    if (jsonFiles.length > 0) {
      onFilesSelected(jsonFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Filter for JSON files only
    const jsonFiles = files.filter((file) => file.type === "application/json");
    if (jsonFiles.length !== files.length) {
      alert("Only JSON files are supported. Non-JSON files will be ignored.");
    }

    if (jsonFiles.length > 0) {
      onFilesSelected(jsonFiles);
    }
  };

  const isUploading =
    isProcessing || fileUploads.some((upload) => upload.status === "uploading");

  return (
    <FeatureErrorBoundary>
      <UploadArea
        dragActive={dragActive}
        uploading={isUploading}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onFileUpload={handleFileUpload}
      />
    </FeatureErrorBoundary>
  );
}
