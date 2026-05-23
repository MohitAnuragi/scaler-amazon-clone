export const categoryDescriptions: Record<string, string> = {
  Electronics:
    "Laptops, audio, TVs, cameras, and smart accessories from trusted global brands — ideal for work, entertainment, and everyday tech.",
  Mobiles:
    "Latest smartphones and mobile accessories with verified specs, Indian warranty, and fast delivery across pin codes.",
  Fashion:
    "Apparel, footwear, watches, and bags from leading lifestyle brands — styled for Indian seasons and occasions.",
  "Home & Kitchen":
    "Cookware, appliances, and home essentials from Prestige, Milton, Philips, and more for modern Indian kitchens.",
  Books:
    "Bestselling programming, business, fiction, and self-help titles with genuine publisher editions.",
  Beauty:
    "Skincare, makeup, haircare, and fragrances curated for Indian skin types and climates.",
  Sports:
    "Cricket, fitness, badminton, and outdoor gear from Cosco, Yonex, Nivia, Nike, and Adidas.",
  "Toys & Games":
    "Educational toys, board games, and licensed playsets for children of all ages.",
  Grocery:
    "Daily essentials, staples, and pantry favourites with shelf-life details and hygienic packaging.",
  Gaming:
    "Consoles, PC gaming peripherals, and accessories from PlayStation, Xbox, Logitech, Razer, and Asus ROG.",
};

export const reviewPools: Record<
  string,
  { titles: string[]; comments: string[] }
> = {
  electronics: {
    titles: ["Crystal-clear sound", "Great for WFH", "Solid build quality", "Worth the EMI", "Fast delivery"],
    comments: [
      "Pairing was instant and battery life matches the listing. Perfect for daily commute.",
      "Display is sharp for Netflix and office work. Runs cool under load.",
      "Packaging was secure. Product matches Amazon listing photos exactly.",
      "Bass is punchy without distortion. Mic quality is good for calls.",
      "Registered warranty online without issues. Happy with this purchase.",
    ],
  },
  mobiles: {
    titles: ["Smooth performance", "Camera exceeds expectations", "Battery lasts all day", "Value flagship", "Genuine unit"],
    comments: [
      "120Hz display feels buttery. No heating during gaming sessions.",
      "Night mode photos are impressive. 5G speeds are stable in Mumbai.",
      "Charged once overnight, lasted two full days with moderate use.",
      "In-box charger works as advertised. Fingerprint unlock is fast.",
      "IMEI verified. Sealed box with all accessories. Highly recommended.",
    ],
  },
  fashion: {
    titles: ["True to size", "Comfortable fabric", "Great fit", "Stylish everyday wear", "Good stitching"],
    comments: [
      "Fabric feels premium and breathable for Indian summers.",
      "Colour matches the website. Washed twice — no shrinkage.",
      "Sole grip is excellent for morning runs. Lightweight feel.",
      "Kurta embroidery quality is neat. Perfect for festive wear.",
      "Leather finish on the bag looks elegant. Zippers are sturdy.",
    ],
  },
  "home-kitchen": {
    titles: ["Kitchen essential", "Easy to clean", "Sturdy appliance", "Family approved", "Good heat distribution"],
    comments: [
      "Non-stick coating still intact after a month of daily use.",
      "Mixer jars are thick glass. Grinding masala is effortless.",
      "Air fryer cut our oil usage significantly. Crispy results every time.",
      "Flask keeps chai hot for morning commute. No leaks so far.",
      "Pressure cooker whistles consistently. Prestige quality as expected.",
    ],
  },
  books: {
    titles: ["Must-read", "Engaging from page one", "Gift-worthy", "Practical insights", "Well printed"],
    comments: [
      "Paper quality is good. Font size is comfortable for long reading sessions.",
      "Examples are relevant to Indian startups and careers.",
      "Finished in a week — hard to put down. Already recommended to friends.",
      "Arrived without bends or marks. Authentic publisher edition.",
      "Chapter summaries help revision. Great for interview prep.",
    ],
  },
  beauty: {
    titles: ["Gentle on skin", "Visible glow", "Long-lasting wear", "Pleasant fragrance", "No irritation"],
    comments: [
      "Serum absorbed quickly without stickiness. Skin feels brighter in two weeks.",
      "Shade matches online swatch. Stays matte through humid afternoons.",
      "Neem face wash reduced breakouts. Mild fragrance.",
      "SPF layers well under makeup. No white cast on medium tone skin.",
      "Shampoo reduced hair fall noticeably. Scalp feels fresh.",
    ],
  },
  sports: {
    titles: ["Durable gear", "Great for practice", "Good grip", "Sturdy build", "Value sports kit"],
    comments: [
      "Racket balance is good for beginners. Shuttlecock speed is consistent.",
      "Bat has solid pickup. Handle grip comfortable for tennis ball cricket.",
      "Football retains shape after heavy use on turf.",
      "Yoga mat is non-slip even without AC in summer.",
      "Dumbbells rubber coating protects floor tiles.",
    ],
  },
  "toys-games": {
    titles: ["Kids loved it", "Fun family game", "Sturdy pieces", "Creative play", "Safe materials"],
    comments: [
      "Bricks click firmly. Instructions are easy for 6-year-olds.",
      "Die-cast cars are detailed. Good return gift pack.",
      "Board game keeps adults engaged too. Rules are simple.",
      "Play-Doh colours are vibrant. Non-toxic label reassures parents.",
      "Monopoly evening became a weekend tradition. Tokens are solid.",
    ],
  },
  grocery: {
    titles: ["Fresh pack", "Good value pack", "Pantry staple", "Authentic taste", "Well sealed"],
    comments: [
      "Atta makes soft rotis. No lumps after kneading.",
      "Maggi stock for hostel — expiry date was recent.",
      "Oil bottle cap sealed properly. No leakage in transit.",
      "Coffee aroma is rich. Dissolves quickly in hot milk.",
      "Biscuits arrived intact. Classic Parle-G taste.",
    ],
  },
  gaming: {
    titles: ["Low latency", "RGB looks great", "Console runs quiet", "Comfortable for long sessions", "PC gaming upgrade"],
    comments: [
      "DualSense haptics feel immersive. SSD loads Spider-Man in seconds.",
      "Mouse sensor tracks flawlessly on cloth pad. Battery lasts weeks.",
      "Headset mic is clear for Discord. Ear cushions are soft.",
      "Keyboard actuation is crisp. Software customization is easy.",
      "ROG laptop thermals stay under control with performance mode.",
    ],
  },
};

export function buildProductDescription(
  name: string,
  brand: string,
  categoryName: string,
  highlights: string[]
): string {
  const intro = categoryDescriptions[categoryName] ?? "";
  const bullets = highlights.map((h) => `• ${h}`).join("\n");
  return `${name} from ${brand}. ${intro}\n\nKey highlights:\n${bullets}\n\nShips with manufacturer warranty in India where applicable.`;
}

export function getReviewPool(categorySlug: string) {
  return reviewPools[categorySlug] ?? reviewPools.electronics;
}
