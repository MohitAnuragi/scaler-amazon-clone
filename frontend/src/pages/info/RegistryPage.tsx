import { useEffect } from "react";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";

const registryTypes = [
  {
    icon: "👶",
    title: "Baby Registry",
    subtitle: "For New Parents",
    desc: "Create the perfect list for your little one. From nursery essentials to feeding gear — everything you need.",
    color: "from-sky-400 to-cyan-500",
    items: ["Cribs & Bedding", "Strollers", "Baby Monitors", "Feeding Essentials", "Diaper Bags"],
  },
  {
    icon: "💍",
    title: "Wedding Registry",
    subtitle: "For Couples",
    desc: "Start your new life together with the gifts you actually want. Share with friends and family worldwide.",
    color: "from-rose-400 to-pink-500",
    items: ["Cookware Sets", "Bedding & Linens", "Appliances", "Home Décor", "Luggage"],
  },
  {
    icon: "🎂",
    title: "Birthday Wishlist",
    subtitle: "For Everyone",
    desc: "Tell your friends and family exactly what you want. Easy to share, easy to gift.",
    color: "from-violet-400 to-purple-500",
    items: ["Gadgets", "Books", "Fashion", "Gaming", "Sports & Fitness"],
  },
];

const benefits = [
  { icon: "🏷️", title: "Completion Discount", desc: "Get up to 20% off remaining items on your registry 60 days after your event." },
  { icon: "🌐", title: "Universal Wishlist", desc: "Add items from any website — not just Amazon — using our browser extension." },
  { icon: "👥", title: "Group Gifting", desc: "Friends and family can pool money to buy you that big-ticket item together." },
  { icon: "📋", title: "Thank You List", desc: "Track who gave what and easily send thank you notes to everyone." },
  { icon: "🔄", title: "Easy Returns", desc: "Gifts are easy to return or exchange if you receive duplicates or change your mind." },
  { icon: "🔒", title: "Privacy Controls", desc: "Make your registry public, private, or share only with specific people." },
];

const popularItems = [
  { name: "Chicco Next2Me Crib", category: "Baby", price: "₹21,999", image: "https://picsum.photos/seed/baby-crib/200/200" },
  { name: "Joie Stroller Aire", category: "Baby", price: "₹12,499", image: "https://picsum.photos/seed/baby-stroller/200/200" },
  { name: "Philips Avent Baby Monitor", category: "Baby", price: "₹5,999", image: "https://picsum.photos/seed/baby-monitor/200/200" },
  { name: "Prestige Cookware Set 5pc", category: "Wedding", price: "₹3,299", image: "https://picsum.photos/seed/cookware-set/200/200" },
  { name: "Bombay Dyeing Bedsheet Set", category: "Wedding", price: "₹1,499", image: "https://picsum.photos/seed/bedsheet-set/200/200" },
  { name: "Philips Air Purifier", category: "Wedding", price: "₹8,999", image: "https://picsum.photos/seed/air-purifier/200/200" },
  { name: "Sony Bluetooth Speaker", category: "Birthday", price: "₹4,499", image: "https://picsum.photos/seed/sony-speaker/200/200" },
  { name: "Kindle Paperwhite", category: "Birthday", price: "₹13,999", image: "https://picsum.photos/seed/kindle-pw/200/200" },
];

export const RegistryPage = () => {
  useEffect(() => {
    document.title = "Amazon Registry & Wishlist | Amazon.in";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 py-16">
        <div className="mx-auto max-w-[1500px] px-4 text-center">
          <div className="mb-4 text-5xl">🎁</div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Create Your Registry</h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-purple-100">
            For Weddings, Baby Showers & More. Let the people who love you know exactly what you need.
          </p>
          <button className="mt-8 rounded-full bg-amazon-yellow px-8 py-3 text-base font-bold text-black transition hover:bg-amazon-yellow-hover">
            Create Your Free Registry
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] space-y-10 px-4 py-10">
        {/* Registry Types */}
        <section>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Choose Your Registry Type</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {registryTypes.map((type) => (
              <div
                key={type.title}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`bg-gradient-to-r ${type.color} p-6 text-center text-white`}>
                  <div className="mb-2 text-5xl">{type.icon}</div>
                  <h3 className="text-xl font-bold">{type.title}</h3>
                  <p className="text-sm text-white/80">{type.subtitle}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600">{type.desc}</p>
                  <ul className="mt-4 space-y-1">
                    {type.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-amazon-success">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-5 w-full rounded-full bg-amazon-yellow py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover">
                    Create {type.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Registry Benefits</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 rounded-lg bg-gray-50 p-4">
                <div className="shrink-0 text-3xl">{b.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{b.title}</h4>
                  <p className="mt-1 text-xs text-gray-600">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Registry Items */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Popular Registry Items</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {popularItems.map((item) => (
              <div
                key={item.name}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <ImageWithFallback
                  src={null}
                  alt={item.name}
                  productName={item.name}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  containerClassName="h-40 w-full"
                />
                <div className="p-3">
                  <span className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                    {item.category}
                  </span>
                  <h4 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="mt-1 text-sm font-bold text-gray-900">{item.price}</p>
                  <button className="mt-2 w-full rounded-full border border-amazon-border py-1.5 text-xs font-semibold text-gray-700 transition hover:border-amazon-orange hover:text-amazon-orange">
                    + Add to Registry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 p-10 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-white">Ready to Create Your Registry?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-purple-100">
            It's completely free and takes just 2 minutes. Start adding items and share with everyone you love.
          </p>
          <button className="mt-6 rounded-full bg-amazon-yellow px-10 py-3 text-base font-bold text-black transition hover:bg-amazon-yellow-hover">
            Create Your Free Registry
          </button>
        </section>
      </div>
    </div>
  );
};
