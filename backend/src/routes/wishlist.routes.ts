import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { AddWishlistSchema } from "../models/wishlist.model";
import { WishlistProductParamSchema } from "../models/common.model";

const router = Router();

router.get("/", asyncHandler(getWishlist));
router.post("/", validate(AddWishlistSchema), asyncHandler(addToWishlist));
router.delete(
  "/:productId",
  validate(WishlistProductParamSchema, "params"),
  asyncHandler(removeFromWishlist)
);

export default router;
