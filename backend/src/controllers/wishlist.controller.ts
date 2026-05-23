import { Request, Response } from "express";
import { wishlistService } from "../services/wishlist.service";
import { ApiResponse } from "../utils/apiResponse";

export const getWishlist = async (req: Request, res: Response) => {
  const items = await wishlistService.getWishlist(req.user!.id);
  res.json(new ApiResponse(items, "Wishlist fetched"));
};

export const addToWishlist = async (req: Request, res: Response) => {
  const item = await wishlistService.addToWishlist(req.user!.id, req.body.productId);
  res.status(201).json(new ApiResponse(item, "Added to wishlist"));
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const productId = Array.isArray(req.params.productId)
    ? req.params.productId[0]
    : req.params.productId;
  const result = await wishlistService.removeFromWishlist(
    req.user!.id,
    productId
  );
  res.json(new ApiResponse(result, "Removed from wishlist"));
};
