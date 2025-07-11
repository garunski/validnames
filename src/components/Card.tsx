import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
}

export function Card({ children, className = "", maxWidth = "md" }: CardProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    none: "",
  };

  return (
    <div
      className={`mx-auto w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${maxWidthClasses[maxWidth]} ${className}`}
    >
      {children}
    </div>
  );
}
