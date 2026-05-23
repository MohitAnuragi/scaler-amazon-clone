import { ChevronDown, MapPin, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { secondaryNavItems } from "../../config/navigation";
import { SecondaryNav } from "./SecondaryNav";
import { useSearchProducts } from "../../hooks/useProducts";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { ImageWithFallback } from "../ui/ImageWithFallback";

const SEARCH_CATEGORIES = [
  "All",
  "Mobiles",
  "Electronics",
  "Fashion",
  "Beauty",
  "Books",
  "Sports",
  "Gaming",
  "Grocery",
  "Home & Kitchen",
  "Toys & Games",
  "New Releases",
] as const;

const SEARCH_CATEGORY_SLUGS: Record<string, string> = {
  Mobiles: "mobiles",
  Electronics: "electronics",
  Fashion: "fashion",
  Beauty: "beauty",
  Books: "books",
  Sports: "sports",
  Gaming: "gaming",
  Grocery: "grocery",
  "Home & Kitchen": "home-kitchen",
  "Toys & Games": "toys-games",
};

const SLUG_TO_CATEGORY: Record<string, string> = {
  mobiles: "Mobiles",
  electronics: "Electronics",
  fashion: "Fashion",
  beauty: "Beauty",
  books: "Books",
  sports: "Sports",
  gaming: "Gaming",
  grocery: "Grocery",
  "home-kitchen": "Home & Kitchen",
  "toys-games": "Toys & Games",
};

const resolveCategorySelection = (value: string | null) => (value === "All" ? null : value);

const resolveSearchCategorySlug = (category: string | null) => {
  if (!category) return undefined;
  if (category === "New Releases") return undefined;
  return SEARCH_CATEGORY_SLUGS[category];
};

const buildSearchParams = (query: string, selectedCategory: string | null) => {
  const params = new URLSearchParams();
  const trimmed = query.trim();
  const category = resolveCategorySelection(selectedCategory);

  if (trimmed) {
    params.set("search", trimmed);
  }

  if (category === "New Releases") {
    params.set("sort", "newest");
  } else if (category && SEARCH_CATEGORY_SLUGS[category]) {
    params.set("category", SEARCH_CATEGORY_SLUGS[category]);
  }

  return params;
};

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCartStore();
  const { searchQuery, setSearch, setCategory, selectedCategory } = useUIStore();
  const { status, user, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(itemCount);
  const [badgeAnimating, setBadgeAnimating] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";
  const accountLabel = isAuthenticated ? user?.name?.split(" ")[0] ?? "Your Account" : "Sign in";
  const accountLink = isAuthenticated ? "/account" : "/signin";

  // Live search
  const { data: searchResults = [] } = useSearchProducts(localSearch, {
    categorySlug: resolveSearchCategorySlug(selectedCategory),
  });

  // Cart badge animation on count change
  useEffect(() => {
    if (itemCount !== prevItemCount) {
      setBadgeAnimating(true);
      setPrevItemCount(itemCount);
      const t = setTimeout(() => setBadgeAnimating(false), 400);
      return () => clearTimeout(t);
    }
  }, [itemCount, prevItemCount]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountHovered(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sort = params.get("sort");
    const category = params.get("category");
    if (sort === "newest" && !category) {
      if (selectedCategory !== "New Releases") setCategory("New Releases");
      return;
    }
    if (category) {
      const nextCategory = SLUG_TO_CATEGORY[category] ?? null;
      if (nextCategory && selectedCategory !== nextCategory) {
        setCategory(nextCategory);
      }
    }
  }, [location.pathname, location.search, selectedCategory, setCategory]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const onSearch = () => {
    const params = buildSearchParams(localSearch, selectedCategory);
    if (!params.toString()) return;

    setSearch(localSearch.trim());
    setShowSearchDropdown(false);
    if (selectedCategory !== "All") {
      setCategory(selectedCategory);
    }
    navigate(`/products?${params.toString()}`);
  };

  const handleSearchInputChange = (val: string) => {
    setLocalSearch(val);
    setShowSearchDropdown(val.length >= 2);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
    if (e.key === "Escape") setShowSearchDropdown(false);
  };

  const handleResultClick = (slug: string) => {
    setShowSearchDropdown(false);
    navigate(`/products/${slug}`);
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* ─── Primary Nav ─────────────────────────────── */}
      <div className="bg-amazon-blue text-white">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-2 lg:py-3">

          {/* Hamburger + Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="rounded p-1 hover:border hover:border-white lg:hidden"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="text-[22px] font-bold tracking-tight leading-none" onClick={closeMobileMenu}>
              amazon<span className="text-amazon-orange">.in</span>
            </Link>
          </div>

          {/* Delivery Location (desktop) */}
          <div className="hidden items-center gap-1.5 rounded px-2 py-1.5 hover:border hover:border-white lg:flex flex-shrink-0 cursor-pointer">
            <MapPin className="h-4 w-4 text-gray-300 mt-0.5" />
            <div className="text-left text-xs leading-tight">
              <p className="text-gray-300">Deliver to</p>
              <p className="font-bold text-white">India 🇮🇳</p>
            </div>
          </div>

          {/* Search Bar (desktop) */}
          <div className="hidden flex-1 lg:flex" ref={searchRef}>
            <div className="relative flex w-full overflow-hidden rounded">
              {/* Category dropdown */}
              <select
                value={selectedCategory ?? "All"}
                onChange={(e) => setCategory(resolveCategorySelection(e.target.value))}
                className="bg-[#f3f3f3] text-gray-800 text-xs px-2 py-2 border-r border-gray-400 cursor-pointer outline-none hover:bg-[#e3e3e3] flex-shrink-0 max-w-[110px]"
              >
                {SEARCH_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Text Input */}
              <input
                value={localSearch}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => localSearch.length >= 2 && setShowSearchDropdown(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search Amazon.in"
                className="flex-1 px-3 py-2 text-sm text-black outline-none"
                autoComplete="off"
              />

              {/* Search button */}
              <button
                onClick={onSearch}
                className="flex items-center justify-center bg-amazon-orange px-4 text-black hover:bg-[#e88b00] transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Live Search Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-xl border border-gray-200 z-50 rounded-b max-h-80 overflow-y-auto dropdown-shadow">
                  {searchResults.slice(0, 8).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.slug)}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 border-b border-gray-100 last:border-0"
                    >
                      <ImageWithFallback
                        src={product.images?.[0]?.url ?? null}
                        alt={product.name}
                        productName={product.name}
                        categorySlug={product.category?.slug}
                        className="h-8 w-8 object-contain flex-shrink-0"
                        containerClassName="h-8 w-8 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{product.name}</p>
                        {product.category?.name && (
                          <p className="text-xs text-gray-500">in {product.category.name}</p>
                        )}
                      </div>
                      <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Account, Orders, Cart */}
          <div className="ml-auto flex items-center gap-1 flex-shrink-0">
            {/* Account & Lists */}
            <div
              ref={accountRef}
              className="relative hidden lg:block"
              onMouseEnter={() => setIsAccountHovered(true)}
              onMouseLeave={() => setIsAccountHovered(false)}
            >
              <button className="rounded px-2 py-1.5 text-left hover:border hover:border-white">
                <span className="block text-xs text-gray-200">Hello, {accountLabel}</span>
                <span className="flex items-center gap-0.5 text-sm font-bold">
                  Account &amp; Lists <ChevronDown className="h-3 w-3" />
                </span>
              </button>

              {/* Account Dropdown */}
              {isAccountHovered && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-white text-gray-800 shadow-xl border border-gray-200 rounded z-50 dropdown-shadow">
                  <div className="p-4 border-b border-gray-200">
                    {!isAuthenticated ? (
                      <>
                        <Link
                          to="/signin"
                          className="block w-full text-center bg-amazon-yellow hover:bg-amazon-yellow-hover text-black font-semibold py-1.5 px-4 rounded mb-2 text-sm"
                        >
                          Sign in
                        </Link>
                        <p className="text-xs text-center text-gray-600">
                          New customer?{" "}
                          <Link to="/signup" className="text-amazon-link hover:text-amazon-link-hover hover:underline">
                            Start here.
                          </Link>
                        </p>
                      </>
                    ) : (
                      <button
                        onClick={() => { signOut(); setIsAccountHovered(false); }}
                        className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-black font-semibold py-1.5 px-4 rounded mb-2 text-sm"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-x-4 text-sm">
                    <div>
                      <p className="font-bold text-gray-900 mb-2">Your Account</p>
                      <Link to={isAuthenticated ? "/account" : "/signin"} className="block py-1 hover:text-amazon-link hover:underline text-xs">Your Account</Link>
                      <Link to="/orders" className="block py-1 hover:text-amazon-link hover:underline text-xs">Your Orders</Link>
                      <Link to="/wishlist" className="block py-1 hover:text-amazon-link hover:underline text-xs">Wishlist</Link>
                      <Link to="/sell" className="block py-1 hover:text-amazon-link hover:underline text-xs">Sell on Amazon</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <NavLink
              to="/orders"
              className="hidden rounded px-2 py-1.5 text-left hover:border hover:border-white lg:block"
            >
              <span className="block text-xs text-gray-200">Returns</span>
              <span className="text-sm font-bold">&amp; Orders</span>
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative flex items-end gap-0.5 rounded px-2 py-1.5 hover:border hover:border-white"
            >
              <div className="relative">
                <ShoppingCart className="h-7 w-7" />
                <span
                  className={`absolute -top-1.5 left-3 flex h-5 w-5 items-center justify-center rounded-full bg-amazon-orange text-xs font-bold text-black ${badgeAnimating ? "badge-pop" : ""}`}
                >
                  {itemCount}
                </span>
              </div>
              <span className="text-sm font-bold hidden sm:block">Cart</span>
            </NavLink>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-3 pb-2 lg:hidden" ref={searchRef}>
          <div className="relative flex w-full overflow-hidden rounded">
            <input
              value={localSearch}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onFocus={() => localSearch.length >= 2 && setShowSearchDropdown(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search Amazon.in"
              className="flex-1 px-3 py-2 text-sm text-black outline-none"
              autoComplete="off"
            />
            <button
              onClick={onSearch}
              className="flex items-center justify-center bg-amazon-orange px-4 text-black"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-xl border border-gray-200 z-50 rounded-b max-h-64 overflow-y-auto dropdown-shadow">
                {searchResults.slice(0, 6).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.slug)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{product.name}</p>
                      {product.category?.name && (
                        <p className="text-xs text-gray-500">in {product.category.name}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SecondaryNav />

      {/* ─── Mobile Drawer Overlay ─────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* ─── Mobile Drawer ─────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white text-gray-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-amazon-blue text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs text-gray-300">Hello,</p>
            <p className="font-bold">{accountLabel}</p>
          </div>
          <button onClick={closeMobileMenu} className="p-1 rounded hover:bg-amazon-blue-light">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="overflow-y-auto flex-1">
          {/* Account */}
          <div className="border-b border-gray-200 py-3 px-4">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Account</p>
            <Link to={accountLink} className="block py-1.5 text-sm text-amazon-link hover:underline" onClick={closeMobileMenu}>
              {isAuthenticated ? "Your Account" : "Sign in to your Account"}
            </Link>
            <Link to="/orders" className="block py-1.5 text-sm hover:text-amazon-link" onClick={closeMobileMenu}>
              Returns &amp; Orders
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => { signOut(); closeMobileMenu(); }}
                className="block py-1.5 text-sm text-red-600 hover:underline w-full text-left"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Trending */}
          <div className="border-b border-gray-200 py-3 px-4">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Browse</p>
            <div className="space-y-0.5">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block py-1.5 text-sm hover:text-amazon-link"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="py-3 px-4">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Shop</p>
            <Link to="/products" className="block py-1.5 text-sm hover:text-amazon-link" onClick={closeMobileMenu}>All Products</Link>
            <Link to="/cart" className="block py-1.5 text-sm hover:text-amazon-link" onClick={closeMobileMenu}>Cart</Link>
          </div>
        </div>
      </div>

    </header>
  );
};
