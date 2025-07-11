"use client";

import { Link } from "@/primitives/link";

interface DesktopNavigationProps {
  pathname: string;
}

export function DesktopNavigation({ pathname }: DesktopNavigationProps) {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      <Link
        href="/applications"
        className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          pathname === "/" || pathname.startsWith("/applications")
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        }`}
      >
        Applications
      </Link>
      <Link
        href="/tlds"
        className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          pathname.startsWith("/tlds")
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        }`}
      >
        TLD Management
      </Link>
    </nav>
  );
}
