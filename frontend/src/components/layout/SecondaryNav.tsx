import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, Menu, X } from "lucide-react";
import { secondaryNavItems } from "../../config/navigation";

type DrawerLink = {
  label: string;
  to: string;
};

type DrawerSection = {
  id: string;
  title: string;
  defaultOpen?: boolean;
  links: DrawerLink[];
};

const CATEGORY_LINKS: DrawerLink[] = [
  { label: "Electronics", to: "/electronics" },
  { label: "Mobiles", to: "/products?category=mobiles" },
  { label: "Fashion", to: "/products?category=fashion" },
  { label: "Beauty", to: "/products?category=beauty" },
  { label: "Books", to: "/products?category=books" },
  { label: "Sports", to: "/products?category=sports" },
  { label: "Gaming", to: "/products?category=gaming" },
  { label: "Grocery", to: "/products?category=grocery" },
  { label: "Toys & Games", to: "/products?category=toys-games" },
  { label: "Home & Kitchen", to: "/products?category=home-kitchen" },
  { label: "New Releases", to: "/new-releases" },
];

const DRAWER_SECTIONS: DrawerSection[] = [
  {
    id: "trending",
    title: "Trending",
    defaultOpen: true,
    links: [
      { label: "Today's Deals", to: "/todays-deals" },
      { label: "New Releases", to: "/new-releases" },
      { label: "Bestsellers", to: "/products?sort=bestsellers" },
      { label: "Electronics", to: "/electronics" },
    ],
  },
  {
    id: "digital",
    title: "Digital Content",
    defaultOpen: true,
    links: [
      { label: "Books", to: "/products?category=books" },
      { label: "Latest Books", to: "/products?category=books&sort=newest" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Order History", to: "/orders" },
    ],
  },
  {
    id: "categories",
    title: "Shop by Category",
    defaultOpen: true,
    links: CATEGORY_LINKS,
  },
  {
    id: "programs",
    title: "Programs & Features",
    links: [
      { label: "Registry", to: "/registry" },
      { label: "Sell on Amazon", to: "/sell" },
      { label: "Your Account", to: "/account" },
      { label: "Returns & Refunds", to: "/returns" },
    ],
  },
  {
    id: "help",
    title: "Help & Settings",
    links: [
      { label: "Customer Service", to: "/customer-service" },
      { label: "Sign In", to: "/signin" },
      { label: "Sign Up", to: "/signup" },
      { label: "Cart", to: "/cart" },
    ],
  },
];

const DrawerSectionView = ({
  section,
  open,
  onToggle,
  onNavigate,
}: {
  section: DrawerSection;
  open: boolean;
  onToggle: () => void;
  onNavigate: (to: string) => void;
}) => (
  <div className="border-b border-gray-200 pb-3">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between py-2 text-left text-sm font-semibold text-gray-900"
    >
      <span>{section.title}</span>
      <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>

    <div
      className={`grid overflow-hidden transition-all duration-200 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 space-y-1 pt-1">
        {section.links.map((link) => (
          <button
            key={link.to}
            type="button"
            onClick={() => onNavigate(link.to)}
            className="block w-full rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export const SecondaryNav = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    trending: true,
    digital: true,
    categories: true,
  });

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const navigateAndClose = (to: string) => {
    closeDrawer();
    navigate(to);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex-shrink-0 rounded px-2 py-1 whitespace-nowrap text-[13px] transition-colors ${
      isActive ? "border border-white bg-white/10 font-semibold" : "hover:border hover:border-white"
    }`;

  return (
    <div className="hidden bg-amazon-blue-light text-white lg:block">
      <div className="relative mx-auto max-w-[1500px]">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 z-10 flex h-full items-center bg-gradient-to-r from-amazon-blue-light via-amazon-blue-light to-transparent px-1"
            aria-label="Scroll categories left"
          >
            <span className="rounded bg-amazon-blue-light/90 p-1 shadow">
              <ChevronLeft className="h-4 w-4" />
            </span>
          </button>
        )}

        <div className="flex items-center gap-1 px-4 py-1.5">
          <button
            type="button"
            className="flex flex-shrink-0 items-center gap-1.5 rounded px-2 py-1 font-medium hover:border hover:border-white"
            onClick={openDrawer}
            aria-expanded={drawerOpen}
            aria-label="Open all menu"
          >
            <Menu className="h-4 w-4" /> All
          </button>

          <div
            ref={scrollRef}
            className="flex flex-1 items-center gap-0 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {secondaryNavItems.map((item) => (
              <NavLink key={item.to + item.label} to={item.to} className={navLinkClass} end={false}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 z-10 flex h-full items-center bg-gradient-to-l from-amazon-blue-light via-amazon-blue-light to-transparent px-1"
            aria-label="Scroll categories right"
          >
            <span className="rounded bg-amazon-blue-light/90 p-1 shadow">
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-black/60"
            onClick={closeDrawer}
          />

          <aside className="absolute left-0 top-0 z-[61] flex h-full w-[320px] max-w-[90vw] flex-col bg-white text-gray-900 shadow-2xl">
            <div className="flex items-center justify-between bg-amazon-blue px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                <span className="text-base font-bold">Browse Amazon</span>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded p-1 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="space-y-3">
                {DRAWER_SECTIONS.map((section) => {
                  const isOpen = openSections[section.id] ?? Boolean(section.defaultOpen);
                  return (
                    <DrawerSectionView
                      key={section.id}
                      section={section}
                      open={isOpen}
                      onToggle={() =>
                        setOpenSections((prev) => ({
                          ...prev,
                          [section.id]: !isOpen,
                        }))
                      }
                      onNavigate={navigateAndClose}
                    />
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-3">
              <button
                type="button"
                onClick={() => navigateAndClose("/customer-service")}
                className="flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm font-medium text-amazon-link hover:bg-gray-100"
              >
                <span>Customer Service</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
