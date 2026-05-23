import { Router } from "express";
import {
  addToCart,
  getCart,
  getCartCount,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { AddToCartSchema, UpdateCartItemSchema } from "../models/cart.model";
import { CartItemParamSchema } from "../models/common.model";

const router = Router();

router.get("/", asyncHandler(getCart));
router.get("/count", asyncHandler(getCartCount));
router.post("/", validate(AddToCartSchema), asyncHandler(addToCart));
router.patch(
  "/:cartItemId",
  validate(CartItemParamSchema, "params"),
  validate(UpdateCartItemSchema),
  asyncHandler(updateCartItem)
);
router.delete(
  "/:cartItemId",
  validate(CartItemParamSchema, "params"),
  asyncHandler(removeCartItem)
);

export default router;
