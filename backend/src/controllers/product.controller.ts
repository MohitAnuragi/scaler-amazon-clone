import { Request, Response } from "express";
import { BrandsQuerySchema, ProductFiltersSchema, ProductSearchSchema } from "../models/product.model";
import { productService } from "../services/product.service";
import { ApiResponse } from "../utils/apiResponse";
import { ensureString } from "../utils/helpers";

export const getProducts = async (req: Request, res: Response) => {
  const filters = ProductFiltersSchema.parse(req.query);
  const result = await productService.getProducts(filters);
  res.json(new ApiResponse(result, "Products fetched"));
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await productService.getProductDetail(
    ensureString(req.params.id)!
  );
  res.json(new ApiResponse(product, "Product fetched"));
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const product = await productService.getProductDetail(
    ensureString(req.params.slug)!
  );
  res.json(new ApiResponse(product, "Product fetched"));
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 8;
  const products = await productService.getFeatured(limit);
  res.json(new ApiResponse(products, "Featured products fetched"));
};

export const searchProducts = async (req: Request, res: Response) => {
  const { q, limit, categoryId, categorySlug } = ProductSearchSchema.parse(req.query);
  const products = await productService.search(q, limit ?? 8, categoryId, categorySlug);
  res.json(new ApiResponse(products, "Search results fetched"));
};

export const getProductBrands = async (req: Request, res: Response) => {
  const { categoryId, categorySlug } = BrandsQuerySchema.parse(req.query);
  const brands = await productService.getBrands(categoryId, categorySlug);
  res.json(new ApiResponse(brands, "Brands fetched"));
};
