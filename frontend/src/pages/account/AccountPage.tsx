import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";

const accountCards = [
  {
    icon: "📦",
    title: "Your Orders",
    desc: "Track, return, or buy again",
    to: "/orders",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: "📍",
    title: "Your Addresses",
    desc: "Edit addresses for orders and gifts",
    to: "/checkout",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "🔐",
    title: "Login & Security",
    desc: "Update password, email, and phone",
    to: "#",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: "👑",
    title: "Prime Membership",
    desc: "View benefits and manage membership",
    to: "#",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
  },
  {
    icon: "💳",
    title: "Payment Options",
    desc: "Manage cards and UPI",
    to: "#",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: "🎧",
    title: "Customer Service",
    desc: "Help, returns & replacements",
    to: "/customer-service",
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
  },
];

const mockOrders = [
  {
    id: "408-1234567-8901234",
    date: "18 May 2026",
    status: "Delivered",
    statusColor: "text-amazon-success",
    total: 24990,
    items: "Sony WH-1000XM5 Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&auto=format&q=80",
  },
  {
    id: "408-9876543-2109876",
    date: "12 May 2026",
    status: "Out for Delivery",
    statusColor: "text-blue-600",
    total: 5499,
    items: "Philips HD9252 Air Fryer 4.1L",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=80&h=80&fit=crop&auto=format&q=80",
  },
  {
    id: "408-1122334-5566778",
    date: "3 May 2026",
    status: "Delivered",
    statusColor: "text-amazon-success",
    total: 1299,
    items: "boAt Airdopes 141 TWS",
    image: "https://images.unsplash.com/photo-1590658268037-6c4d0a0e0b0e?w=80&h=80&fit=crop&auto=format&q=80",
  },
];

export const AccountPage = () => {
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    document.title = "Your Account | Amazon.in";
  }, []);

  const displayName = user?.name ?? "Amazon Customer";
  const displayEmail = user?.email ?? "customer@example.com";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amazon-blue to-amazon-blue-light py-8">
        <div className="mx-auto max-w-[1500px] px-4">
          <p className="text-sm text-gray-400">Hello,</p>
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="mt-1 text-sm text-gray-300">{displayEmail}</p>
          <button
            onClick={signOut}
            className="mt-3 rounded-full border border-gray-400 px-4 py-1.5 text-xs font-medium text-gray-300 transition hover:border-white hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-8">
        {/* Prime Banner */}
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#00A8E0] to-[#0066C0] p-5 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-3xl">👑</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Amazon Prime</p>
              <p className="font-bold">You're not a Prime member yet</p>
              <p className="text-sm text-blue-200">Get free delivery, Prime Video, exclusive deals & more</p>
            </div>
          </div>
          <button className="shrink-0 rounded-full bg-amazon-yellow px-5 py-2 text-sm font-bold text-black hover:bg-amazon-yellow-hover">
            Try Prime Free
          </button>
        </div>

        {/* Account Cards */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Your Account</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {accountCards.map((card) => (
              <Link
                key={card.title}
                to={card.to}
                className={`flex items-start gap-4 rounded-xl ${card.bg} p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg} text-2xl`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{card.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-600">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-sm font-medium text-amazon-link hover:underline">
              View all orders →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                <ImageWithFallback
                  src={order.image}
                  alt={order.items}
                  productName={order.items}
                  className="h-16 w-16 rounded-lg object-cover"
                  containerClassName="h-16 w-16 rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{order.items}</p>
                  <p className="text-xs text-gray-500">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${order.statusColor}`}>{order.status}</p>
                  <p className="mt-0.5 text-sm font-bold text-gray-900">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                  <button className="mt-1 rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-400">
                    Buy again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Account Details */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Account Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</p>
                <button className="text-xs font-medium text-amazon-link hover:underline">Edit</button>
              </div>
              <p className="mt-1 font-semibold text-gray-900">{displayName}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
                <button className="text-xs font-medium text-amazon-link hover:underline">Edit</button>
              </div>
              <p className="mt-1 font-semibold text-gray-900">{displayEmail}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</p>
                <button className="text-xs font-medium text-amazon-link hover:underline">Edit</button>
              </div>
              <p className="mt-1 text-sm text-gray-600">••••••••••••</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mobile</p>
                <button className="text-xs font-medium text-amazon-link hover:underline">Add</button>
              </div>
              <p className="mt-1 text-sm text-gray-500">Not added yet</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
