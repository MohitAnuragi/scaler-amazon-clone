import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import type {
  ApiResponse,
  Address,
  Cart,
  Category,
  Order,
  PaginatedResponse,
  Product,
  ProductFilters,
} from "../types";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30s
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { addToast } = useUIStore.getState();
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem("authToken");
        useAuthStore.getState().signOut();
        addToast({
          type: "error",
          message: "Your session has expired. Please sign in again.",
        });
      } else if (status === 429) {
        addToast({
          type: "warning",
          message: "You are doing that too often. Please slow down.",
        });
      } else if (status >= 500) {
        addToast({
          type: "error",
          message: "Something went wrong on our end. Please retry.",
        });
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  getProducts: (filters: ProductFilters) =>
    api.get<ApiResponse<PaginatedResponse<Product>>>("/products", {
      params: {
        ...filters,
        brands: filters.brands?.length ? filters.brands.join(",") : undefined,
      },
    }),
  getProductBrands: (params?: { categoryId?: string; categorySlug?: string }) =>
    api.get<ApiResponse<string[]>>("/products/brands", { params }),
  getFeaturedProducts: (limit = 8) =>
    api.get<ApiResponse<Product[]>>("/products/featured", { params: { limit } }),
  getProductBySlug: (slug: string) =>
    api.get<ApiResponse<Product>>(`/products/slug/${slug}`),
  searchProducts: (
    query: string,
    limit = 5,
    params?: { categoryId?: string; categorySlug?: string }
  ) =>
    api.get<ApiResponse<Product[]>>("/products/search", {
      params: { q: query, limit, ...params },
    }),
  getCategories: (withCounts = false) =>
    api.get<ApiResponse<Category[]>>("/categories", {
      params: { withCounts },
    }),
  getCategoryBySlug: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`),
  getCart: () => api.get<ApiResponse<Cart>>("/cart"),
  getCartCount: () => api.get<ApiResponse<{ count: number }>>("/cart/count"),
  addToCart: (productId: string, quantity: number) =>
    api.post<ApiResponse<Cart>>("/cart", { productId, quantity }),
  updateCartItem: (cartItemId: string, quantity: number) =>
    api.patch<ApiResponse<Cart>>(`/cart/${cartItemId}`, { quantity }),
  removeCartItem: (cartItemId: string) =>
    api.delete<ApiResponse<{ removed: boolean }>>(`/cart/${cartItemId}`),
  placeOrder: (payload: {
    addressId: string;
    paymentMethod: string;
    notes?: string;
  }) => api.post<ApiResponse<Order>>("/orders", payload),
  getOrders: (page = 1, limit = 10) =>
    api.get<ApiResponse<PaginatedResponse<Order>>>("/orders", {
      params: { page, limit },
    }),
  getOrderById: (orderId: string) =>
    api.get<ApiResponse<Order>>(`/orders/${orderId}`),
  getOrderByNumber: (orderNumber: string) =>
    api.get<ApiResponse<Order>>(`/orders/number/${orderNumber}`),
  getAddresses: () => api.get<ApiResponse<Address[]>>("/addresses"),
  addAddress: (payload: Partial<Address>) =>
    api.post<ApiResponse<Address>>("/addresses", payload),
  updateAddress: (addressId: string, payload: Partial<Address>) =>
    api.patch<ApiResponse<Address>>(`/addresses/${addressId}`, payload),
  deleteAddress: (addressId: string) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/addresses/${addressId}`),
  setDefaultAddress: (addressId: string) =>
    api.patch<ApiResponse<Address>>(`/addresses/${addressId}/default`),
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: { id: string; email: string; name: string }; token: string }>>(
      "/auth/login",
      {
        email,
        password,
      }
    ),
  getMe: () => api.get<ApiResponse<{ id: string; email: string; name: string }>>("/auth/me"),
  signup: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) =>
    api.post<
      ApiResponse<{ user: { id: string; email: string; name: string }; token: string }>
    >("/auth/signup", payload),
  getWishlist: () => api.get<ApiResponse<Array<{ id: string; productId: string; product: Product }>>>("/wishlist"),
  addToWishlist: (productId: string) =>
    api.post<ApiResponse<{ id: string; productId: string; product: Product }>>("/wishlist", {
      productId,
    }),
  removeFromWishlist: (productId: string) =>
    api.delete<ApiResponse<{ removed: boolean }>>(`/wishlist/${productId}`),
};

export default api;
