import { randomUUID } from "crypto";
import { db, DbConnection } from "../config/db";
import { ApiError } from "../utils/apiError";

export class CartRepository {
  async getCart(userId: string) {
    const rows = await db.query<any[]>(
      `SELECT
        ci.id AS cart_id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
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
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
      WHERE ci.user_id = ? AND p.is_active = 1
      ORDER BY ci.created_at DESC`,
      [userId]
    );

    return rows.map((row) => ({
      id: row.cart_id,
      userId: row.user_id,
      productId: row.product_id,
      quantity: row.quantity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
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
    }));
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    conn?: DbConnection
  ) {
    const id = randomUUID();
    await db.execute(
      "INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)",
      [id, userId, productId, quantity],
      conn
    );
    return this.getCart(userId).then((items) =>
      items.find((item) => item.productId === productId) ?? null
    );
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    const result = await db.execute(
      "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
      [quantity, cartItemId, userId],
    );

    if (!result.affectedRows) {
      throw new ApiError(404, "Cart item not found");
    }

    const rows = await db.query<any[]>(
      "SELECT * FROM cart_items WHERE id = ? LIMIT 1",
      [cartItemId]
    );
    return rows[0] ?? null;
  }

  async removeItem(userId: string, cartItemId: string) {
    const result = await db.execute(
      "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
      [cartItemId, userId]
    );

    if (!result.affectedRows) {
      throw new ApiError(404, "Cart item not found");
    }

    return { removed: true };
  }

  async clearCart(userId: string) {
    return db.execute("DELETE FROM cart_items WHERE user_id = ?", [userId]);
  }

  async getItemCount(userId: string) {
    const rows = await db.query<any[]>(
      "SELECT COUNT(*) AS count FROM cart_items WHERE user_id = ?",
      [userId]
    );
    return Number(rows[0]?.count ?? 0);
  }
}

export const cartRepository = new CartRepository();
