import type {
  ApplicationWithCategoriesAndTlds,
  CategoryWithRelations,
  DomainWithRelations,
} from "@/app/api/applications/applicationTypes";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useRef } from "react";

export function useApplicationFetching(
  id: string,
  selectedCategory: string | null,
): {
  application: ApplicationWithCategoriesAndTlds | null;
  categories: CategoryWithRelations[];
  domains: DomainWithRelations[];
  loading: boolean;
  error: unknown;
  fetchData: () => void;
  fetchDomains: (categoryId?: string | null) => Promise<DomainWithRelations[]>;
  refetchDomains: () => void;
} {
  // Fetch application data
  const {
    data: application,
    isLoading: loading,
    error,
    refetch: refetchApplication,
  } = useQuery<ApplicationWithCategoriesAndTlds | null>({
    queryKey: ["application", id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/applications/${id}`);
      if (!response.data) notFound();
      return response.data as ApplicationWithCategoriesAndTlds;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch categories
  const { data: categories = [], refetch: refetchCategories } = useQuery<
    CategoryWithRelations[]
  >({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `/api/categories?applicationId=${id}`,
      );
      return response.data as CategoryWithRelations[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch domains for a category
  const fetchDomains = async (
    categoryId?: string | null,
  ): Promise<DomainWithRelations[]> => {
    const catId = categoryId ?? selectedCategory;
    if (!catId) return [];
    const response = await fetchWithAuth(`/api/domains?categoryId=${catId}`);
    return response.data as DomainWithRelations[];
  };

  // React Query for domains
  const unchangedCountRef = useRef(0);
  const lastDataRef = useRef<DomainWithRelations[] | null>(null);
  const { data: domains = [], refetch: refetchDomains } = useQuery<
    DomainWithRelations[]
  >({
    queryKey: ["domains", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const response = await fetchWithAuth(
        `/api/domains?categoryId=${selectedCategory}`,
      );
      return response.data as DomainWithRelations[];
    },
    enabled: !!selectedCategory,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: (query) => {
      const data = query.state.data as DomainWithRelations[] | undefined;
      if (!lastDataRef.current) {
        lastDataRef.current = data ?? [];
        unchangedCountRef.current = 0;
        return 5000;
      }
      const shallowEqual = (
        a: DomainWithRelations[],
        b: DomainWithRelations[],
      ) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
          if (a[i].id !== b[i].id || a[i].updatedAt !== b[i].updatedAt)
            return false;
        }
        return true;
      };
      if (shallowEqual(data ?? [], lastDataRef.current)) {
        unchangedCountRef.current++;
      } else {
        unchangedCountRef.current = 0;
        lastDataRef.current = data ?? [];
      }
      return unchangedCountRef.current >= 3 ? false : 5000;
    },
  });

  return {
    application: application ?? null,
    categories,
    domains,
    loading,
    error,
    fetchData: () => {
      refetchApplication();
      refetchCategories();
    },
    fetchDomains,
    refetchDomains,
  };
}
