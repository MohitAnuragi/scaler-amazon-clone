import { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import { ApiResponse } from "../utils/apiResponse";
import { ensureString } from "../utils/helpers";

export const getCategories = async (req: Request, res: Response) => {
  const withCounts = req.query.withCounts === "true";
  const categories = await categoryService.getCategories(withCounts);
  res.json(new ApiResponse(categories, "Categories fetched"));
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryBySlug(
    ensureString(req.params.slug)!
  );
  res.json(new ApiResponse(category, "Category fetched"));
};
