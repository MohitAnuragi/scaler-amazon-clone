import { Request, Response } from "express";
import { cartService } from "../services/cart.service";
import { ApiResponse } from "../utils/apiResponse";
import { ensureString } from "../utils/helpers";

export const getCart = async (req: Request, res: Response) => {
  const result = await cartService.getCart(req.user!.id);
  res.json(new ApiResponse(result, "Cart fetched"));
};

export const addToCart = async (req: Request, res: Response) => {
  const item = await cartService.addToCart(
    req.user!.id,
    req.body.productId,
    req.body.quantity
  );
  res.status(201).json(new ApiResponse(item, "Item added to cart"));
};

export const updateCartItem = async (req: Request, res: Response) => {
  const item = await cartService.updateCartItem(
    req.user!.id,
    ensureString(req.params.cartItemId)!,
    req.body.quantity
  );
  res.json(new ApiResponse(item, "Cart item updated"));
};

export const removeCartItem = async (req: Request, res: Response) => {
  await cartService.removeFromCart(
    req.user!.id,
    ensureString(req.params.cartItemId)!
  );
  res.json(new ApiResponse({ removed: true }, "Cart item removed"));
};

export const getCartCount = async (req: Request, res: Response) => {
  const count = await cartService.getItemCount(req.user!.id);
  res.json(new ApiResponse({ count }, "Cart item count fetched"));
};
