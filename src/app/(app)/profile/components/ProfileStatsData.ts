import { fetchWithAuth } from "@/hooks/fetchWithAuth";

export interface ProfileStatsData {
  totalApplications: number;
  totalCategories: number;
  totalDomains: number;
}

export async function fetchProfileStats(): Promise<ProfileStatsData> {
  const response = await fetchWithAuth("/api/user/stats");

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}
