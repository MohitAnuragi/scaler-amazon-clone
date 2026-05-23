const UNSPLASH = "https://images.unsplash.com";

const BOOK_TITLES: Array<[RegExp, string]> = [
  [/atomic habits/i, "Atomic Habits"],
  [/clean code/i, "Clean Code"],
  [/psychology of money/i, "The Psychology of Money"],
  [/sapiens/i, "Sapiens"],
  [/wings of fire/i, "Wings of Fire"],
  [/\balchemist\b/i, "The Alchemist"],
  [/zero to one/i, "Zero to One"],
  [/deep work/i, "Deep Work"],
  [/rich dad poor dad/i, "Rich Dad Poor Dad"],
];

export function bookCoverUrl(title: string) {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg?default=false`;
}

// Prefer local stable assets when available to avoid external failures
const LOCAL_CATEGORY_ASSETS: Record<string, string> = {
  electronics: '/assets/images/electronics.jpg',
  mobiles: '/assets/images/mobiles.jpg',
  fashion: '/assets/images/fashion.jpg',
  'home-kitchen': '/assets/images/home-kitchen.jpg',
  grocery: '/assets/images/grocery.jpg',
  'toys-games': '/assets/images/toys-games.jpg',
  gaming: '/assets/images/gamingHeadset.jpg',
  // beauty and sports may fallback to nearby local assets if exact local not available
  beauty: '/assets/images/fashion.jpg',
  sports: '/assets/images/mobiles.jpg',
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  electronics: LOCAL_CATEGORY_ASSETS.electronics ?? `${UNSPLASH}/photo-1505740420928-5e560c06d30e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  mobiles: LOCAL_CATEGORY_ASSETS.mobiles ?? `${UNSPLASH}/photo-1511707171634-5f897ff02aa9?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  fashion: LOCAL_CATEGORY_ASSETS.fashion ?? `${UNSPLASH}/photo-1542291026-7eec264c27ff?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  "home-kitchen": LOCAL_CATEGORY_ASSETS['home-kitchen'] ?? `${UNSPLASH}/photo-1556910103-1c02745aae4d?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  books: bookCoverUrl("Atomic Habits"),
  beauty: LOCAL_CATEGORY_ASSETS.beauty ?? `${UNSPLASH}/photo-1586495777717-68ca4c5307b2?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  sports: LOCAL_CATEGORY_ASSETS.sports ?? `${UNSPLASH}/photo-1517836357463-296b0e0e0b0e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  gaming: LOCAL_CATEGORY_ASSETS.gaming ?? `${UNSPLASH}/photo-1606813907291-76f903037a6e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  grocery: LOCAL_CATEGORY_ASSETS.grocery ?? `${UNSPLASH}/photo-1542838132-92c53300491e?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
  "toys-games": LOCAL_CATEGORY_ASSETS['toys-games'] ?? `${UNSPLASH}/photo-1513519245088-0e12902e5a38?w=640&h=400&fit=crop&bg=f8f8f8&auto=format&q=80`,
};

const KEYWORD_FALLBACKS: Array<{ test: RegExp; category: string }> = [
  {
    test: /(iphone|galaxy|oneplus|redmi|vivo|oppo|iqoo|pixel|mobile|smartphone|charger|accessory)/i,
    category: "mobiles",
  },
  {
    test: /(headphone|earbud|speaker|tv|laptop|monitor|camera|soundbar|watch|tablet)/i,
    category: "electronics",
  },
  {
    test: /(crib|stroller|baby monitor|cookware|bedsheet|air purifier|kitchen|furniture|home)/i,
    category: "home-kitchen",
  },
  {
    test: /(lipstick|foundation|serum|cream|face wash|shampoo|kajal|mascara|perfume|makeup|haircare|cosmetics|skincare)/i,
    category: "beauty",
  },
  {
    test: /(shoe|shirt|jean|kurta|handbag|t-shirt|dress|apparel|fashion)/i,
    category: "fashion",
  },
  {
    test: /(racket|cricket|football|training|gym|yoga|dumbbell|fitness|sports|shuttlecock|bat|exercise)/i,
    category: "sports",
  },
  {
    test: /(console|playstation|ps5|xbox|gamepad|gaming|keyboard|mouse|headset|chair|laptop|controller)/i,
    category: "gaming",
  },
  {
    test: /(book|novel|author|reading|paperback|hardcover)/i,
    category: "books",
  },
];

const normalizeCategorySlug = (value?: string | null) =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") ?? "";

const resolveBookTitle = (value: string) => {
  for (const [pattern, title] of BOOK_TITLES) {
    if (pattern.test(value)) return title;
  }
  return null;
};

export const getFallbackImageSrc = ({
  categorySlug,
  categoryName,
  productName,
  altText,
}: {
  categorySlug?: string | null;
  categoryName?: string | null;
  productName?: string | null;
  altText?: string | null;
}) => {
  const label = [productName, altText, categoryName].filter(Boolean).join(" ");
  const bookTitle = resolveBookTitle(label);
  if (bookTitle) return bookCoverUrl(bookTitle);

  const matched = KEYWORD_FALLBACKS.find(({ test }) => test.test(label));
  if (matched) return CATEGORY_FALLBACKS[matched.category];

  const normalized = normalizeCategorySlug(categorySlug) || normalizeCategorySlug(categoryName);
  return CATEGORY_FALLBACKS[normalized] ?? CATEGORY_FALLBACKS.electronics;
};
