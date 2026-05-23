import { randomUUID } from "crypto";
import { db } from "../config/db";

export class WishlistRepository {
  findByUser(userId: string) {
    return db.query<any[]>(
      `SELECT
        w.id AS wishlist_id,
        w.user_id,
        w.product_id,
        w.created_at,
        p.id AS product_id_ref,
        p.name,
        p.slug,
        p.description,
        p.short_description,
        p.price,
        p.compare_at_price,
        p.stock_quantity,
        p.sku,
        p.brand,
        p.category_id,
        p.is_active,
        p.is_featured,
        p.average_rating,
        p.total_reviews,
        p.created_at AS product_created_at,
        p.updated_at AS product_updated_at,
        c.id AS category_ref_id,
        c.name AS category_name,
        c.slug AS category_slug,
        pi.id AS image_id,
        pi.url AS image_url,
        pi.alt_text AS image_alt_text,
        pi.sort_order AS image_sort_order,
        pi.is_primary AS image_is_primary
      FROM wishlist_items w
      JOIN products p ON p.id = w.product_id
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC`,
      [userId]
    ).then((rows) =>
      rows.map((row) => ({
        id: row.wishlist_id,
        userId: row.user_id,
        productId: row.product_id,
        createdAt: row.created_at,
        product: {
          id: row.product_id_ref,
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
          createdAt: row.product_created_at,
          updatedAt: row.product_updated_at,
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
        },
      }))
    );
  }

  findItem(userId: string, productId: string) {
    return db
      .query<any[]>(
        "SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ? LIMIT 1",
        [userId, productId]
      )
      .then((rows) => rows[0] ?? null);
  }

  add(userId: string, productId: string) {
    const id = randomUUID();
    return db
      .execute(
        "INSERT INTO wishlist_items (id, user_id, product_id) VALUES (?, ?, ?)",
        [id, userId, productId]
      )
      .then(() => this.findByUser(userId))
      .then((items) => items.find((item) => item.productId === productId));
  }

  remove(userId: string, productId: string) {
    return db.execute(
      "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
  }
}

export const wishlistRepository = new WishlistRepository();
