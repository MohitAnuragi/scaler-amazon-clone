import { db } from "../config/db";
import { CategoryRow, mapCategoryRow, mapProductListRow } from "../utils/rowMappers";

export class CategoryRepository {
  async getAll(includeCounts = false) {
    if (!includeCounts) {
      const rows = await db.query<CategoryRow[]>(
        "SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC"
      );
      return rows.map(mapCategoryRow);
    }

    const rows = await db.query<CategoryRow[]>(
      "SELECT c.*, COUNT(p.id) AS products_count " +
        "FROM categories c " +
        "LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1 " +
        "WHERE c.is_active = 1 " +
        "GROUP BY c.id " +
        "ORDER BY c.name ASC"
    );

    return rows.map(mapCategoryRow);
  }

  async getBySlug(slug: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const categories = await db.query<CategoryRow[]>(
      "SELECT * FROM categories WHERE slug = ? LIMIT 1",
      [slug]
    );
    const category = categories[0];
    if (!category) return null;

    const products = await db.query<Record<string, unknown>[]>(
      "SELECT p.*, pi.url AS image_url, pi.alt_text AS image_alt_text, pi.sort_order AS image_sort_order, pi.is_primary AS image_is_primary " +
        "FROM products p " +
        "LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1 " +
        "WHERE p.category_id = ? AND p.is_active = 1 " +
        "ORDER BY p.created_at DESC " +
        "LIMIT ? OFFSET ?",
      [category.id, limit, skip]
    );

    return {
      ...mapCategoryRow(category),
      products: products.map(mapProductListRow),
    };
  }
}

export const categoryRepository = new CategoryRepository();
