import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useProductDetail } from "../hooks/useProducts";
import { useAddToCart } from "../hooks/useCart";
import { SkeletonProductDetail } from "../components/ui/SkeletonProductDetail";
import { ErrorState } from "../components/ui/ErrorState";
import { StarRating } from "../components/ui/StarRating";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { formatPrice } from "../utils/formatters";

const RATING_COLORS: Record<number, string> = {
  5: "#4CAF50",
  4: "#8BC34A",
  3: "#FFEB3B",
  2: "#FF9800",
  1: "#F44336",
};

const formatReviewDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const buildRatingBars = (reviews: { rating: number }[], totalReviews: number) => {
  const counts = [5, 4, 3, 2, 1].map(
    (stars) => reviews.filter((r) => r.rating === stars).length
  );
  const total = reviews.length || totalReviews || 1;
  return [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    pct: Math.round((counts[i] / total) * 100) || (stars === 5 ? 60 : stars === 4 ? 25 : 5),
    color: RATING_COLORS[stars],
  }));
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getTomorrowName = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return DAYS[d.getDay()];
};

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const { data: product, isLoading, error } = useProductDetail(slug || "");
  const { mutate: addToCart, isPending } = useAddToCart();

  if (!slug) {
    return (
      <ErrorState
        title="Product not found"
        description="The product you're looking for doesn't exist."
        action={{ label: "Back to Shop", onClick: () => navigate("/products") }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1500px] px-4 py-6">
        <SkeletonProductDetail />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-[1500px] px-4 py-6">
        <ErrorState
          title="Failed to load product"
          description="We couldn't load the product details. Please try again."
          action={{ label: "Back to Shop", onClick: () => navigate("/products") }}
        />
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const images = product.images ?? [];

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity, productName: product.name });
  };

  const handleBuyNow = () => {
    addToCart(
      { productId: product.id, quantity, productName: product.name },
      { onSuccess: () => navigate("/checkout") }
    );
  };

  const goToPrevImage = () => {
    if (images.length <= 1) return;
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    if (images.length <= 1) return;
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const mainImage = images[selectedImageIndex]?.url || images[0]?.url || null;

  const showDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPct =
    product.discountPercent ??
    (showDiscount && product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0);
  const savings = showDiscount && product.compareAtPrice
    ? product.compareAtPrice - product.price
    : 0;

  const bullets = product.description
    .split(/\.\s+/)
    .filter((s) => s.trim().length > 5)
    .slice(0, 5);

  const tomorrowName = getTomorrowName();

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-4 bg-white">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-gray-600 flex-wrap">
        <button onClick={() => navigate("/")} className="hover:text-amazon-link hover:underline">
          Home
        </button>
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <button
          onClick={() => navigate(`/products?category=${product.category?.slug ?? product.categoryId}`)}
          className="hover:text-amazon-link hover:underline"
        >
          {product.category?.name || "Products"}
        </button>
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <span className="text-gray-500 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[40%_38%_22%]">
        {/* ─── Left: Image Gallery ─────────────────────── */}
        <div className="flex gap-3">
          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`h-14 w-14 overflow-hidden rounded border-2 transition-all ${
                    idx === selectedImageIndex
                      ? "border-amazon-orange shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <ImageWithFallback
                    src={img.url}
                    alt={img.altText || `View ${idx + 1}`}
                    productName={product.name}
                    categorySlug={product.category?.slug}
                    className="h-full w-full object-contain"
                    containerClassName="h-full w-full"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-1 flex flex-col gap-2">
            <div
              className="img-zoom-container relative aspect-square overflow-hidden rounded border border-amazon-border bg-white cursor-zoom-in"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevImage}
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
              <ImageWithFallback
                key={mainImage ?? product.id}
                src={mainImage}
                alt={product.name}
                productName={product.name}
                categorySlug={product.category?.slug}
                className="h-full w-full object-contain transition-transform duration-300"
                containerClassName="h-full w-full"
                style={{ transform: isImageHovered ? "scale(1.5)" : "scale(1)" }}
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Center: Product Info ─────────────────────── */}
        <div className="space-y-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-amazon-link hover:text-amazon-link-hover hover:underline cursor-pointer">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h1 className="text-xl font-medium text-gray-900 leading-snug">{product.name}</h1>

          {/* Rating + Reviews */}
          <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-gray-200">
            <StarRating rating={product.averageRating} count={product.totalReviews} size={18} />
            <span className="text-xs text-gray-500">{product.totalReviews.toLocaleString("en-IN")} ratings</span>
            {product.totalReviews > 0 && (
              <span className="text-xs text-amazon-link hover:underline cursor-pointer">
                ✓ {Math.floor(product.totalReviews * 0.78).toLocaleString("en-IN")} verified purchases
              </span>
            )}
          </div>

          {/* Price Section */}
          <div className="pb-3 border-b border-gray-200 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-600">Deal Price:</span>
              <span className="text-2xl font-bold text-[#CC0C39]">{formatPrice(product.price)}</span>
              {discountPct > 0 && (
                <span className="text-sm font-semibold text-amazon-red">({discountPct}% off)</span>
              )}
            </div>
            {showDiscount && product.compareAtPrice && (
              <p className="text-sm text-gray-500">
                M.R.P:{" "}
                <span className="line-through">{formatPrice(product.compareAtPrice)}</span>
              </p>
            )}
            {savings > 0 && (
              <p className="text-sm text-amazon-success font-medium">
                You save: {formatPrice(savings)}
              </p>
            )}
            {/* Bank Offer */}
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-gray-700">
              <span className="font-semibold text-amazon-success">Bank Offer:</span> 10% instant discount with Amazon Pay ICICI card. Min purchase ₹2,000. No max cap.
            </div>
          </div>

          {/* Delivery Info */}
          <div className="pb-3 border-b border-gray-200 space-y-1">
            <p className="text-sm">
              <span className="font-semibold text-amazon-success">FREE Delivery</span>{" "}
              <span className="text-gray-800">by</span>{" "}
              <span className="font-semibold">{tomorrowName}</span>
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <span className="text-amazon-link">📍</span>
              Deliver to India — Select address
            </p>
          </div>

          {/* About this item */}
          {bullets.length > 0 && (
            <div className="pb-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">About this item</h3>
              <ul className="space-y-1.5 list-disc list-inside text-sm text-gray-700">
                {bullets.map((bullet, i) => (
                  <li key={i} className="leading-snug">{bullet.trim()}.</li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="pb-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Technical Details</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={spec.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-1.5 px-3 font-medium text-gray-700 w-2/5">{spec.key}</td>
                      <td className="py-1.5 px-3 text-gray-800">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customer Reviews */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Customer Reviews</h3>

            {/* Rating Summary */}
            <div className="flex items-start gap-6 mb-4 p-4 bg-gray-50 rounded border border-gray-200">
              <div className="text-center flex-shrink-0">
                <div className="text-4xl font-bold text-gray-900">
                  {product.averageRating.toFixed(1)}
                </div>
                <StarRating rating={product.averageRating} size={14} />
                <div className="text-xs text-gray-500 mt-1">
                  {product.totalReviews.toLocaleString("en-IN")} ratings
                </div>
              </div>
              <div className="flex-1 space-y-1">
                {buildRatingBars(product.reviews ?? [], product.totalReviews).map(({ stars, pct, color }) => (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="text-amazon-link hover:underline cursor-pointer w-8 text-right flex-shrink-0">
                      {stars} ★
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-gray-600 w-6 flex-shrink-0">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {(product.reviews ?? []).length > 0 ? (
                product.reviews!.map((review) => {
                  const name = `${review.user.firstName} ${review.user.lastName.charAt(0)}.`;
                  return (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-7 w-7 rounded-full bg-[#232F3E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {review.user.firstName[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{name}</span>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                      {review.title && (
                        <p className="mt-1 text-sm font-semibold text-gray-900">{review.title}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        Reviewed on {formatReviewDate(review.createdAt)}
                      </p>
                      {review.isVerifiedPurchase && (
                        <span className="inline-block mt-1 text-xs text-amazon-success font-medium">
                          ✓ Verified Purchase
                        </span>
                      )}
                      {review.comment && (
                        <p className="mt-1.5 text-sm text-gray-700 leading-snug">{review.comment}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No written reviews yet for this product.</p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Right: Buy Box ──────────────────────────── */}
        <div className="space-y-3">
          <div className="sticky top-24 rounded border border-amazon-border bg-white p-4 shadow-md space-y-3">
            {/* Price */}
            <div>
              <div className="text-2xl font-bold text-black">{formatPrice(product.price)}</div>
              {showDiscount && product.compareAtPrice && (
                <div className="text-xs text-gray-500 mt-0.5">
                  M.R.P:{" "}
                  <span className="line-through">{formatPrice(product.compareAtPrice)}</span>
                  {discountPct > 0 && (
                    <span className="text-amazon-red font-semibold ml-1">({discountPct}% off)</span>
                  )}
                </div>
              )}
            </div>

            {/* Delivery */}
            <div className="text-sm border-t border-gray-100 pt-2">
              <span className="font-semibold">FREE Delivery</span>{" "}
              <span className="text-gray-600">{tomorrowName}</span>
            </div>

            {/* Stock */}
            <div
              className={`text-sm font-semibold ${
                isOutOfStock ? "text-amazon-red" : "text-amazon-success"
              }`}
            >
              {isOutOfStock ? "Currently unavailable." : "In Stock."}
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Qty:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100 focus:outline-none focus:border-amazon-orange"
                >
                  {Array.from({ length: Math.min(10, product.stockQuantity) }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isPending}
              className="w-full rounded-full bg-amazon-yellow py-2 font-semibold text-sm text-black hover:bg-amazon-yellow-hover disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Buy Now */}
            <button
              disabled={isOutOfStock || isPending}
              onClick={handleBuyNow}
              className="w-full rounded-full border border-[#FFA41C] bg-[#FFB347] py-2 font-semibold text-sm text-black hover:bg-[#FFA41C] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Buy Now
            </button>

            {/* Secure Transaction */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2">
              <ShieldCheck className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span>Secure transaction</span>
            </div>

            {/* Seller Info */}
            <div className="space-y-1 text-xs text-gray-700 border-t border-gray-100 pt-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Ships from</span>
                <span className="font-medium text-amazon-link">Amazon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sold by</span>
                <span className="font-medium text-amazon-link">Amazon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Returns</span>
                <span className="font-medium text-amazon-link">30 days returnable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
