import { Link } from "react-router-dom";
import { ProductCard } from "../components/products/ProductCard";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { useWishlistQuery } from "../hooks/useWishlist";

export const WishlistPage = () => {
  const { data: items = [], isLoading } = useWishlistQuery();

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6">
      <h1 className="text-2xl font-normal text-gray-900">Your Wishlist</h1>
      <p className="mt-1 text-sm text-gray-600">
        {items.length} item{items.length === 1 ? "" : "s"} saved for later
      </p>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded bg-white p-12 text-center shadow-sm">
          <p className="text-lg text-gray-700">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-full bg-amazon-yellow px-6 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
          >
            Continue shopping
          </Link>
        </div>
      )}
    </div>
  );
};
