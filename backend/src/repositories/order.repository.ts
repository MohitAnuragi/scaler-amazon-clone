import { randomUUID } from "crypto";
import { db } from "../config/db";
import { ApiError } from "../utils/apiError";
import { retryTransaction } from "../utils/retry";
import { OrderStatus, PaymentMethod } from "../types/db";
import { parseJsonColumn } from "../utils/rowMappers";

export type CreateOrderItemDto = {
  productId: string;
  quantity: number;
};

export type CreateOrderDto = {
  userId: string;
  addressId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  orderNumber: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  addressSnapshot: Record<string, unknown>;
  items: CreateOrderItemDto[];
};

type OrderRow = {
  id: string;
  order_number: string;
  user_id: string;
  address_id: string;
  address_snapshot: string | Record<string, unknown>;
  status: OrderStatus;
  payment_status: string;
  payment_method: PaymentMethod;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  notes: string | null;
  cancel_reason: string | null;
  created_at: Date;
  updated_at: Date;
  address_full_name: string;
  address_phone: string;
  address_line1: string;
  address_line2: string | null;
  address_city: string;
  address_state: string;
  address_pincode: string;
  address_country: string;
  address_is_default: number;
};

const mapOrderRow = (row: OrderRow) => ({
  id: row.id,
  orderNumber: row.order_number,
  userId: row.user_id,
  addressId: row.address_id,
  addressSnapshot: parseJsonColumn<Record<string, unknown>>(row.address_snapshot),
  status: row.status,
  paymentStatus: row.payment_status,
  paymentMethod: row.payment_method,
  subtotal: row.subtotal,
  taxAmount: row.tax_amount,
  shippingAmount: row.shipping_amount,
  totalAmount: row.total_amount,
  notes: row.notes,
  cancelReason: row.cancel_reason,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  address: {
    id: row.address_id,
    fullName: row.address_full_name,
    phone: row.address_phone,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.address_city,
    state: row.address_state,
    pincode: row.address_pincode,
    country: row.address_country,
    isDefault: Boolean(row.address_is_default),
  },
});

export class OrderRepository {
  async create(data: CreateOrderDto) {
    return retryTransaction(() =>
      db.withTransaction(async (conn) => {
        const productIds = data.items.map((item) => item.productId);
        const placeholders = productIds.map(() => "?").join(",");

        const products = await db.query<any[]>(
          `SELECT p.id, p.name, p.price, p.stock_quantity, p.is_active, pi.url AS image_url
           FROM products p
           LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
           WHERE p.id IN (${placeholders})
           FOR UPDATE`,
          productIds,
          conn
        );

        const productMap = new Map(products.map((product) => [product.id, product]));

        for (const item of data.items) {
          const product = productMap.get(item.productId);
          if (!product || !product.is_active) {
            throw new ApiError(404, "Product not found");
          }

          if (product.stock_quantity < item.quantity) {
            throw new ApiError(409, `Insufficient stock for ${product.name}`);
          }

          const updated = await db.execute(
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND is_active = 1 AND stock_quantity >= ?",
            [item.quantity, item.productId, item.quantity],
            conn
          );

          if (!updated.affectedRows) {
            throw new ApiError(409, `Insufficient stock for ${product.name}`);
          }
        }

        const orderItems = data.items.map((item) => {
          const product = productMap.get(item.productId);
          if (!product) {
            throw new ApiError(404, "Product not found");
          }
          const unitPrice = Number(product.price);
          const subtotal = unitPrice * item.quantity;
          return {
            productId: product.id,
            quantity: item.quantity,
            unitPrice,
            productName: product.name,
            productImageUrl: product.image_url ?? null,
            subtotal,
          };
        });

        const orderId = randomUUID();
        await db.execute(
          "INSERT INTO orders (id, order_number, user_id, address_id, address_snapshot, payment_method, subtotal, tax_amount, shipping_amount, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            orderId,
            data.orderNumber,
            data.userId,
            data.addressId,
            JSON.stringify(data.addressSnapshot),
            data.paymentMethod,
            data.subtotal,
            data.taxAmount,
            data.shippingAmount,
            data.totalAmount,
            data.notes ?? null,
          ],
          conn
        );

        if (orderItems.length) {
          const values = orderItems.map((item) => [
            randomUUID(),
            orderId,
            item.productId,
            item.quantity,
            item.unitPrice,
            item.productName,
            item.productImageUrl,
            item.subtotal,
          ]);
          const placeholdersItems = values.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
          await db.execute(
            `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, product_name, product_image_url, subtotal) VALUES ${placeholdersItems}`,
            values.flat(),
            conn
          );
        }

        await db.execute(
          "DELETE FROM cart_items WHERE user_id = ?",
          [data.userId],
          conn
        );

        const order = await this.findById(orderId, conn);
        if (!order) {
          throw new ApiError(500, "Failed to load order after creation");
        }
        return order;
      })
    );
  }

  async findByUser(userId: string, page: number, limit: number, conn?: any) {
    const skip = (page - 1) * limit;
    const countRows = await db.query<any[]>(
      "SELECT COUNT(*) AS total FROM orders WHERE user_id = ?",
      [userId],
      conn
    );
    const total = Number(countRows[0]?.total ?? 0);

    const orderRows = await db.query<OrderRow[]>(
      `SELECT
        o.*, 
        a.full_name AS address_full_name,
        a.phone AS address_phone,
        a.address_line1,
        a.address_line2,
        a.city AS address_city,
        a.state AS address_state,
        a.pincode AS address_pincode,
        a.country AS address_country,
        a.is_default AS address_is_default
      FROM orders o
      JOIN addresses a ON a.id = o.address_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?`,
      [userId, limit, skip],
      conn
    );

    const orderIds = orderRows.map((row) => row.id);
    const items = orderIds.length
      ? await db.query<any[]>(
          `SELECT * FROM order_items WHERE order_id IN (${orderIds
            .map(() => "?")
            .join(",")})`,
          orderIds,
          conn
        )
      : [];

    const itemsByOrder = new Map<string, any[]>();
    for (const item of items) {
      const list = itemsByOrder.get(item.order_id) ?? [];
      list.push({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        productName: item.product_name,
        productImageUrl: item.product_image_url,
        subtotal: item.subtotal,
      });
      itemsByOrder.set(item.order_id, list);
    }

    const orders = orderRows.map((row) => ({
      ...mapOrderRow(row),
      orderItems: itemsByOrder.get(row.id) ?? [],
    }));

    return { total, orders };
  }

  async findById(orderId: string, conn?: any) {
    return this.findOne("o.id = ?", [orderId], conn);
  }

  async findByOrderNumber(orderNumber: string, conn?: any) {
    return this.findOne("o.order_number = ?", [orderNumber], conn);
  }

  async updateStatus(orderId: string, status: OrderStatus, userId?: string) {
    const result = await db.execute(
      userId
        ? "UPDATE orders SET status = ? WHERE id = ? AND user_id = ?"
        : "UPDATE orders SET status = ? WHERE id = ?",
      userId ? [status, orderId, userId] : [status, orderId]
    );
    if (!result.affectedRows) {
      throw new ApiError(404, "Order not found");
    }
    return this.findById(orderId);
  }

  private async findOne(clause: string, params: unknown[], conn?: any) {
    const rows = await db.query<OrderRow[]>(
      `SELECT
        o.*, 
        a.full_name AS address_full_name,
        a.phone AS address_phone,
        a.address_line1,
        a.address_line2,
        a.city AS address_city,
        a.state AS address_state,
        a.pincode AS address_pincode,
        a.country AS address_country,
        a.is_default AS address_is_default
      FROM orders o
      JOIN addresses a ON a.id = o.address_id
      WHERE ${clause}
      LIMIT 1`,
      params,
      conn
    );

    const orderRow = rows[0];
    if (!orderRow) return null;

    const items = await db.query<any[]>(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderRow.id],
      conn
    );

    return {
      ...mapOrderRow(orderRow),
      orderItems: items.map((item) => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        productName: item.product_name,
        productImageUrl: item.product_image_url,
        subtotal: item.subtotal,
      })),
    };
  }
}

export const orderRepository = new OrderRepository();
