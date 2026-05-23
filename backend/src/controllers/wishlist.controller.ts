import { Request, Response } from "express";
import { wishlistService } from "../services/wishlist.service";
import { ApiResponse } from "../utils/apiResponse";
import { ensureString } from "../utils/helpers";

export const getWishlist = async (req: Request, res: Response) => {
  const items = await wishlistService.getWishlist(req.user!.id);
  res.json(new ApiResponse(items, "Wishlist fetched"));
};

export const addToWishlist = async (req: Request, res: Response) => {
  const item = await wishlistService.addToWishlist(req.user!.id, req.body.productId);
  res.status(201).json(new ApiResponse(item, "Added to wishlist"));
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const result = await wishlistService.removeFromWishlist(
    req.user!.id,
    ensureString(req.params.productId)!
  );
  res.json(new ApiResponse(result, "Removed from wishlist"));
};
