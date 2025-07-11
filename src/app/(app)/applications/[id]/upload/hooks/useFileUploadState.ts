import { useState } from "react";
import type { FileUploadStatus, UploadResult } from "../uploadTypes";

export function useFileUploadState() {
  const [fileUploads, setFileUploads] = useState<FileUploadStatus[]>([]);

  const handleFilesSelected = (files: File[]) => {
    const newFileUploads: FileUploadStatus[] = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      status: "pending",
    }));

    setFileUploads((prev) => [...prev, ...newFileUploads]);
  };

  const handleFileUploadStart = (fileId: string) => {
    setFileUploads((prev) =>
      prev.map((upload) =>
        upload.id === fileId ? { ...upload, status: "uploading" } : upload,
      ),
    );
  };

  const handleFileUploadSuccess = (fileId: string, result: UploadResult) => {
    setFileUploads((prev) =>
      prev.map((upload) =>
        upload.id === fileId
          ? { ...upload, status: "success", result }
          : upload,
      ),
    );
  };

  const handleFileUploadError = (fileId: string, errorMessage: string) => {
    setFileUploads((prev) =>
      prev.map((upload) =>
        upload.id === fileId
          ? { ...upload, status: "error", error: errorMessage }
          : upload,
      ),
    );
  };

  const handleClearCompletedUploads = () => {
    setFileUploads((prev) =>
      prev.filter(
        (upload) =>
          upload.status === "pending" || upload.status === "uploading",
      ),
    );
  };

  return {
    fileUploads,
    handleFilesSelected,
    handleFileUploadStart,
    handleFileUploadSuccess,
    handleFileUploadError,
    handleClearCompletedUploads,
  };
}
