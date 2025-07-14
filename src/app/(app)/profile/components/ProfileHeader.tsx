"use client";

import { AppUser } from "@/app/api/auth/authTypes";
import { Avatar } from "@/primitives/avatar";
import { formatDistanceToNow } from "date-fns";

interface ProfileHeaderProps {
  user: AppUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  // Mock creation date - in a real app this would come from the user object
  const createdAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">Account</span>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          Profile
        </span>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Avatar
          initials={user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          className="size-20 bg-blue-100 text-blue-600 ring-4 ring-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/20"
          square={false}
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {user?.name || "User"}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">{user?.email}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            Member since {formatDistanceToNow(createdAt, { addSuffix: true })}
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-zinc-900 dark:text-white">
            Account Status
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <div className="size-1.5 rounded-full bg-green-500"></div>
            Active
          </div>
        </div>
      </div>
    </div>
  );
}
