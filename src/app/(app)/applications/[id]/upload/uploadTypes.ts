export interface UploadStats {
  categoriesProcessed: number;
  domainsProcessed: number;
}

export interface UploadResult {
  message: string;
  stats: UploadStats;
}

export interface FileUploadStatus {
  id: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  result?: UploadResult;
  error?: string;
}
