import { z } from "zod";

const booleanQuery = z
  .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("1"), z.literal("0")])
  .optional()
  .transform((val) => {
    if (val === undefined) return undefined;
    return val === true || val === "true" || val === "1";
  });

const brandsQuery = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    const raw = Array.isArray(val) ? val : val.split(",");
    const brands = raw.map((b) => b.trim()).filter(Boolean);
    return brands.length ? brands : undefined;
  });

export const ProductFiltersSchema = z.object({
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  brands: brandsQuery,
  inStockOnly: booleanQuery,
  featuredOnly: booleanQuery,
  sortBy: z
    .enum(["price_asc", "price_desc", "rating", "newest", "featured", "bestsellers"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductFiltersInput = z.infer<typeof ProductFiltersSchema>;

export const ProductImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  altText: z.string().nullable().optional(),
  sortOrder: z.number(),
  isPrimary: z.boolean(),
});

export const ProductSpecificationSchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
  sortOrder: z.number(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  shortDescription: z.string().nullable().optional(),
  price: z.number(),
  compareAtPrice: z.number().nullable().optional(),
  stockQuantity: z.number(),
  sku: z.string(),
  brand: z.string().nullable().optional(),
  categoryId: z.string(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  averageRating: z.number(),
  totalReviews: z.number(),
  discountPercent: z.number().optional(),
  images: z.array(ProductImageSchema).optional(),
  specifications: z.array(ProductSpecificationSchema).optional(),
  reviewsCount: z.number().optional(),
});

export const ProductListResponseSchema = z.object({
  items: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const ProductSearchSchema = z.object({
  q: z.string().min(2),
  limit: z.coerce.number().int().min(1).max(20).optional(),
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
});

export const FeaturedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

export const BrandsQuerySchema = z.object({
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
});
