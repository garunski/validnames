"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { DeleteAccountForm } from "@/components/forms/DeleteAccountForm";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useQuery } from "@tanstack/react-query";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileInformation } from "./components/ProfileInformation";
import { ProfileStats } from "./components/ProfileStats";

export default function ProfilePage() {
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
      <FeatureErrorBoundary>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              User not found or not authenticated.
            </p>
          </div>
        </div>
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary>
      <div className="space-y-8">
        <ProfileHeader user={user} />
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <ProfileStats />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <ProfileInformation user={user} alwaysEditable />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-600">
                Danger Zone
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                These actions are irreversible. Please proceed with caution.
              </p>
            </div>
            <DeleteAccountForm />
          </div>
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
