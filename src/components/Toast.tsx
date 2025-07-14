"use client";

import { Button } from "@/primitives/button";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface ToastProps {
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  isVisible: boolean;
  onHide: () => void;
  showCloseButton?: boolean;
}

const typeConfig = {
  success: {
    icon: CheckCircleIcon,
    classes:
      "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
    iconClasses: "text-green-600 dark:text-green-400",
  },
  error: {
    icon: ExclamationCircleIcon,
    classes:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
    iconClasses: "text-red-600 dark:text-red-400",
  },
  info: {
    icon: InformationCircleIcon,
    classes:
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    iconClasses: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: ExclamationCircleIcon,
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    iconClasses: "text-amber-600 dark:text-amber-400",
  },
};

export function Toast({
  message,
  type = "info",
  position = "bottom-right",
  duration = 4000,
  isVisible,
  onHide,
  showCloseButton = true,
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onHide, 300); // Wait for slide out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide, duration]);

  if (!isVisible) return null;

  const config = typeConfig[type];
  const IconComponent = config.icon;
  const baseClasses = `relative w-max z-10 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ease-in-out ${config.classes}`;
  const animationClasses = isAnimating
    ? "translate-x-0 opacity-100"
    : position.includes("right")
      ? "translate-x-full opacity-0"
      : position.includes("left")
        ? "-translate-x-full opacity-0"
        : "translate-y-full opacity-0";

  return (
    <div className={`${baseClasses} ${animationClasses}`}>
      <IconComponent
        className={`h-5 w-5 flex-shrink-0 ${config.iconClasses}`}
      />
      <span className="text-sm font-medium">{message}</span>
      {showCloseButton && (
        <Button
          plain
          onClick={onHide}
          className="ml-2 h-auto flex-shrink-0 p-1"
        >
          <XMarkIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
