import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../config/api";
import type { ProductFilters } from "../types";
import { filtersToApiParams } from "../utils/productFilters";
import { useDebounce } from "./useDebounce";

export const useProductsQuery = (filters: ProductFilters) => {
  const apiParams = filtersToApiParams(filters);
  return useQuery({
    queryKey: ["products", apiParams],
    queryFn: async () => {
      const response = await apiClient.getProducts(apiParams);
      return response.data.data;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useProductBrands = (filters: Pick<ProductFilters, "categoryId" | "categorySlug">) =>
  useQuery({
    queryKey: ["product-brands", filters],
    queryFn: async () => {
      const response = await apiClient.getProductBrands({
        categoryId: filters.categoryId,
        categorySlug: filters.categorySlug,
      });
      return response.data.data;
    },
    staleTime: 60_000,
  });

export const useProductDetail = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await apiClient.getProductBySlug(slug);
      return response.data.data;
    },
  });

export const useFeaturedProducts = (limit = 8) =>
  useQuery({
    queryKey: ["featured-products", limit],
    queryFn: async () => {
      const response = await apiClient.getFeaturedProducts(limit);
      return response.data.data;
    },
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.getCategories(true);
      return response.data.data;
    },
    staleTime: 60_000,
  });

export const useSearchProducts = (
  query: string,
  filters?: { categoryId?: string; categorySlug?: string }
) => {
  const debounced = useDebounce(query, 300);
  return useQuery({
    queryKey: ["search-products", debounced, filters?.categoryId, filters?.categorySlug],
    queryFn: async () => {
      if (!debounced || debounced.length < 2) {
        return [];
      }
      const response = await apiClient.searchProducts(debounced, 5, filters);
      return response.data.data;
    },
    enabled: debounced.length >= 2,
  });
};
