import { randomUUID } from "crypto";
import { db, DbConnection } from "../config/db";

export type ProductFilters = {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brands?: string[];
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "featured" | "bestsellers";
  page: number;
  limit: number;
};

export type CreateProductDto = {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  sku: string;
  brand?: string | null;
  categoryId: string;
  isActive?: boolean;
  isFeatured?: boolean;
  averageRating?: number;
  totalReviews?: number;
  createdAt?: Date;
  images?: Array<{
    url: string;
    altText?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  }>;
  specifications?: Array<{
    key: string;
    value: string;
    sortOrder?: number;
  }>;
};

const buildFilters = (filters: ProductFilters) => {
  const where: string[] = ["p.is_active = 1"];
  const params: unknown[] = [];
  const joins: string[] = [];

  if (filters.categorySlug) {
    joins.push("JOIN categories c ON c.id = p.category_id");
    where.push("c.slug = ? AND c.is_active = 1");
    params.push(filters.categorySlug);
  } else if (filters.categoryId) {
    where.push("p.category_id = ?");
    params.push(filters.categoryId);
  }

  if (filters.search) {
    const q = `%${filters.search}%`;
    where.push("(p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ? OR p.brand LIKE ?)");
    params.push(q, q, q, q);
  }

  if (filters.minPrice !== undefined) {
    where.push("p.price >= ?");
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    where.push("p.price <= ?");
    params.push(filters.maxPrice);
  }

  if (filters.inStockOnly) {
    where.push("p.stock_quantity > 0");
  }

  if (filters.featuredOnly) {
    where.push("p.is_featured = 1");
  }

  if (filters.minRating !== undefined) {
    where.push("p.average_rating >= ?");
    params.push(filters.minRating);
  }

  if (filters.brands && filters.brands.length) {
    const placeholders = filters.brands.map(() => "?").join(",");
    where.push(`LOWER(p.brand) IN (${placeholders})`);
    params.push(...filters.brands.map((b) => b.toLowerCase()));
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params,
    joins: joins.join(" "),
  };
};

const buildOrderBy = (sortBy?: ProductFilters["sortBy"]) => {
  switch (sortBy) {
    case "price_asc":
      return "ORDER BY p.price ASC";
    case "price_desc":
      return "ORDER BY p.price DESC";
    case "rating":
    case "bestsellers":
      return "ORDER BY p.average_rating DESC, p.total_reviews DESC";
    case "featured":
      return "ORDER BY p.is_featured DESC, p.created_at DESC";
    case "newest":
      return "ORDER BY p.created_at DESC";
    default:
      return "ORDER BY p.created_at DESC";
  }
};

const mapProductRow = (row: any) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  shortDescription: row.short_description,
  price: row.price,
  compareAtPrice: row.compare_at_price,
  stockQuantity: row.stock_quantity,
  sku: row.sku,
  brand: row.brand,
  categoryId: row.category_id,
  isActive: Boolean(row.is_active),
  isFeatured: Boolean(row.is_featured),
  averageRating: row.average_rating,
  totalReviews: row.total_reviews,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class ProductRepository {
  async findAll(filters: ProductFilters) {
    const { whereSql, params, joins } = buildFilters(filters);
    const orderBy = buildOrderBy(filters.sortBy);
    const skip = (filters.page - 1) * filters.limit;

    const countRows = await db.query<any[]>(
      `SELECT COUNT(*) AS total FROM products p ${joins} ${whereSql}`,
      params
    );
    const total = Number(countRows[0]?.total ?? 0);

    const items = await db.query<any[]>(
      `SELECT
        p.id, p.name, p.slug, p.description, p.short_description, p.price, p.compare_at_price,
        p.stock_quantity, p.sku, p.brand, p.category_id, p.is_active, p.is_featured,
        p.average_rating, p.total_reviews, p.created_at, p.updated_at,
        c.id AS category_ref_id, c.name AS category_name, c.slug AS category_slug,
        pi.id AS image_id, pi.url AS image_url, pi.alt_text AS image_alt_text,
        pi.sort_order AS image_sort_order, pi.is_primary AS image_is_primary
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
      ${whereSql}
      ${orderBy}
      LIMIT ? OFFSET ?`,
      [...params, filters.limit, skip]
    );

    return {
      total,
      items: items.map((row) => ({
        ...mapProductRow(row),
        images: row.image_url
          ? [
              {
                id: row.image_id,
                url: row.image_url,
                altText: row.image_alt_text,
                sortOrder: row.image_sort_order ?? 0,
                isPrimary: Boolean(row.image_is_primary),
              },
            ]
          : [],
        category: {
          id: row.category_ref_id,
          name: row.category_name,
          slug: row.category_slug,
        },
      })),
    };
  }

  async findDistinctBrands(categoryId?: string, categorySlug?: string) {
    const where: string[] = ["p.is_active = 1", "p.brand IS NOT NULL"];
    const params: unknown[] = [];
    const joins: string[] = [];

    if (categorySlug) {
      joins.push("JOIN categories c ON c.id = p.category_id");
      where.push("c.slug = ? AND c.is_active = 1");
      params.push(categorySlug);
    } else if (categoryId) {
      where.push("p.category_id = ?");
      params.push(categoryId);
    }

    const rows = await db.query<any[]>(
      `SELECT DISTINCT p.brand FROM products p ${joins.join(" ")} WHERE ${where.join(" AND ")} ORDER BY p.brand ASC`,
      params
    );

    return rows.map((row) => row.brand).filter((brand) => Boolean(brand));
  }

  async findById(id: string, conn?: DbConnection) {
    return this.findBy("p.id = ?", [id], false, conn);
  }

  async findBySlug(slug: string, conn?: DbConnection) {
    return this.findBy("p.slug = ?", [slug], true, conn);
  }

  private async findBy(
    clause: string,
    params: unknown[],
    includeReviews: boolean,
    conn?: DbConnection
  ) {
    const rows = await db.query<any[]>(
      `SELECT
        p.id, p.name, p.slug, p.description, p.short_description, p.price, p.compare_at_price,
        p.stock_quantity, p.sku, p.brand, p.category_id, p.is_active, p.is_featured,
        p.average_rating, p.total_reviews, p.created_at, p.updated_at,
        c.id AS category_ref_id, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE ${clause}
      LIMIT 1`,
      params,
      conn
    );

    const productRow = rows[0];
    if (!productRow) return null;

    const productId = productRow.id;
    const images = await db.query<any[]>(
      "SELECT id, url, alt_text, sort_order, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order ASC",
      [productId],
      conn
    );
    const specifications = await db.query<any[]>(
      "SELECT id, spec_key, spec_value, sort_order FROM product_specifications WHERE product_id = ? ORDER BY sort_order ASC",
      [productId],
      conn
    );
    const reviewCountRows = await db.query<any[]>(
      "SELECT COUNT(*) AS reviews_count FROM reviews WHERE product_id = ?",
      [productId],
      conn
    );

    const reviews = includeReviews
      ? await db.query<any[]>(
          "SELECT r.id, r.rating, r.title, r.comment, r.is_verified_purchase, r.created_at, u.first_name, u.last_name " +
            "FROM reviews r " +
            "JOIN users u ON u.id = r.user_id " +
            "WHERE r.product_id = ? " +
            "ORDER BY r.created_at DESC " +
            "LIMIT 8",
          [productId],
          conn
        )
      : [];

    return {
      ...mapProductRow(productRow),
      images: images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.alt_text,
        sortOrder: img.sort_order,
        isPrimary: Boolean(img.is_primary),
      })),
      specifications: specifications.map((spec) => ({
        id: spec.id,
        key: spec.spec_key,
        value: spec.spec_value,
        sortOrder: spec.sort_order,
      })),
      _count: { reviews: Number(reviewCountRows[0]?.reviews_count ?? 0) },
      category: {
        id: productRow.category_ref_id,
        name: productRow.category_name,
        slug: productRow.category_slug,
      },
      ...(includeReviews
        ? {
            reviews: reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              title: r.title,
              comment: r.comment,
              isVerifiedPurchase: Boolean(r.is_verified_purchase),
              createdAt: r.created_at,
              user: { firstName: r.first_name, lastName: r.last_name },
            })),
          }
        : {}),
    };
  }

  async findFeatured(limit: number) {
    const safeLimit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 8)));
    const rows = await db.query<any[]>(
      `SELECT
        p.id, p.name, p.slug, p.description, p.short_description, p.price, p.compare_at_price,
        p.stock_quantity, p.sku, p.brand, p.category_id, p.is_active, p.is_featured,
        p.average_rating, p.total_reviews, p.created_at, p.updated_at,
        c.id AS category_ref_id, c.name AS category_name, c.slug AS category_slug,
        pi.id AS image_id, pi.url AS image_url, pi.alt_text AS image_alt_text,
        pi.sort_order AS image_sort_order, pi.is_primary AS image_is_primary
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
      WHERE p.is_featured = 1 AND p.is_active = 1
      ORDER BY p.created_at DESC
      LIMIT ?`,
      [safeLimit]
    );

    return rows.map((row) => ({
      ...mapProductRow(row),
      images: row.image_url
        ? [
            {
              id: row.image_id,
              url: row.image_url,
              altText: row.image_alt_text,
              sortOrder: row.image_sort_order ?? 0,
              isPrimary: Boolean(row.image_is_primary),
            },
          ]
        : [],
      category: {
        id: row.category_ref_id,
        name: row.category_name,
        slug: row.category_slug,
      },
    }));
  }

  async create(data: CreateProductDto, conn?: DbConnection) {
    const id = randomUUID();
    const createdAt = data.createdAt ?? new Date();
    const baseParams = [
      id,
      data.name,
      data.slug,
      data.description,
      data.shortDescription ?? null,
      data.price,
      data.compareAtPrice ?? null,
      data.stockQuantity,
      data.sku,
      data.brand ?? null,
      data.categoryId,
      data.isActive ?? true,
      data.isFeatured ?? false,
      data.averageRating ?? 0,
      data.totalReviews ?? 0,
      createdAt,
      createdAt,
    ];

    await db.execute(
      "INSERT INTO products (id, name, slug, description, short_description, price, compare_at_price, stock_quantity, sku, brand, category_id, is_active, is_featured, average_rating, total_reviews, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      baseParams,
      conn
    );

    if (data.images?.length) {
      const imageValues = data.images.map((img, idx) => [
        randomUUID(),
        id,
        img.url,
        img.altText ?? null,
        img.sortOrder ?? idx,
        img.isPrimary ? 1 : 0,
      ]);
      const placeholders = imageValues.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
      await db.execute(
        `INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary) VALUES ${placeholders}`,
        imageValues.flat(),
        conn
      );
    }

    if (data.specifications?.length) {
      const specValues = data.specifications.map((spec, idx) => [
        randomUUID(),
        id,
        spec.key,
        spec.value,
        spec.sortOrder ?? idx,
      ]);
      const placeholders = specValues.map(() => "(?, ?, ?, ?, ?)").join(", ");
      await db.execute(
        `INSERT INTO product_specifications (id, product_id, spec_key, spec_value, sort_order) VALUES ${placeholders}`,
        specValues.flat(),
        conn
      );
    }

    return this.findById(id, conn);
  }

  async updateStock(
    productId: string,
    quantity: number,
    operation: "INCREMENT" | "DECREMENT",
    conn?: DbConnection
  ) {
    const sql =
      operation === "INCREMENT"
        ? "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?"
        : "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?";
    await db.execute(sql, [quantity, productId], conn);
    return this.findById(productId, conn);
  }

  async search(query: string, limit: number, categoryId?: string, categorySlug?: string) {
    const where: string[] = ["p.is_active = 1"];
    const params: unknown[] = [];

    if (categorySlug) {
      where.push("c.slug = ? AND c.is_active = 1");
      params.push(categorySlug);
    } else if (categoryId) {
      where.push("p.category_id = ?");
      params.push(categoryId);
    }

    const q = `%${query}%`;
    where.push("(p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)");
    params.push(q, q, q);

    const rows = await db.query<any[]>(
      `SELECT
        p.id, p.name, p.slug, p.description, p.short_description, p.price, p.compare_at_price,
        p.stock_quantity, p.sku, p.brand, p.category_id, p.is_active, p.is_featured,
        p.average_rating, p.total_reviews, p.created_at, p.updated_at,
        c.id AS category_ref_id, c.name AS category_name, c.slug AS category_slug,
        pi.id AS image_id, pi.url AS image_url, pi.alt_text AS image_alt_text,
        pi.sort_order AS image_sort_order, pi.is_primary AS image_is_primary
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
      WHERE ${where.join(" AND ")}
      ORDER BY p.average_rating DESC, p.total_reviews DESC
      LIMIT ?`,
      [...params, limit]
    );

    return rows.map((row) => ({
      ...mapProductRow(row),
      images: row.image_url
        ? [
            {
              id: row.image_id,
              url: row.image_url,
              altText: row.image_alt_text,
              sortOrder: row.image_sort_order ?? 0,
              isPrimary: Boolean(row.image_is_primary),
            },
          ]
        : [],
      category: {
        id: row.category_ref_id,
        name: row.category_name,
        slug: row.category_slug,
      },
    }));
  }
}

export const productRepository = new ProductRepository();
