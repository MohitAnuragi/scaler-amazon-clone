import { useCallback, useEffect, useState } from "react";
import type { Category, ProductFilters } from "../../types";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

type FilterSidebarProps = {
  categories: Category[];
  filters: ProductFilters;
  brands: string[];
  onChange: (next: Partial<ProductFilters>) => void;
  onReset: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

const Section = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-amazon-border pb-3">
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-sm font-semibold"
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-2 text-sm text-gray-700">{children}</div>}
    </div>
  );
};

const FilterContent = ({
  categories,
  filters,
  brands,
  onChange,
  onReset,
}: Omit<FilterSidebarProps, "mobileOpen" | "onMobileClose">) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");
  const debouncedMin = useDebounce(minPrice, 400);
  const debouncedMax = useDebounce(maxPrice, 400);

  useEffect(() => {
    setMinPrice(filters.minPrice?.toString() ?? "");
    setMaxPrice(filters.maxPrice?.toString() ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    const nextMin = debouncedMin ? Number(debouncedMin) : undefined;
    const nextMax = debouncedMax ? Number(debouncedMax) : undefined;
    if (nextMin !== filters.minPrice || nextMax !== filters.maxPrice) {
      onChange({ minPrice: nextMin, maxPrice: nextMax, page: 1 });
    }
  }, [debouncedMin, debouncedMax]);

  const toggleBrand = useCallback(
    (brand: string) => {
      const current = filters.brands ?? [];
      const next = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      onChange({ brands: next, page: 1 });
    },
    [filters.brands, onChange]
  );

  const selectedCategoryId =
    filters.categoryId ??
    categories.find((c) => c.slug === filters.categorySlug)?.id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900">Filters</p>
        <button
          type="button"
          className="text-xs text-amazon-link hover:underline"
          onClick={onReset}
        >
          Clear all
        </button>
      </div>

      <Section title="Department">
        {categories.map((category) => (
          <label key={category.id} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategoryId === category.id}
              onChange={() =>
                onChange({ categoryId: undefined, categorySlug: category.slug, page: 1 })
              }
            />
            <span>
              {category.name}
              {category._count?.products != null && (
                <span className="text-gray-500"> ({category._count.products})</span>
              )}
            </span>
          </label>
        ))}
        <button
          type="button"
          className="text-xs text-amazon-link hover:underline"
          onClick={() => onChange({ categoryId: undefined, categorySlug: undefined, page: 1 })}
        >
          Clear category
        </button>
      </Section>

      <Section title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min ₹"
            className="w-full rounded border border-amazon-border px-2 py-1"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max ₹"
            className="w-full rounded border border-amazon-border px-2 py-1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </Section>

      <Section title="Avg. Customer Review">
        {[4, 3, 2].map((rating) => (
          <label key={rating} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="minRating"
              checked={filters.minRating === rating}
              onChange={() => onChange({ minRating: rating, page: 1 })}
            />
            {rating}★ &amp; above
          </label>
        ))}
        {filters.minRating && (
          <button
            type="button"
            className="text-xs text-amazon-link hover:underline"
            onClick={() => onChange({ minRating: undefined, page: 1 })}
          >
            Clear rating
          </button>
        )}
      </Section>

      <Section title="Availability">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onChange({ inStockOnly: e.target.checked ? true : undefined, page: 1 })}
          />
          In Stock only
        </label>
      </Section>

      <Section title="Deals">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(filters.featuredOnly)}
            onChange={(e) =>
              onChange({ featuredOnly: e.target.checked ? true : undefined, page: 1 })
            }
          />
          Featured / Top deals
        </label>
      </Section>

      {brands.length > 0 && (
        <Section title="Brands">
          {brands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) ?? false}
                onChange={() => toggleBrand(brand)}
              />
              {brand}
            </label>
          ))}
        </Section>
      )}
    </div>
  );
};

export const FilterSidebar = (props: FilterSidebarProps) => {
  const { mobileOpen, onMobileClose } = props;

  return (
    <>
      <aside className="hidden rounded bg-white p-4 shadow-sm lg:block">
        <FilterContent {...props} />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-[min(320px,90vw)] flex-col bg-white shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>
              <button type="button" onClick={onMobileClose} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent {...props} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
