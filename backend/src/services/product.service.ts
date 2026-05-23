import { ApiError } from "../utils/apiError";
import { productRepository, ProductFilters } from "../repositories/product.repository";

const toNumber = (value: number | string | null) =>
  value === null ? 0 : typeof value === "number" ? value : Number(value);

const formatProduct = <
  T extends {
    price: number | string;
    compareAtPrice: number | string | null;
    _count?: { reviews: number };
    reviewsCount?: number;
  }
>(
  product: T
) => {
  const price = toNumber(product.price);
  const compareAt = product.compareAtPrice ? toNumber(product.compareAtPrice) : null;
  const discountPercent =
    compareAt && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0;

  return {
    ...product,
    price,
    compareAtPrice: compareAt,
    discountPercent,
    reviewsCount: product._count?.reviews ?? product.reviewsCount,
  };
};

export class ProductService {
  async getProducts(filters: ProductFilters) {
    const { total, items } = await productRepository.findAll(filters);
    return {
      items: items.map(formatProduct),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  async getProductDetail(idOrSlug: string) {
    const bySlug = await productRepository.findBySlug(idOrSlug);
    const product = bySlug ?? (await productRepository.findById(idOrSlug));
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    const formatted = formatProduct(product) as ReturnType<typeof formatProduct> & {
      reviews?: Array<{
        id: string;
        rating: number;
        title: string | null;
        comment: string | null;
        isVerifiedPurchase: boolean;
        createdAt: Date;
        user: { firstName: string; lastName: string };
      }>;
    };

    const withReviews = product as typeof product & {
      reviews?: Array<{
        id: string;
        rating: number;
        title: string | null;
        comment: string | null;
        isVerifiedPurchase: boolean;
        createdAt: Date;
        user: { firstName: string; lastName: string };
      }>;
    };

    if (withReviews.reviews?.length) {
      formatted.reviews = withReviews.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerifiedPurchase: r.isVerifiedPurchase,
        createdAt: r.createdAt,
        user: r.user,
      }));
    }

    return formatted;
  }

  async getFeatured(limit: number) {
    const products = await productRepository.findFeatured(limit);
    return products.map(formatProduct);
  }

  async search(query: string, limit: number, categoryId?: string, categorySlug?: string) {
    const products = await productRepository.search(query, limit, categoryId, categorySlug);
    return products.map(formatProduct);
  }

  async getBrands(categoryId?: string, categorySlug?: string) {
    return productRepository.findDistinctBrands(categoryId, categorySlug);
  }

  async checkStock(productId: string, requestedQty: number) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) {
      throw new ApiError(404, "Product not found");
    }
    if (product.stockQuantity < requestedQty) {
      throw new ApiError(409, "Insufficient stock");
    }
    return product;
  }
}

export const productService = new ProductService();
