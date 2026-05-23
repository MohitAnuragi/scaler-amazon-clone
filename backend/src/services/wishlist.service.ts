import { wishlistRepository } from "../repositories/wishlist.repository";
import { productRepository } from "../repositories/product.repository";
import { ApiError } from "../utils/apiError";

const toNumber = (value: number | string | null) =>
  value === null ? 0 : typeof value === "number" ? value : Number(value);

const formatProduct = (product: {
  price: number | string;
  compareAtPrice: number | string | null;
  [key: string]: unknown;
}) => {
  const price = toNumber(product.price);
  const compareAt = product.compareAtPrice ? toNumber(product.compareAtPrice) : null;
  const discountPercent =
    compareAt && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0;
  return { ...product, price, compareAtPrice: compareAt, discountPercent };
};

export class WishlistService {
  async getWishlist(userId: string) {
    const items = await wishlistRepository.findByUser(userId);
    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt.toISOString(),
      product: formatProduct(item.product),
    }));
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) {
      throw new ApiError(404, "Product not found");
    }

    const existing = await wishlistRepository.findItem(userId, productId);
    if (existing) {
      throw new ApiError(409, "Product already in wishlist");
    }

    const item = await wishlistRepository.add(userId, productId);
    if (!item) {
      throw new ApiError(500, "Failed to add item to wishlist");
    }
    return {
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt.toISOString(),
      product: formatProduct(item.product),
    };
  }

  async removeFromWishlist(userId: string, productId: string) {
    const existing = await wishlistRepository.findItem(userId, productId);
    if (!existing) {
      throw new ApiError(404, "Item not in wishlist");
    }
    await wishlistRepository.remove(userId, productId);
    return { removed: true };
  }
}

export const wishlistService = new WishlistService();
