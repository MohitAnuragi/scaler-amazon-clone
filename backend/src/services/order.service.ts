import { PaymentMethod } from "../types/db";
import { addressRepository } from "../repositories/address.repository";
import { cartRepository } from "../repositories/cart.repository";
import { orderRepository } from "../repositories/order.repository";
import { userRepository } from "../repositories/user.repository";
import { logger } from "../config/logger";
import { ApiError } from "../utils/apiError";
import { enqueueOrderConfirmationEmail } from "./email/queue";

const toNumber = (value: number | string | null) =>
  value === null ? 0 : typeof value === "number" ? value : Number(value);

const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AMZ-${year}-${random}`;
};

type OrderWithRelations = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: PaymentMethod;
  subtotal: number | string;
  taxAmount: number | string;
  shippingAmount: number | string;
  totalAmount: number | string;
  createdAt: Date;
  orderItems: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number | string;
    productName: string;
    productImageUrl: string | null;
    subtotal: number | string;
  }>;
  address: {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  };
};

export const formatOrder = (order: OrderWithRelations) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  subtotal: toNumber(order.subtotal),
  taxAmount: toNumber(order.taxAmount),
  shippingAmount: toNumber(order.shippingAmount),
  totalAmount: toNumber(order.totalAmount),
  createdAt: order.createdAt.toISOString(),
  orderItems: order.orderItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: toNumber(item.unitPrice),
    productName: item.productName,
    productImageUrl: item.productImageUrl,
    subtotal: toNumber(item.subtotal),
  })),
  address: {
    id: order.address.id,
    fullName: order.address.fullName,
    phone: order.address.phone,
    addressLine1: order.address.addressLine1,
    addressLine2: order.address.addressLine2,
    city: order.address.city,
    state: order.address.state,
    pincode: order.address.pincode,
    country: order.address.country,
    isDefault: order.address.isDefault,
  },
});

export class OrderService {
  async placeOrder(
    userId: string,
    addressId: string,
    paymentMethod: PaymentMethod,
    notes?: string,
    userEmail?: string
  ) {
    const cartItems = await cartRepository.getCart(userId);
    if (cartItems.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    const address = await addressRepository.findById(userId, addressId);
    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    const subtotalValue = cartItems.reduce((sum, item) => {
      return sum + toNumber(item.product.price) * item.quantity;
    }, 0);
    const taxValue = subtotalValue * 0.18;
    const shippingValue = subtotalValue > 499 ? 0 : 49;
    const totalValue = subtotalValue + taxValue + shippingValue;

    const order = await orderRepository.create({
      userId,
      addressId,
      paymentMethod,
      notes,
      orderNumber: generateOrderNumber(),
      subtotal: subtotalValue,
      taxAmount: taxValue,
      shippingAmount: shippingValue,
      totalAmount: totalValue,
      addressSnapshot: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    const formatted = formatOrder(order);

    const user = await userRepository.findById(userId);
    const recipientEmail =  user?.email;
    const recipientName =
      user ? `${user.firstName} ${user.lastName}`.trim() : recipientEmail?.split("@")[0] ?? "Customer";

    if (recipientEmail) {
      const paymentLabels: Record<string, string> = {
        COD: "Cash on Delivery",
        CARD: "Credit / Debit Card",
        UPI: "UPI",
        NET_BANKING: "Net Banking",
      };
      const paymentStatusLabels: Record<string, string> = {
        PENDING: "Pending",
        PAID: "Paid",
        FAILED: "Failed",
        REFUNDED: "Refunded",
      };

      const estimatedDeliveryDate = new Date(order.createdAt);
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

      logger.info("Dispatching order confirmation email", {
        orderNumber: formatted.orderNumber,
        orderId: formatted.id,
        to: recipientEmail,
        source: userEmail ? "request-user" : "database",
      });

      enqueueOrderConfirmationEmail({
        to: recipientEmail,
        customerName: recipientName,
        orderNumber: formatted.orderNumber,
        orderId: formatted.id,
        totalAmount: formatted.totalAmount,
        subtotal: formatted.subtotal,
        taxAmount: formatted.taxAmount,
        shippingAmount: formatted.shippingAmount,
        paymentMethod: paymentLabels[formatted.paymentMethod] ?? formatted.paymentMethod,
        paymentStatus: paymentStatusLabels[formatted.paymentStatus] ?? formatted.paymentStatus,
        estimatedDeliveryDate: estimatedDeliveryDate.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        items: formatted.orderItems.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          productImageUrl: item.productImageUrl,
        })),
        address: formatted.address,
      });
    } else {
      logger.warn("Order placed without a user email address", {
        orderNumber: formatted.orderNumber,
        orderId: formatted.id,
        userId,
      });
    }

    return formatted;
  }

  async getOrderHistory(userId: string, page: number, limit: number) {
    const { total, orders } = await orderRepository.findByUser(userId, page, limit);
    return {
      items: orders.map(formatOrder),
      total,
      page,
      limit,
    };
  }

  async getOrderDetail(userId: string, orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      throw new ApiError(404, "Order not found");
    }
    return formatOrder(order);
  }

  async getOrderByNumber(userId: string, orderNumber: string) {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order || order.userId !== userId) {
      throw new ApiError(404, "Order not found");
    }
    return formatOrder(order);
  }
}

export const orderService = new OrderService();
