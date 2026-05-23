import { useEffect } from "react";

const stats = [
  { value: "7 Lakh+", label: "Active Sellers" },
  { value: "₹2 Lakh+", label: "Avg. Monthly Earnings" },
  { value: "19 Cr+", label: "Customers Reached" },
  { value: "100%", label: "A-to-Z Guarantee" },
];

const benefits = [
  { icon: "🌏", title: "Reach Crores of Customers", desc: "Sell to customers across India and reach a nationwide audience through Amazon's trusted marketplace." },
  { icon: "📦", title: "Easy Listing & Shipping", desc: "List products in minutes and let Fulfillment by Amazon (FBA) handle storage, packaging, and delivery." },
  { icon: "💰", title: "Secure & Timely Payments", desc: "Get paid directly to your bank account on a 7-day settlement cycle with full payment protection." },
  { icon: "🎧", title: "24/7 Seller Support", desc: "Dedicated seller support via phone, chat, and email. Get help whenever you need it." },
  { icon: "📊", title: "Powerful Analytics", desc: "Gain insights into your sales, customer behavior, and market trends with Seller Central analytics." },
  { icon: "🚀", title: "Fulfillment by Amazon (FBA)", desc: "Store your products in Amazon warehouses. We pick, pack, ship, and provide customer service." },
];

const feeStructure = [
  { category: "Electronics", fee: "5%" },
  { category: "Mobiles & Accessories", fee: "5%" },
  { category: "Fashion & Apparel", fee: "10%" },
  { category: "Home & Kitchen", fee: "9%" },
  { category: "Books", fee: "12%" },
  { category: "Beauty & Personal Care", fee: "12%" },
  { category: "Sports & Outdoors", fee: "9%" },
  { category: "Toys & Games", fee: "10%" },
];

const steps = [
  { num: 1, title: "Register", desc: "Sign up on Seller Central with your business details, PAN, and GST number in just 15 minutes.", icon: "📝" },
  { num: 2, title: "List Products", desc: "Add your product catalog using our easy listing tools. Upload images, descriptions, and set prices.", icon: "🏷️" },
  { num: 3, title: "Get Orders", desc: "Start receiving orders from crores of Amazon customers across India. Manage from one dashboard.", icon: "🛒" },
  { num: 4, title: "Deliver & Earn", desc: "Ship using Amazon logistics or your own. Get paid directly to your bank within 7 days.", icon: "💸" },
];

const testimonials = [
  { name: "Rajesh Kumar", city: "Jaipur", quote: "I went from a small kirana store to earning ₹5 lakh/month in just 2 years of selling on Amazon.", business: "Handicrafts & Home Decor" },
  { name: "Priya Sharma", city: "Bengaluru", quote: "Amazon's FBA service changed my life. I can now focus on growing my brand without worrying about logistics.", business: "Women's Fashion" },
];

export const SellPage = () => {
  useEffect(() => {
    document.title = "Sell on Amazon India | Amazon.in";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amazon-blue via-amazon-blue-light to-[#37475A] py-16">
        <div className="mx-auto max-w-[1500px] px-4 text-center">
          <div className="inline-block rounded-full bg-amazon-orange/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amazon-orange mb-4">
            India's #1 E-commerce Platform
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Become an Amazon Seller
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-300">
            Join 7 lakh+ sellers and reach crores of customers across India. Start your online business today — it's free to register.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-amazon-yellow px-8 py-3 text-base font-bold text-black transition hover:bg-amazon-yellow-hover">
              Start Selling Today
            </button>
            <button className="rounded-full border-2 border-white px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-amazon-orange py-6">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-black">{stat.value}</div>
                <div className="text-sm font-medium text-amazon-blue">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] space-y-10 px-4 py-10">
        {/* Benefits */}
        <section>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Why Sell on Amazon?</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{benefit.icon}</div>
                <h3 className="text-base font-bold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-6 hidden h-0.5 w-full bg-amazon-orange/30 md:block" />
                )}
                <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amazon-orange text-xl font-extrabold text-black">
                  {step.num}
                </div>
                <div className="mb-1 text-2xl">{step.icon}</div>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fee Structure */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-gray-900">Referral Fee Structure</h2>
          <p className="mb-5 text-sm text-gray-500">Low, competitive referral fees. No hidden charges.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Referral Fee</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((row, i) => (
                  <tr key={row.category} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-200 px-4 py-3 text-gray-900">{row.category}</td>
                    <td className="border border-gray-200 px-4 py-3 font-semibold text-amazon-success">{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-400">* Closing fees and FBA fees may apply. See full fee schedule on Seller Central.</p>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Success Stories</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-3 text-2xl text-amazon-orange">❝</div>
                <p className="text-sm italic text-gray-700">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amazon-orange text-base font-bold text-black">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}, {t.city}</p>
                    <p className="text-xs text-gray-500">{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl bg-gradient-to-r from-amazon-orange to-amber-500 p-10 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-black">Ready to Start Selling?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-black/80">
            Registration is free. List your first product today and start earning from crores of Amazon customers.
          </p>
          <button className="mt-6 rounded-full bg-amazon-blue px-10 py-3 text-base font-bold text-white transition hover:bg-amazon-blue-light">
            Register Now — It's Free
          </button>
        </section>
      </div>
    </div>
  );
};
