export const parseJsonColumn = <T>(value: string | T | null | undefined): T => {
  if (value === null || value === undefined) {
    return {} as T;
  }
  if (typeof value === "string") {
    return JSON.parse(value) as T;
  }
  return value as T;
};

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: number | boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export const mapUserRow = (row: UserRow) => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password_hash,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role,
  isActive: Boolean(row.is_active),
  lastLoginAt: row.last_login_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export type AddressRow = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: number | boolean;
  created_at: Date;
  updated_at: Date;
};

export const mapAddressRow = (row: AddressRow) => ({
  id: row.id,
  userId: row.user_id,
  fullName: row.full_name,
  phone: row.phone,
  addressLine1: row.address_line1,
  addressLine2: row.address_line2,
  city: row.city,
  state: row.state,
  pincode: row.pincode,
  country: row.country,
  isDefault: Boolean(row.is_default),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
  products_count?: number;
};

export const mapCategoryRow = (row: CategoryRow) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  imageUrl: row.image_url,
  parentId: row.parent_id,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  ...(row.products_count !== undefined
    ? { _count: { products: Number(row.products_count) } }
    : {}),
});

export const mapProductListRow = (row: Record<string, unknown>) => ({
  id: row.id as string,
  name: row.name as string,
  slug: row.slug as string,
  description: row.description as string,
  shortDescription: row.short_description as string | null,
  price: row.price as number | string,
  compareAtPrice: row.compare_at_price as number | string | null,
  stockQuantity: row.stock_quantity as number,
  sku: row.sku as string,
  brand: row.brand as string | null,
  categoryId: row.category_id as string,
  isActive: Boolean(row.is_active),
  isFeatured: Boolean(row.is_featured),
  averageRating: row.average_rating as number,
  totalReviews: row.total_reviews as number,
  createdAt: row.created_at as Date,
  updatedAt: row.updated_at as Date,
  images: row.image_url
    ? [
        {
          id: row.image_id ?? null,
          url: row.image_url as string,
          altText: row.image_alt_text as string | null,
          sortOrder: Number(row.image_sort_order ?? 0),
          isPrimary: Boolean(row.image_is_primary),
        },
      ]
    : [],
});
