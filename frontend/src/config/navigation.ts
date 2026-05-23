export type NavItem = {
  label: string;
  to: string;
  description?: string;
  external?: boolean;
};

export const secondaryNavItems: NavItem[] = [
  { label: "Sell", to: "/sell", description: "Sell products on Amazon.in" },
  { label: "Today's Deals", to: "/todays-deals", description: "Limited-time deals" },
  { label: "Bestsellers", to: "/products?sort=bestsellers", description: "Top-rated bestsellers" },
  { label: "Mobiles", to: "/products?category=mobiles", description: "Smartphones & accessories" },
  { label: "Customer Service", to: "/customer-service", description: "Help & support" },
  { label: "New Releases", to: "/new-releases", description: "Latest electronics launches" },
  { label: "Electronics", to: "/electronics", description: "TVs, laptops & gadgets" },
];

export const breadcrumbRoutes = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products" },
  { path: "/products/:slug", label: "Product Details" },
  { path: "/cart", label: "Cart" },
  { path: "/checkout", label: "Checkout" },
  { path: "/order-confirmation", label: "Order Confirmation" },
  { path: "/orders", label: "Orders" },
  { path: "/returns", label: "Returns" },
  { path: "/account", label: "Your Account" },
  { path: "/signin", label: "Sign In" },
  { path: "/login", label: "Login" },
  { path: "/todays-deals", label: "Today's Deals" },
  { path: "/customer-service", label: "Customer Service" },
  { path: "/registry", label: "Registry" },
  { path: "/new-releases", label: "New Releases" },
  { path: "/electronics", label: "Electronics" },
  { path: "/sell", label: "Sell" },
  { path: "/wishlist", label: "Wishlist" },
  { path: "/signup", label: "Sign Up" },
];
