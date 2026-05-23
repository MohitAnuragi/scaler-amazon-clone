import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedProducts, useCategories } from "../hooks/useProducts";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { ErrorState } from "../components/ui/ErrorState";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { ProductCard } from "../components/products/ProductCard";
import { formatPrice } from "../utils/formatters";
import { dealBanners, miniDeals, featuredPromotions, topSellerCategories } from "../config/homeData";

/* ─── Component: Deal Banner Strip ─────────────────────────────────────── */
const DealBannerStrip = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <div className="relative mx-auto max-w-[1500px] px-2 lg:px-4">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/90 shadow-lg rounded-r-md p-3 hover:bg-white transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dealBanners.map((banner) => (
          <button
            key={banner.id}
            onClick={() => navigate(banner.link)}
            className="group flex-shrink-0 w-[300px] sm:w-[320px] rounded-sm overflow-hidden text-left hover:shadow-lg transition-shadow duration-200"
            style={{ background: banner.bg }}
          >
            {/* Text header */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-lg font-bold text-gray-900 leading-tight">{banner.badge}</p>
              <p className="text-sm text-gray-700 mt-0.5">{banner.subtitle}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1 tracking-wide">{banner.brand}</p>
            </div>
            {/* Product image */}
            <div className="h-[220px] overflow-hidden">
              <ImageWithFallback
                src={banner.image}
                alt={banner.subtitle}
                productName={banner.subtitle}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                containerClassName="w-full h-full"
              />
            </div>
            {/* Footer */}
            <div className="px-4 py-2 text-xs text-amazon-link hover:underline font-medium">
              See all offers
            </div>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/90 shadow-lg rounded-l-md p-3 hover:bg-white transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

/* ─── Component: Mini Deal Grid ─────────────────────────────────────────── */
const MiniDealGrid = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -500 : 500, behavior: "smooth" });
  };

  return (
    <div className="relative mx-auto max-w-[1500px] px-2 lg:px-4">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/90 shadow-lg rounded-r-md p-3 hover:bg-white transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {miniDeals.map((deal) => (
          <button
            key={deal.id}
            onClick={() => navigate(deal.link)}
            className="group flex-shrink-0 w-[160px] sm:w-[175px] bg-white rounded-sm overflow-hidden text-left hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="h-[130px] overflow-hidden bg-gray-50">
              <ImageWithFallback
                src={deal.image}
                alt={deal.title}
                productName={deal.title}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                containerClassName="w-full h-full"
              />
            </div>
            <div className="px-2 py-2">
              <p className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">
                {deal.title}
              </p>
              {deal.tag && (
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-medium">
                  {deal.tag}
                </p>
              )}
              <p className="text-xs text-amazon-link mt-2 hover:underline">Shop now</p>
            </div>
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/90 shadow-lg rounded-l-md p-3 hover:bg-white transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

/* ─── Main HomePage ─────────────────────────────────────────────────────── */
export const HomePage = () => {
  const navigate = useNavigate();
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const displayedCategories = categories?.slice(0, 8) || [];

  return (
    <div className="min-h-screen" style={{ background: "#f3f3f3" }}>

      {/* ── Deal Banner Carousel Strip ──────────────────────────────────── */}
      <div className="bg-white py-4 shadow-sm">
        <DealBannerStrip />
      </div>

      {/* ── Mini Deal Cards Row ─────────────────────────────────────────── */}
      <div className="bg-white mt-3 py-4 shadow-sm">
        <div className="mx-auto max-w-[1500px] px-4 mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Deals and Offers</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-xs text-amazon-link hover:underline"
          >
            See all deals ›
          </button>
        </div>
        <MiniDealGrid />
      </div>

      {/* ── Shop by Category ───────────────────────────────────────────── */}
      <div className="bg-white mt-3 py-5 shadow-sm">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Shop by Category</h2>
            <button
              onClick={() => navigate("/products")}
              className="text-xs text-amazon-link hover:underline"
            >
              See all categories ›
            </button>
          </div>

          {isCategoriesLoading ? (
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="shimmer h-24 rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {displayedCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/products?category=${category.slug}`)}
                  className="group flex flex-col items-center gap-2 rounded-sm p-2 hover:bg-gray-50 transition"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <ImageWithFallback
                      src={category.imageUrl}
                      alt={category.name}
                      categorySlug={category.slug}
                      categoryName={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center leading-tight">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Deal of the Day ────────────────────────────────────────────── */}
      {!isFeaturedLoading && featuredProducts && featuredProducts.length > 0 && (
        <div className="bg-white mt-3 py-5 shadow-sm">
          <div className="mx-auto max-w-[1500px] px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">🔥 Deal of the Day</h2>
                <span className="text-xs bg-amazon-red text-white px-2 py-0.5 rounded font-semibold">
                  LIMITED TIME
                </span>
              </div>
              <button
                onClick={() => navigate("/products")}
                className="text-xs text-amazon-link hover:underline"
              >
                See all deals ›
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {featuredProducts.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer rounded-sm bg-white border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200"
                  onClick={() => navigate(`/products/${product.slug}`)}
                >
                  <div className="aspect-square overflow-hidden rounded bg-gray-50 mb-3">
                    <ImageWithFallback
                      src={product.images?.[0]?.url ?? null}
                      alt={product.name}
                      productName={product.name}
                      categorySlug={product.category?.slug}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      containerClassName="w-full h-full"
                    />
                  </div>
                  {product.discountPercent && (
                    <div className="inline-block rounded bg-amazon-red px-2 py-0.5 text-[10px] font-bold text-white mb-1">
                      {product.discountPercent}% OFF
                    </div>
                  )}
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-base font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-[11px] text-amazon-success font-medium mt-0.5">
                    Free Delivery
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Featured promotions ────────────────────────────────────────── */}
      <div className="bg-white mt-3 py-5 shadow-sm">
        <div className="mx-auto max-w-[1500px] px-4">
          <h2 className="text-base font-bold text-gray-900 mb-4">Deals &amp; offers for you</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {featuredPromotions.map((promo) => (
              <button
                key={promo.title}
                onClick={() => navigate(promo.link)}
                className="rounded-sm border border-gray-200 p-4 text-left hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900">{promo.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{promo.desc}</p>
                <span className="mt-2 inline-block text-xs text-amazon-link">{promo.cta} ›</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top sellers by category ────────────────────────────────────── */}
      <div className="bg-white mt-3 py-5 shadow-sm">
        <div className="mx-auto max-w-[1500px] px-4">
          <h2 className="text-base font-bold text-gray-900 mb-4">Top sellers by category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {topSellerCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => navigate(`/products?category=${cat.slug}&sort=bestsellers`)}
                className="flex flex-col items-center gap-2 rounded-sm p-3 hover:bg-gray-50 transition"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-gray-800 text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recommended for You ────────────────────────────────────────── */}
      <div className="bg-white mt-3 py-5 shadow-sm">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recommended for you</h2>
            <button
              onClick={() => navigate("/products")}
              className="text-xs text-amazon-link hover:underline"
            >
              See more ›
            </button>
          </div>

          {isFeaturedLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : featuredProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <ErrorState
              title="Failed to load products"
              description="We couldn't load the featured products. Please try again later."
            />
          )}
        </div>
      </div>

    </div>
  );
};
