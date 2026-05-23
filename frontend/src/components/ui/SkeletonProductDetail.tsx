export const SkeletonProductDetail = () => (
  <div className="grid gap-6 lg:grid-cols-[45%_35%_20%]">
    <div className="space-y-3">
      <div className="shimmer h-20 w-20 rounded" />
      <div className="shimmer h-[420px] w-full rounded" />
    </div>
    <div className="space-y-4">
      <div className="shimmer h-6 w-2/3 rounded" />
      <div className="shimmer h-4 w-1/3 rounded" />
      <div className="shimmer h-10 w-1/2 rounded" />
      <div className="space-y-2">
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-5/6 rounded" />
        <div className="shimmer h-4 w-4/6 rounded" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="shimmer h-10 w-full rounded" />
      <div className="shimmer h-10 w-full rounded" />
      <div className="shimmer h-20 w-full rounded" />
    </div>
  </div>
);
