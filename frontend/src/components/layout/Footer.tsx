import { Link } from "react-router-dom";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "Get to Know Us",
    links: [
      { label: "About Us", href: "/customer-service" },
      { label: "Careers", href: "https://amazon.jobs/?initialSessionID=262-9082700-0725001&ld=AZINSOANavDesktop_T3&pageName=IN%3AAZ%3ASOACROSST3" },
      { label: "Blog", href: "/customer-service" },
    ],
  },
  {
    title: "Connect with Us",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/AmazonIN?initialSessionID=262-9082700-0725001&ld=AZINSOANavDesktop_T3&pageName=IN%3AAZ%3ASOACROSST3", external: true },
      { label: "Twitter", href: "https://x.com/AmazonIN?initialSessionID=262-9082700-0725001&ld=AZINSOANavDesktop_T3&pageName=IN%3AAZ%3ASOACROSST3", external: true },
      { label: "Instagram", href: "https://www.instagram.com/amazondotin?initialSessionID=262-9082700-0725001&ld=AZINSOANavDesktop_T3&pageName=IN%3AAZ%3ASOACROSST3", external: true },
    ],
  },
  {
    title: "Make Money with Us",
    links: [
      { label: "Sell on Amazon", href: "/sell" },
      { label: "Affiliate", href: "/sell" },
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      { label: "Shipping", href: "/customer-service" },
      { label: "Returns", href: "/returns" },
      { label: "Help Center", href: "/customer-service" },
    ],
  },
];

const legalLinks = [
  "Conditions of Use",
  "Privacy Notice",
  "Interest-Based Ads",
];

const FooterLinkItem = ({ link }: { link: FooterLink }) => {
  const className =
    "text-xs text-gray-300 hover:text-white hover:underline transition-colors";

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className}>
      {link.label}
    </Link>
  );
};

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-auto w-full">
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#37475A] py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#485769]"
      >
        Back to top
      </button>

      <div className="bg-[#232F3E] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-10 sm:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-3 text-sm font-bold text-white">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#3A4553]" />

        <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-center sm:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            amazon<span className="text-amazon-orange">.in</span>
          </Link>
          <div className="flex items-center gap-3">
            <select
              aria-label="Country"
              className="cursor-pointer rounded border border-gray-500 bg-[#232F3E] px-2 py-1 text-xs text-white focus:border-gray-300 focus:outline-none"
            >
              <option>India</option>
            </select>
            <select
              aria-label="Language"
              className="cursor-pointer rounded border border-gray-500 bg-[#232F3E] px-2 py-1 text-xs text-white focus:border-gray-300 focus:outline-none"
            >
              <option>English</option>
              <option>हिन्दी</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-amazon-blue text-white">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-2 px-6 py-4 text-center sm:flex-row sm:justify-center sm:gap-6 sm:px-8">
          <p className="text-xs text-gray-400">
            © 1996-2026, Amazon.com, Inc. or its affiliates
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {legalLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-300 transition-colors hover:text-white hover:underline"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
