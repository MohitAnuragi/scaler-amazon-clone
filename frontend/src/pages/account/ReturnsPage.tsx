import { Link } from "react-router-dom";

const returnSteps = [
  "Select the order you want to return.",
  "Choose a return reason and preferred pickup time.",
  "Print your label or schedule a pickup.",
  "Track your refund status right here.",
];

export const ReturnsPage = () => {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-8">
      <div className="rounded bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
        <p className="mt-2 text-sm text-gray-600">
          Start a return, check refund status, and manage return pickups.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            View orders
          </Link>
          <Link
            to="/customer-service"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Need help?
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Return in four easy steps</h2>
          <ol className="mt-4 space-y-2 text-sm text-gray-600">
            {returnSteps.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amazon-orange" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Return highlights</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="rounded border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-800">Pickup-ready packaging</p>
              <p className="mt-1 text-xs text-gray-500">
                Use the original box or any sturdy packaging for your return.
              </p>
            </div>
            <div className="rounded border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-800">Refund timeline</p>
              <p className="mt-1 text-xs text-gray-500">
                Most refunds are processed within 3-5 business days.
              </p>
            </div>
            <div className="rounded border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-800">Return policy</p>
              <p className="mt-1 text-xs text-gray-500">
                Eligible items can be returned within 7 days of delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
