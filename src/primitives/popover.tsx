import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";

export function Popover({
  children,
  className,
  ...props
}: Headless.PopoverProps & { className?: string; children: ReactNode }) {
  return (
    <Headless.Popover {...props} className={className}>
      {children}
    </Headless.Popover>
  );
}

export function PopoverButton({
  className,
  ...props
}: Headless.PopoverButtonProps<"button"> & { className?: string }) {
  return (
    <Headless.Popover.Button
      {...props}
      className={clsx(
        className,
        // Remove outline by default, add focus ring
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      )}
    />
  );
}

export function PopoverPanel({
  className,
  anchor = "top-end",
  ...props
}: Omit<Headless.PopoverPanelProps<"div">, "anchor"> & {
  className?: string;
  anchor?: "top-end" | "bottom-end" | "bottom-start" | "top-start";
}) {
  // Positioning classes for different anchors
  const anchorClasses = {
    "top-end": "absolute right-0 top-full mt-2",
    "bottom-end": "absolute right-0 bottom-full mb-2",
    "bottom-start": "absolute left-0 bottom-full mb-2",
    "top-start": "absolute left-0 top-full mt-2",
  };
  return (
    <Headless.Popover.Panel
      {...props}
      className={clsx(
        anchorClasses[anchor],
        "z-50 w-96 max-w-full rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800",
        className,
      )}
      static
      // static: always render for animation, but let Headless handle visibility
    />
  );
}
