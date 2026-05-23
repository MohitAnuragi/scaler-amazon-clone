import { bookCoverUrl } from "../utils/imageFallbacks";

/** Category-matched hero imagery (Unsplash, light product-style backgrounds). */
const IMG = {
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  fashion: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  beauty: "https://images.unsplash.com/photo-1586495777717-68ca4c5307b2?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  homeKitchen: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  books: bookCoverUrl("Atomic Habits"),
  gaming: "https://images.unsplash.com/photo-1606813907291-76f903037a6e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
  sports: "https://images.unsplash.com/photo-1517836357463-296b0e0e0b0e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80",
};

export type DealBanner = {
  id: number;
  badge: string;
  subtitle: string;
  brand: string;
  image: string;
  bg: string;
  link: string;
};

export type MiniDeal = {
  id: number;
  title: string;
  image: string;
  link: string;
  tag: string | null;
};

export const dealBanners: DealBanner[] = [
  {
    id: 1,
    badge: "New Releases",
    subtitle: "Latest electronics launches",
    brand: "APPLE · SONY · ASUS",
    image: IMG.electronics,
    bg: "#1a1a1a",
    link: "/new-releases",
  },
  {
    id: 2,
    badge: "Up to 40% off",
    subtitle: "Nike & Adidas footwear",
    brand: "NIKE · ADIDAS",
    image: IMG.fashion,
    bg: "#f5f0e8",
    link: "/products?category=fashion",
  },
  {
    id: 3,
    badge: "Starting ₹149",
    subtitle: "Mamaearth & Lakme beauty",
    brand: "Mamaearth · Lakme",
    image: IMG.beauty,
    bg: "#ede8f5",
    link: "/products?category=beauty",
  },
  {
    id: 4,
    badge: "From ₹22,999",
    subtitle: "Samsung & OnePlus phones",
    brand: "SAMSUNG · ONEPLUS",
    image: IMG.mobiles,
    bg: "#e8f4ff",
    link: "/products?category=mobiles",
  },
  {
    id: 5,
    badge: "Starting ₹599",
    subtitle: "Prestige & Milton kitchen",
    brand: "Prestige | Milton",
    image: IMG.homeKitchen,
    bg: "#fff8e8",
    link: "/products?category=home-kitchen",
  },
  {
    id: 6,
    badge: "Electronics",
    subtitle: "TVs, laptops & gadgets",
    brand: "LG · SAMSUNG · DELL",
    image: IMG.tv,
    bg: "#232f3e",
    link: "/electronics",
  },
];

export const miniDeals: MiniDeal[] = [
  {
    id: 1,
    title: "Deals on home & kitchen",
    image: IMG.homeKitchen,
    link: "/products?category=home-kitchen",
    tag: "Up to 60% off",
  },
  {
    id: 2,
    title: "Grocery essentials",
    image: IMG.grocery,
    link: "/products?category=grocery",
    tag: "Maggi · Tata · Amul",
  },
  {
    id: 3,
    title: "Latest electronics",
    image: IMG.electronics,
    link: "/electronics",
    tag: "Apple · Sony · ASUS",
  },
  {
    id: 4,
    title: "Up to 40% off smartphones",
    image: IMG.mobiles,
    link: "/products?category=mobiles",
    tag: "Samsung · Apple · Xiaomi",
  },
  {
    id: 5,
    title: "Smart TVs from ₹32,999",
    image: IMG.tv,
    link: "/products?category=electronics&sort=price_asc",
    tag: "LG · Samsung",
  },
  {
    id: 6,
    title: "Gaming gear deals",
    image: IMG.gaming,
    link: "/products?category=gaming",
    tag: "PS5 · Logitech · Razer",
  },
  {
    id: 7,
    title: "Sports & fitness",
    image: IMG.sports,
    link: "/products?category=sports",
    tag: "Yonex · Nike · Cosco",
  },
  {
    id: 8,
    title: "Bestsellers in Books",
    image: IMG.books,
    link: "/products?category=books&sort=bestsellers",
    tag: "Programming · Fiction",
  },
];

export const featuredPromotions = [
  {
    title: "Latest Electronics",
    desc: "New laptops, tablets, audio and smart gadgets",
    cta: "Explore",
    link: "/electronics",
  },
  {
    title: "New Releases",
    desc: "Freshly launched products across the store",
    cta: "See new arrivals",
    link: "/new-releases",
  },
  {
    title: "Bestsellers",
    desc: "Top-rated products loved by customers",
    cta: "Explore",
    link: "/products?sort=bestsellers",
  },
];

export const topSellerCategories = [
  { name: "Mobiles", slug: "mobiles", emoji: "📱" },
  { name: "Electronics", slug: "electronics", emoji: "🎧" },
  { name: "Fashion", slug: "fashion", emoji: "👕" },
  { name: "Beauty", slug: "beauty", emoji: "💄" },
  { name: "Home & Kitchen", slug: "home-kitchen", emoji: "🍳" },
  { name: "Grocery", slug: "grocery", emoji: "🛒" },
  { name: "Books", slug: "books", emoji: "📚" },
  { name: "Gaming", slug: "gaming", emoji: "🎮" },
  { name: "Sports", slug: "sports", emoji: "🏏" },
];
