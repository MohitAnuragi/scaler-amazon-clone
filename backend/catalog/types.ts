export type ProductSeed = {
  name: string;
  brand: string;
  price: number;
  compareAtPrice: number;
  stock?: number;
  featured?: boolean;
  bestseller?: boolean;
  rating?: number;
  reviewCount?: number;
  imageKey: string;
  highlights: string[];
  specs: Array<[string, string]>;
  createdAt?: Date;
};

export type CategorySeed = {
  name: string;
  slug: string;
  imageKey: string;
};
