import { Heart, Loader2 } from "lucide-react";
import type { Product } from "../../types";
import { PriceDisplay } from "../ui/PriceDisplay";
import { StarRating } from "../ui/StarRating";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { useAddToCart } from "../../hooks/useCart";
import { useToggleWishlist, useWishlistProductIds } from "../../hooks/useWishlist";
import { useNavigate } from "react-router-dom";

type ProductCardProps = {
  product: Product;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const getDeliveryDay = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return DAYS[d.getDay()];
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useAddToCart();
  const wishlistIds = useWishlistProductIds();
  const { mutate: toggleWishlist, isPending: isWishlistPending } = useToggleWishlist();
  const isInWishlist = wishlistIds.has(product.id);

  const isOutOfStock = product.stockQuantity === 0;
  const stockText =
    product.stockQuantity > 5
      ? "In Stock"
      : product.stockQuantity > 0
      ? `Only ${product.stockQuantity} left`
      : "Out of Stock";

  const showDiscount =
    product.discountPercent != null
      ? product.discountPercent > 0
      : product.compareAtPrice != null && product.compareAtPrice > product.price;

  const discountValue =
    product.discountPercent ??
    (product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0);

  const deliveryDay = getDeliveryDay();

  return (
    <div className="group relative flex flex-col border border-amazon-border bg-white transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-gray-400 rounded-sm overflow-hidden">
      {/* Discount Badge */}
      {showDiscount && discountValue > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-amazon-red text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
          -{discountValue}%
        </div>
      )}

      {/* Wishlist Heart */}
      <button
        type="button"
        disabled={isWishlistPending}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist({ productId: product.id, isInWishlist });
        }}
        className="absolute right-2 top-2 z-10 hidden rounded-full bg-white p-1.5 shadow-md group-hover:flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        />
      </button>

      {/* Product Image */}
      <div
        className="img-zoom-container cursor-pointer bg-white p-3 flex items-center justify-center"
        onClick={() => navigate(`/products/${product.slug}`)}
        style={{ height: "192px" }}
      >
        <ImageWithFallback
          src={product.images?.[0]?.url ?? null}
          alt={product.name}
          productName={product.name}
          categorySlug={product.category?.slug}
          className="max-h-48 w-full object-contain"
          containerClassName="h-full w-full flex items-center justify-center"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 px-3 pb-3 pt-1 gap-1">
        {/* Prime Badge */}
        {product.isFeatured && (
          <div className="flex items-center gap-1">
            <span className="text-[#00A8E0] font-bold text-xs italic tracking-wide border-b-2 border-[#00A8E0] leading-none">
              prime
            </span>
          </div>
        )}

        {/* Product Name */}
        <button
          onClick={() => navigate(`/products/${product.slug}`)}
          className="text-left text-sm text-amazon-link hover:text-amazon-link-hover hover:underline line-clamp-2 leading-snug mt-0.5"
        >
          {product.name}
        </button>

        {/* Star Rating */}
        <div className="mt-0.5">
          <StarRating rating={product.averageRating} count={product.totalReviews} size={14} />
        </div>

        {/* Price */}
        <div className="mt-1">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            discountPercent={product.discountPercent}
          />
        </div>

        {/* Stock */}
        <p
          className={`text-xs font-semibold ${
            isOutOfStock ? "text-amazon-red" : "text-amazon-success"
          }`}
        >
          {stockText}
        </p>

        {/* Delivery */}
        {!isOutOfStock && (
          <p className="text-xs text-gray-600">
            <span className="font-semibold">FREE Delivery</span> by {deliveryDay}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to Cart */}
        <button
          disabled={isOutOfStock || isPending}
          onClick={() => mutate({ productId: product.id, quantity: 1 })}
          className="mt-2 w-full rounded-full bg-amazon-yellow px-3 py-1.5 text-sm font-semibold text-black hover:bg-amazon-yellow-hover disabled:cursor-not-allowed disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};
