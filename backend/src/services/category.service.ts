import { categoryRepository } from "../repositories/category.repository";
import { ApiError } from "../utils/apiError";

export class CategoryService {
  async getCategories(includeCounts = false) {
    return categoryRepository.getAll(includeCounts);
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.getBySlug(slug, 1, 20);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  }
}

export const categoryService = new CategoryService();
