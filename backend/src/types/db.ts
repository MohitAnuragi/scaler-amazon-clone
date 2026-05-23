export const userRoles = ["CUSTOMER", "ADMIN"] as const;
export type UserRole = (typeof userRoles)[number];

export const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentMethods = ["COD", "CARD", "UPI", "NET_BANKING"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];
