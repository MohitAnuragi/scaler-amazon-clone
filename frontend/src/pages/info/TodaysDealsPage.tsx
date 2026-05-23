import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatters";
import { useProductsQuery } from "../../hooks/useProducts";
import { StarRating } from "../../components/ui/StarRating";
import { LoadingState } from "../../components/ui/LoadingState";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";
import type { Product } from "../../types";

const CATEGORY_TABS = [
  "All",
  "Electronics",
  "Mobiles",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Books",
  "Sports",
  "Gaming",
  "Grocery",
];

const slugByCategoryName: Record<string, string> = {
  Electronics: "electronics",
  Mobiles: "mobiles",
  Fashion: "fashion",
  "Home & Kitchen": "home-kitchen",
  Beauty: "beauty",
  Books: "books",
  Sports: "sports",
  Gaming: "gaming",
  Grocery: "grocery",
};

const claimedPercent = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * (i + 1)) % 100;
  return 35 + (hash % 55);
};

export const TodaysDealsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [timeLeft, setTimeLeft] = useState({ h: 7, m: 42, s: 33 });

  const categorySlug =
    activeCategory === "All" ? undefined : slugByCategoryName[activeCategory];

  const { data, isLoading } = useProductsQuery({
    page: 1,
    limit: 48,
    featuredOnly: true,
    categorySlug,
    sortBy: "bestsellers",
  });

  const deals = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter(
      (p) => p.compareAtPrice && p.compareAtPrice > p.price
    ) as Product[];
  }, [data?.items]);

  useEffect(() => {
    document.title = "Today's Deals | Amazon.in";
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-amazon-blue to-amazon-blue-light py-6">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Today's Deals</h1>
              <p className="mt-1 text-sm text-gray-300">All discounts, eligible items only</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-black/30 px-4 py-2">
              <span className="text-xs font-medium text-gray-300">Deals end in</span>
              <span className="text-xl font-bold tabular-nums text-amazon-yellow">
                {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-amazon-blue-light shadow-md">
        <div className="mx-auto max-w-[1500px] overflow-x-auto px-4">
          <div className="flex gap-0 py-0">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "border-b-2 border-amazon-orange bg-white/10 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-6">
        {isLoading ? (
          <LoadingState title="Loading deals" description="Fetching today's best offers." />
        ) : deals.length === 0 ? (
          <div className="rounded-lg bg-white py-20 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-500">
              No deals in this category right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {deals.map((deal) => {
              const discount =
                deal.discountPercent ??
                Math.round(
                  ((deal.compareAtPrice! - deal.price) / deal.compareAtPrice!) * 100
                );
              const claimed = claimedPercent(deal.id);
              return (
                <div
                  key={deal.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/products/${deal.slug}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/products/${deal.slug}`)}
                  className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                >
                  <div className="absolute left-2 top-2 z-10 rounded bg-amazon-red px-2 py-1 text-xs font-bold text-white">
                    -{discount}%
                  </div>

                  <div className="relative overflow-hidden bg-gray-50">
                    <ImageWithFallback
                      src={deal.images?.[0]?.url ?? null}
                      alt={deal.name}
                      productName={deal.name}
                      categorySlug={deal.category?.slug}
                      className="h-48 w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      containerClassName="h-48 w-full"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <div className="mb-1 flex items-center gap-1">
                      <span className="rounded-sm bg-amazon-red/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amazon-red">
                        Limited time deal
                      </span>
                    </div>

                    <h2 className="line-clamp-2 text-sm font-medium leading-tight text-gray-900">
                      {deal.name}
                    </h2>

                    <div className="mt-1.5 flex items-center gap-1.5">
                      <StarRating rating={deal.averageRating} />
                      <span className="text-xs text-amazon-link">
                        {deal.totalReviews.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-bold text-gray-900">
                        {formatPrice(deal.price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(deal.compareAtPrice!)}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-amazon-red">
                          {claimed}% claimed
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all ${claimed > 80 ? "bg-amazon-red" : "bg-amazon-orange"}`}
                          style={{ width: `${claimed}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-3 w-full rounded-full bg-amazon-yellow py-2 text-xs font-semibold text-black transition-colors hover:bg-amazon-yellow-hover"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${deal.slug}`);
                      }}
                    >
                      {claimed > 80 ? "See deal" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
