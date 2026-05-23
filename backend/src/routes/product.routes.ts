import { Router } from "express";
import {
  getFeaturedProducts,
  getProductBrands,
  getProductById,
  getProductBySlug,
  getProducts,
  searchProducts,
} from "../controllers/product.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { IdParamSchema, SlugParamSchema } from "../models/common.model";
import {
  BrandsQuerySchema,
  FeaturedQuerySchema,
  ProductFiltersSchema,
  ProductSearchSchema,
} from "../models/product.model";

const router = Router();

router.get("/", validate(ProductFiltersSchema, "query"), asyncHandler(getProducts));
router.get(
  "/brands",
  validate(BrandsQuerySchema, "query"),
  asyncHandler(getProductBrands)
);
router.get(
  "/featured",
  validate(FeaturedQuerySchema, "query"),
  asyncHandler(getFeaturedProducts)
);
router.get(
  "/search",
  validate(ProductSearchSchema, "query"),
  asyncHandler(searchProducts)
);
router.get("/slug/:slug", validate(SlugParamSchema, "params"), asyncHandler(getProductBySlug));
router.get("/:id", validate(IdParamSchema, "params"), asyncHandler(getProductById));

export default router;
