export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  pagination?: Record<string, number>;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type ProductImage = {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ProductSpecification = {
  id: string;
  key: string;
  value: string;
  sortOrder: number;
};

export type ProductReview = {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  _count?: { products: number };
  products?: Product[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  sku: string;
  brand?: string | null;
  categoryId: string;
  category?: Category;
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  discountPercent?: number;
  reviewsCount?: number;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
};

export type ProductFilters = {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brands?: string[];
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "rating"
    | "newest"
    | "featured"
    | "bestsellers";
  page?: number;
  limit?: number;
};

export type CartItem = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
  lineSubtotal: number;
  isOutOfStock: boolean;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
};

export type CartSummary = {
  items: CartItem[];
  subtotal: number;
  estimatedTax: number;
  shipping: number;
  total: number;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  productImageUrl?: string | null;
  subtotal: number;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "COD" | "CARD" | "UPI" | "NET_BANKING";

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  address: Address;
};
