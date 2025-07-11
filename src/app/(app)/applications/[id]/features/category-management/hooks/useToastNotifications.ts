import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ToastItem = {
  id: string;
  message: string;
  type: "success" | "error";
  isVisible: boolean;
};

export function useToastNotifications() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showFavoriteMessage = (message: string, type: "success" | "error") => {
    const id = uuidv4();
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type, isVisible: true }];
      // Keep only the last 3 toasts (newest)
      return newToasts.slice(-3);
    });
  };

  // Called by each toast when it should hide (after timer)
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
    showFavoriteMessage,
    handleToastHide,
  };
}
