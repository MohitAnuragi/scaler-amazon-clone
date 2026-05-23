import { useEffect, useState } from "react";

const quickActions = [
  { icon: "📦", title: "Return or Replace Items", desc: "Initiate a return or request a replacement for your order.", link: "/returns" },
  { icon: "👑", title: "Manage Prime Membership", desc: "View benefits, update payment, or cancel your Prime subscription.", link: "#" },
  { icon: "💳", title: "Payment & Charges", desc: "Manage payment methods or dispute a charge.", link: "#" },
  { icon: "🚚", title: "Packages, Deliveries & Orders", desc: "Track your package, reschedule delivery, or report a missing item.", link: "/orders" },
];

type FaqItem = { q: string; a: string };
type HelpTopic = { title: string; icon: string; faqs: FaqItem[] };

const helpTopics: HelpTopic[] = [
  {
    title: "Returns & Refunds",
    icon: "🔄",
    faqs: [
      { q: "How do I return an item?", a: "Go to Your Orders, select the item to return, choose a reason, and schedule a free pickup." },
      { q: "How long does a refund take?", a: "Most refunds are processed within 3-5 business days after we receive the item." },
      { q: "Can I return electronics?", a: "Electronics can be returned within 10 days of delivery if unopened or defective." },
      { q: "What if my item is damaged?", a: "Report a damaged item within 48 hours of delivery for a replacement or full refund." },
    ],
  },
  {
    title: "Shipping & Delivery",
    icon: "🚚",
    faqs: [
      { q: "How do I track my order?", a: "Go to Your Orders and click 'Track Package' next to the relevant item." },
      { q: "What is Amazon Prime delivery?", a: "Prime members get free 1-day and 2-day delivery on millions of eligible items." },
      { q: "Can I change my delivery address?", a: "You can update delivery address before the order is shipped from Your Orders page." },
      { q: "What if I miss my delivery?", a: "Amazon will attempt redelivery the next day or you can pick it up from the nearest Hub." },
    ],
  },
  {
    title: "Payments & Cards",
    icon: "💳",
    faqs: [
      { q: "What payment methods are accepted?", a: "We accept Credit/Debit cards, Net Banking, UPI, Amazon Pay, EMI, and Cash on Delivery." },
      { q: "How do I add a new card?", a: "Go to Account → Payment Options → Add a new card and enter your card details." },
      { q: "Is my payment information safe?", a: "Yes, Amazon uses industry-standard SSL encryption for all transactions." },
      { q: "Can I get a GST invoice?", a: "Yes, you can download GST invoices from Your Orders for business purchases." },
    ],
  },
  {
    title: "Amazon Prime",
    icon: "👑",
    faqs: [
      { q: "What are Prime benefits?", a: "Prime includes free fast delivery, Prime Video, Prime Music, exclusive deals, and more." },
      { q: "How much does Prime cost?", a: "Prime is ₹1,499/year or ₹179/month. Students get 50% discount." },
      { q: "How do I cancel Prime?", a: "Go to Account → Prime Membership → Manage Membership → Cancel Membership." },
      { q: "Is Prime Video included?", a: "Yes, Prime Video with thousands of movies and shows is included with every Prime plan." },
    ],
  },
  {
    title: "Account Settings",
    icon: "⚙️",
    faqs: [
      { q: "How do I change my password?", a: "Go to Account → Login & Security → Edit next to Password." },
      { q: "How do I update my email?", a: "Go to Account → Login & Security → Edit next to Email." },
      { q: "How do I enable 2-Step Verification?", a: "Go to Account → Login & Security → Two-Step Verification → Turn On." },
      { q: "How do I delete my account?", a: "Contact Customer Service to request account deletion. This action is irreversible." },
    ],
  },
];

export const CustomerServicePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingMsg, setTrackingMsg] = useState("");

  useEffect(() => {
    document.title = "Help & Customer Service | Amazon.in";
  }, []);

  const handleTrack = () => {
    if (!orderNumber.trim()) return;
    setTrackingMsg(`Order ${orderNumber}: Out for delivery — expected by 6 PM today. (Mock)`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amazon-blue to-amazon-blue-light py-12">
        <div className="mx-auto max-w-[1500px] px-4 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Hello, what can we help you with?</h1>
          <div className="mx-auto mt-6 flex max-w-lg overflow-hidden rounded-lg shadow-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics, e.g. 'return an item'"
              className="flex-1 px-4 py-3 text-sm text-gray-900 focus:outline-none"
            />
            <button className="bg-amazon-yellow px-5 py-3 text-sm font-bold text-amazon-blue hover:bg-amazon-yellow-hover">
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-8">
        {/* Quick Actions */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">What would you like to do?</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.link}
                className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="mb-3 text-4xl">{action.icon}</span>
                <h3 className="text-sm font-bold text-gray-900">{action.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{action.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Order Tracking */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-bold text-gray-900">Track Your Order</h2>
          <p className="mb-4 text-sm text-gray-500">Enter your order number to get real-time tracking updates.</p>
          <div className="flex max-w-md gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. 403-1234567-8901234"
              className="flex-1 rounded-lg border border-amazon-border px-3 py-2 text-sm focus:border-amazon-orange focus:outline-none"
            />
            <button
              onClick={handleTrack}
              className="rounded-lg bg-amazon-yellow px-5 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
            >
              Track
            </button>
          </div>
          {trackingMsg && (
            <div className="mt-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              📦 {trackingMsg}
            </div>
          )}
        </section>

        {/* Help Topics Accordion */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Browse Help Topics</h2>
          <div className="space-y-3">
            {helpTopics.map((topic) => (
              <div key={topic.title} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setExpandedTopic(expandedTopic === topic.title ? null : topic.title)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{topic.icon}</span>
                    <span className="font-semibold text-gray-900">{topic.title}</span>
                  </div>
                  <span className={`text-gray-400 transition-transform duration-200 ${expandedTopic === topic.title ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {expandedTopic === topic.title && (
                  <div className="border-t border-gray-100 px-5 pb-4">
                    <div className="mt-3 space-y-2">
                      {topic.faqs.map((faq) => (
                        <div key={faq.q} className="rounded-lg border border-gray-100">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === faq.q ? null : faq.q)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                          >
                            <span className="text-sm font-medium text-amazon-link">{faq.q}</span>
                            <span className="ml-2 shrink-0 text-xs text-gray-400">{expandedFaq === faq.q ? "−" : "+"}</span>
                          </button>
                          {expandedFaq === faq.q && (
                            <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">{faq.a}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Options */}
        <section className="rounded-xl bg-amazon-blue p-8 text-white shadow-sm">
          <h2 className="mb-6 text-center text-xl font-bold">Still need help? Contact us</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-5 text-center">
              <div className="mb-2 text-3xl">📞</div>
              <h3 className="font-bold">Phone</h3>
              <p className="mt-1 text-sm text-gray-300">Toll-Free: 1800-3000-9009</p>
              <p className="mt-1 text-xs text-gray-400">Available 24/7</p>
              <button className="mt-3 rounded-full bg-amazon-yellow px-5 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover">
                Call Now
              </button>
            </div>
            <div className="rounded-xl bg-white/10 p-5 text-center">
              <div className="mb-2 text-3xl">💬</div>
              <h3 className="font-bold">Chat</h3>
              <p className="mt-1 text-sm text-gray-300">Chat with our support agents</p>
              <p className="mt-1 text-xs text-gray-400">Average wait: under 2 minutes</p>
              <button className="mt-3 rounded-full bg-amazon-yellow px-5 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover">
                Start Chat
              </button>
            </div>
            <div className="rounded-xl bg-white/10 p-5 text-center">
              <div className="mb-2 text-3xl">📧</div>
              <h3 className="font-bold">Email</h3>
              <p className="mt-1 text-sm text-gray-300">Send us a detailed message</p>
              <p className="mt-1 text-xs text-gray-400">Response within 24 hours</p>
              <button className="mt-3 rounded-full bg-amazon-yellow px-5 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover">
                Send Email
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
