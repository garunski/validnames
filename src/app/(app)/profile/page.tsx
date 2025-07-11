"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileInformation } from "./components/ProfileInformation";
import { ProfileStats } from "./components/ProfileStats";

export default function ProfilePage() {
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/user");
      return response.data;
    },
  });

  const isLoading = userLoading;
  const user = userData?.user;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <div className="mt-4 text-zinc-500 dark:text-zinc-400">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-zinc-900 dark:text-white">
            User not found
          </div>
          <div className="mt-2 text-zinc-500 dark:text-zinc-400">
            Please log in to view your profile.
          </div>
        </div>
      </div>
    );
  }

  return (
    <FeatureErrorBoundary>
      <div className="space-y-8">
        <ProfileHeader user={user} />
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <ProfileStats hideActivityAndTips />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <ProfileInformation
            user={user}
            queryClient={queryClient}
            alwaysEditable
          />
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
