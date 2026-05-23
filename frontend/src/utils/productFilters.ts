import type { ProductFilters } from "../types";

const SORT_ALIASES: Record<string, ProductFilters["sortBy"]> = {
  new: "newest",
  bestsellers: "bestsellers",
};

export const parseProductFilters = (params: URLSearchParams): ProductFilters => {
  const rawSort = params.get("sort") ?? "featured";
  const sortBy = (SORT_ALIASES[rawSort] ?? rawSort) as ProductFilters["sortBy"];

  const brandsParam = params.get("brands");
  const brands = brandsParam
    ? brandsParam.split(",").map((b) => b.trim()).filter(Boolean)
    : undefined;

  const category = params.get("category") ?? undefined;
  const isCuid = Boolean(category && /^c[a-z0-9]{20,}$/i.test(category));

  return {
    categoryId: category && isCuid ? category : undefined,
    categorySlug: category && !isCuid ? category : undefined,
    search: params.get("search") ?? undefined,
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    minRating: params.get("minRating") ? Number(params.get("minRating")) : undefined,
    brands,
    inStockOnly: params.get("inStock") === "1",
    featuredOnly: params.get("featured") === "1",
    sortBy: sortBy ?? "featured",
    page: Number(params.get("page") ?? 1),
    limit: 24,
  };
};

export const serializeProductFilters = (
  current: URLSearchParams,
  updates: Partial<ProductFilters>
): URLSearchParams => {
  const next = new URLSearchParams(current);

  const applyCategory = () => {
    const categoryId = updates.categoryId;
    const categorySlug = updates.categorySlug;
    if (categoryId !== undefined || categorySlug !== undefined) {
      const value = categoryId ?? categorySlug;
      if (value) {
        next.set("category", value);
      } else {
        next.delete("category");
      }
    }
  };

  applyCategory();

  if (updates.search !== undefined) {
    if (updates.search) next.set("search", updates.search);
    else next.delete("search");
  }

  if (updates.minPrice !== undefined) {
    if (updates.minPrice > 0) next.set("minPrice", String(updates.minPrice));
    else next.delete("minPrice");
  }

  if (updates.maxPrice !== undefined) {
    if (updates.maxPrice > 0) next.set("maxPrice", String(updates.maxPrice));
    else next.delete("maxPrice");
  }

  if (updates.minRating !== undefined) {
    if (updates.minRating > 0) next.set("minRating", String(updates.minRating));
    else next.delete("minRating");
  }

  if (updates.brands !== undefined) {
    if (updates.brands.length) next.set("brands", updates.brands.join(","));
    else next.delete("brands");
  }

  if (updates.inStockOnly !== undefined) {
    if (updates.inStockOnly) next.set("inStock", "1");
    else next.delete("inStock");
  }

  if (updates.featuredOnly !== undefined) {
    if (updates.featuredOnly) next.set("featured", "1");
    else next.delete("featured");
  }

  if (updates.sortBy !== undefined) {
    next.set("sort", updates.sortBy);
  }

  if (updates.page !== undefined) {
    if (updates.page > 1) next.set("page", String(updates.page));
    else next.delete("page");
  }

  return next;
};

export const hasActiveFilters = (filters: ProductFilters) =>
  Boolean(
    filters.categoryId ||
      filters.categorySlug ||
      filters.search ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minRating ||
      filters.brands?.length ||
      filters.inStockOnly ||
      filters.featuredOnly
  );

export const filtersToApiParams = (filters: ProductFilters): ProductFilters => {
  const { page = 1, limit = 24, sortBy, ...rest } = filters;
  return {
    ...rest,
    sortBy,
    page,
    limit,
  };
};
