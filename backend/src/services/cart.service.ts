import { db } from "../config/db";
import { cartRepository } from "../repositories/cart.repository";
import { productRepository } from "../repositories/product.repository";
import { ApiError } from "../utils/apiError";

const toNumber = (value: number | string | null) =>
  value === null ? 0 : typeof value === "number" ? value : Number(value);

type CartItemWithProduct = Awaited<ReturnType<typeof cartRepository.getCart>>[number];

const enrichCartItem = (item: CartItemWithProduct) => {
  const price = toNumber(item.product.price);
  const compareAt = item.product.compareAtPrice
    ? toNumber(item.product.compareAtPrice)
    : null;
  const lineSubtotal = price * item.quantity;
  const isOutOfStock = item.product.stockQuantity < item.quantity;

  return {
    ...item,
    product: {
      ...item.product,
      price,
      compareAtPrice: compareAt,
    },
    lineSubtotal,
    isOutOfStock,
  };
};

export class CartService {
  async getCart(userId: string) {
    const items = await cartRepository.getCart(userId);
    const enriched = items.map(enrichCartItem);
    const subtotal = enriched.reduce((sum, item) => sum + item.lineSubtotal, 0);
    return { items: enriched, subtotal };
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    try {
      return await db.withTransaction(async (conn) => {
        const users = await db.query<Array<{ id: string }>>(
          "SELECT id FROM users WHERE id = ? LIMIT 1",
          [userId],
          conn
        );
        if (!users[0]) {
          throw new ApiError(401, "Please sign in to add items to cart.");
        }

        const product = await productRepository.findById(productId, conn);
        if (!product || !product.isActive) {
          throw new ApiError(404, "Product not found");
        }

        const stockRows = await db.query<Array<{ stock_quantity: number }>>(
          "SELECT stock_quantity FROM products WHERE id = ? FOR UPDATE",
          [productId],
          conn
        );
        const stockQuantity = Number(stockRows[0]?.stock_quantity ?? 0);

        const existingRows = await db.query<Array<{ quantity: number }>>(
          "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1",
          [userId, productId],
          conn
        );
        const existingQty = Number(existingRows[0]?.quantity ?? 0);
        const nextQuantity = existingQty + quantity;

        if (stockQuantity < nextQuantity) {
          throw new ApiError(409, "Requested quantity exceeds stock");
        }

        return cartRepository.addItem(userId, productId, quantity, conn);
      });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        throw new ApiError(401, "Please sign in to add items to cart.");
      }
      throw error;
    }
  }

  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    const cartItems = await cartRepository.getCart(userId);
    const target = cartItems.find((item) => item.id === cartItemId);
    if (!target) {
      throw new ApiError(404, "Cart item not found");
    }
    if (target.product.stockQuantity < quantity) {
      throw new ApiError(409, "Requested quantity exceeds stock");
    }
    return cartRepository.updateQuantity(userId, cartItemId, quantity);
  }

  async removeFromCart(userId: string, cartItemId: string) {
    return cartRepository.removeItem(userId, cartItemId);
  }

  async computeCartSummary(userId: string) {
    const { items, subtotal } = await this.getCart(userId);
    const estimatedTax = subtotal * 0.18;
    const shipping = subtotal > 499 ? 0 : 49;
    const total = subtotal + estimatedTax + shipping;
    return {
      items,
      subtotal,
      estimatedTax,
      shipping,
      total,
    };
  }

  async getItemCount(userId: string) {
    return cartRepository.getItemCount(userId);
  }

  async clearCart(userId: string) {
    await cartRepository.clearCart(userId);
  }
}

export const cartService = new CartService();
