import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.string().min(1),
});

export const SlugParamSchema = z.object({
  slug: z.string().min(1),
});

export const CartItemParamSchema = z.object({
  cartItemId: z.string().min(1),
});

export const OrderIdParamSchema = z.object({
  orderId: z.string().min(1),
});

export const OrderNumberParamSchema = z.object({
  orderNumber: z.string().min(6),
});

export const AddressIdParamSchema = z.object({
  addressId: z.string().min(1),
});

export const WishlistProductParamSchema = z.object({
  productId: z.string().min(1),
});
