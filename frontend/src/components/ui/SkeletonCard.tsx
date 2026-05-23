export const SkeletonCard = () => (
  <div className="border border-amazon-border bg-white p-3 shadow-sm">
    <div className="shimmer h-40 w-full rounded" />
    <div className="mt-3 space-y-2">
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-4 w-1/2 rounded" />
      <div className="shimmer h-6 w-1/3 rounded" />
    </div>
    <div className="mt-4 shimmer h-9 w-full rounded" />
  </div>
);
