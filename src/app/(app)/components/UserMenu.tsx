"use client";

import { AppUser } from "@/app/api/auth/authTypes";
import { Avatar } from "@/primitives/avatar";
import {
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from "@/primitives/dropdown";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

interface UserMenuProps {
  anchor: "top start" | "bottom end";
  user: AppUser | null;
  onSignOut: () => void;
}

export function UserMenu({ anchor, user, onSignOut }: UserMenuProps) {
  return (
    <DropdownMenu
      anchor={anchor}
      className="z-50 !w-auto min-w-[250px] rounded-xl border border-zinc-200 bg-white !p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <DropdownItem
        href="/profile"
        className={clsx(
          "!cursor-pointer !rounded-lg !border-0 !p-0",
          "bg-zinc-100 dark:bg-zinc-800/50",
          "data-focus:!bg-zinc-200/70 dark:data-focus:!bg-zinc-700/60",
        )}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Avatar
            initials={user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            className="size-9 bg-white text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:ring-zinc-600"
            square={false}
          />
          <div className="flex flex-col">
            <div className="text-sm font-medium text-zinc-900 dark:text-white">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {user?.email || "user@example.com"}
            </div>
          </div>
        </div>
      </DropdownItem>
      <DropdownDivider className="my-1.5" />
      <DropdownItem
        onClick={onSignOut}
        className={clsx(
          "!cursor-pointer !rounded-lg !border-0 !p-0",
          "data-focus:!bg-red-50/80 dark:data-focus:!bg-red-900/20",
          "data-focus:!text-red-600 dark:data-focus:!text-red-400",
        )}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          <ArrowRightStartOnRectangleIcon className="size-5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Sign out
          </span>
        </div>
      </DropdownItem>
    </DropdownMenu>
  );
}
