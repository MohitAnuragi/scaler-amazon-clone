import { Router } from "express";
import {
  getCategories,
  getCategoryBySlug,
} from "../controllers/category.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { SlugParamSchema } from "../models/common.model";

const router = Router();

router.get("/", asyncHandler(getCategories));
router.get("/:slug", validate(SlugParamSchema, "params"), asyncHandler(getCategoryBySlug));

export default router;
