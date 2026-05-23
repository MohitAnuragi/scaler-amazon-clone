import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10),
});
