import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "../components/products/FilterSidebar";
import { ProductGrid } from "../components/products/ProductGrid";
import { SortBar } from "../components/products/SortBar";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { useCategories, useProductBrands, useProductsQuery } from "../hooks/useProducts";
import type { ProductFilters } from "../types";
import {
  hasActiveFilters,
  parseProductFilters,
  serializeProductFilters,
} from "../utils/productFilters";

export const ProductListingPage = () => {
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(() => parseProductFilters(params), [params]);

  const { data, isLoading, isFetching } = useProductsQuery(filters);
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useProductBrands({
    categoryId: filters.categoryId,
    categorySlug: filters.categorySlug,
  });

  const updateParams = useCallback(
    (updates: Partial<ProductFilters>) => {
      const next = serializeProductFilters(params, { ...updates, page: updates.page ?? 1 });
      setParams(next);
    },
    [params, setParams]
  );

  const resetFilters = useCallback(() => {
    const next = new URLSearchParams();
    if (filters.search) next.set("search", filters.search);
    if (filters.sortBy && filters.sortBy !== "featured") next.set("sort", filters.sortBy);
    setParams(next);
    setMobileFiltersOpen(false);
  }, [filters.search, filters.sortBy, setParams]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;
  const activeCategory = categories.find(
    (c) => c.id === filters.categoryId || c.slug === filters.categorySlug
  );

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6">
      <SortBar
        total={data?.total ?? 0}
        searchQuery={filters.search}
        categoryName={activeCategory?.name}
        sortBy={filters.sortBy}
        isFetching={isFetching && !isLoading}
        onSortChange={(value) => updateParams({ sortBy: value as ProductFilters["sortBy"] })}
      />

      <div className="mt-3 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded border border-amazon-border bg-white px-3 py-2 text-sm shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters(filters) && (
            <span className="rounded-full bg-amazon-orange px-1.5 text-xs font-bold text-black">
              •
            </span>
          )}
        </button>
        {hasActiveFilters(filters) && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-amazon-link hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
        <FilterSidebar
          categories={categories}
          filters={filters}
          brands={brands}
          onChange={updateParams}
          onReset={resetFilters}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />
        <div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : data && data.items.length ? (
            <ProductGrid products={data.items} />
          ) : (
            <div className="rounded bg-white p-8 text-center text-gray-600 shadow-sm">
              No results found. Try adjusting your filters.
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={filters.page === 1}
                onClick={() => updateParams({ page: Math.max(1, (filters.page ?? 1) - 1) })}
                className="rounded bg-white px-3 py-2 text-sm text-gray-700 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => updateParams({ page })}
                    className={`rounded px-3 py-2 text-sm ${
                      page === filters.page
                        ? "bg-amazon-orange text-black"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={(filters.page ?? 1) >= totalPages}
                onClick={() =>
                  updateParams({ page: Math.min(totalPages, (filters.page ?? 1) + 1) })
                }
                className="rounded bg-white px-3 py-2 text-sm text-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
