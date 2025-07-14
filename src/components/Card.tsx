import clsx from "clsx";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, maxWidth = "md" }: CardProps) {
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
      className={clsx(
        "mx-auto w-full rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={clsx(
        "border-b border-zinc-200 px-6 py-4 dark:border-zinc-800",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={clsx(
        "text-lg font-semibold text-zinc-900 dark:text-white",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx("p-6", className)}>{children}</div>;
}

// Add Card.Header, Card.Title, and Card.Content as properties of Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
