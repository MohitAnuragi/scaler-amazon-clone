type SortBarProps = {
  total: number;
  searchQuery?: string;
  categoryName?: string;
  sortBy?: string;
  isFetching?: boolean;
  onSortChange: (value: string) => void;
};

export const SortBar = ({
  total,
  searchQuery,
  categoryName,
  sortBy,
  isFetching,
  onSortChange,
}: SortBarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded bg-white px-4 py-3 shadow-sm">
    <p className="text-sm text-gray-700">
      {isFetching ? "Updating…" : `${total.toLocaleString("en-IN")} results`}
      {searchQuery ? ` for "${searchQuery}"` : ""}
      {!searchQuery && categoryName ? ` in ${categoryName}` : ""}
    </p>
    <select
      className="rounded border border-amazon-border px-3 py-2 text-sm"
      value={sortBy ?? "featured"}
      onChange={(event) => onSortChange(event.target.value)}
    >
      <option value="featured">Featured</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="rating">Avg. Customer Review</option>
      <option value="newest">Newest Arrivals</option>
      <option value="bestsellers">Bestsellers</option>
    </select>
  </div>
);
