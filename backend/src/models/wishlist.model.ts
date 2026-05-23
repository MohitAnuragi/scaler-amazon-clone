import { z } from "zod";

export const AddWishlistSchema = z.object({
  productId: z.string().min(1),
});
