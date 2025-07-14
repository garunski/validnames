"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface AutoCheckToast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  isVisible: boolean;
}

export function useAutoDomainCheckingNotifications() {
  const [toasts, setToasts] = useState<AutoCheckToast[]>([]);

  const showAutoCheckStart = (
    categoryName: string,
    unknownDomainCount: number,
  ) => {
    const id = uuidv4();
    const message = `Auto-checking ${unknownDomainCount} unknown domain${unknownDomainCount > 1 ? "s" : ""} in "${categoryName}"...`;

    setToasts((prev) => {
      const newToasts = [
        ...prev,
        { id, message, type: "info" as const, isVisible: true },
      ];
      // Keep only the last 3 toasts
      return newToasts.slice(-3);
    });
  };

  const showAutoCheckComplete = (categoryName: string, success: boolean) => {
    const id = uuidv4();
    const message = success
      ? `Domain check completed for "${categoryName}"`
      : `Domain check failed for "${categoryName}"`;
    const type = success ? ("success" as const) : ("error" as const);

    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type, isVisible: true }];
      // Keep only the last 3 toasts
      return newToasts.slice(-3);
    });
  };

  const handleToastHide = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isVisible: false } : t)),
    );
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  };

  return {
    toasts,
    showAutoCheckStart,
    showAutoCheckComplete,
    handleToastHide,
  };
}
