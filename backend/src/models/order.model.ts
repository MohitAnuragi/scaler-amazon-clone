import { z } from "zod";

export const PlaceOrderSchema = z.object({
  addressId: z.string().min(1),
  paymentMethod: z.enum(["COD", "CARD", "UPI", "NET_BANKING"]),
  notes: z.string().optional(),
});

export const AddressSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});
