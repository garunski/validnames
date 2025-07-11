"use client";

import { Toast, type ToastType } from "@/components/Toast";

interface FavoriteMessageProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onHide: () => void;
}

export function FavoriteMessage({
  message,
  type,
  isVisible,
  onHide,
}: FavoriteMessageProps) {
  return (
    <Toast
      message={message}
      type={type as ToastType}
      position="bottom-right"
      duration={4000}
      isVisible={isVisible}
      onHide={onHide}
      showCloseButton={true}
    />
  );
}
