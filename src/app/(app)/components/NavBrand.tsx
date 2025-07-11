"use client";

import { Link } from "@/primitives/link";
import { GlobeAltIcon } from "@heroicons/react/20/solid";

export function NavBrand() {
  return (
    <Link
      href="/applications"
      className="flex cursor-pointer items-center gap-2 text-xl font-bold text-zinc-900 transition-opacity hover:opacity-80 dark:text-white"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <GlobeAltIcon className="size-5" />
      </div>
      <span>Valid Names</span>
    </Link>
  );
}
