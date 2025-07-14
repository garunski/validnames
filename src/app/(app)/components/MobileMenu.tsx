"use client";

import { AppUser } from "@/app/api/auth/authTypes";
import { Avatar } from "@/primitives/avatar";
import { Link } from "@/primitives/link";
import {
  ArrowRightStartOnRectangleIcon,
  CogIcon,
} from "@heroicons/react/16/solid";
import { GlobeAltIcon } from "@heroicons/react/20/solid";

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  user: AppUser | null;
  onClose: () => void;
  onSignOut: () => void;
}

export function MobileMenu({
  isOpen,
  pathname,
  user,
  onClose,
  onSignOut,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="border-b border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Mobile Navigation */}
        <nav className="space-y-2">
          <Link
            href="/applications"
            className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/" || pathname.startsWith("/applications")
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
            onClick={onClose}
          >
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="size-5" />
              Applications
            </div>
          </Link>
          <Link
            href="/tlds"
            className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/tlds")
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
            onClick={onClose}
          >
            <div className="flex items-center gap-2">
              <CogIcon className="size-5" />
              TLD Management
            </div>
          </Link>
        </nav>

        {/* Mobile User Section */}
        <div className="space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-3 rounded-lg bg-zinc-50 px-3 py-3 dark:bg-zinc-800"
            onClick={onClose}
          >
            <Avatar
              initials={user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              square={false}
              className="size-8"
            />
            <div>
              <div className="text-sm font-medium text-zinc-900 dark:text-white">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email || "user@example.com"}
              </div>
            </div>
          </Link>

          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <ArrowRightStartOnRectangleIcon className="size-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
