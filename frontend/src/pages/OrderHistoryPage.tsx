import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import type { Order, OrderStatus } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useAuthStore } from '../store/authStore';

const PAYMENT_LABELS: Record<string, string> = {
  COD: 'Cash on Delivery',
  CARD: 'Credit / Debit Card',
  UPI: 'UPI',
  NET_BANKING: 'Net Banking',
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-gray-100 text-gray-700' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
  SHIPPED: { label: 'Shipped', color: 'bg-blue-100 text-blue-700' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Refunded', color: 'bg-red-100 text-red-700' },
};

type FilterType = 'all' | '3months' | '6months' | 'year';

export const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { status, hydrated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', page],
    queryFn: async () => {
      const res = await apiClient.getOrders(page, 10);
      return res.data.data;
    },
    enabled: hydrated && status === 'authenticated',
  });

  const allOrders: Order[] = data?.items ?? [];
  const totalOrders = data?.total ?? 0;
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const filterOrders = (orders: Order[]) => {
    let filtered = orders;
    const now = Date.now();
    if (filter !== 'all') {
      const days = filter === '3months' ? 90 : filter === '6months' ? 180 : 365;
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.orderItems.some((i) => i.productName.toLowerCase().includes(q))
      );
    }
    return filtered;
  };

  const filteredOrders = filterOrders(allOrders);

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: '3months', label: 'Past 3 Months' },
    { value: '6months', label: 'Past 6 Months' },
    { value: 'year', label: 'Past Year' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1500px] px-4 py-6">
        <h1 className="mb-6 text-3xl font-normal text-gray-900">Your Orders</h1>

        {/* Search + Filter */}
        <div className="mb-5 rounded-sm bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by order number or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm focus:border-amazon-blue focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    filter === opt.value
                      ? 'bg-amazon-blue text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="shimmer h-32 rounded-sm" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-sm bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">Failed to load orders. Please try again.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && filteredOrders.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-sm bg-white p-12 text-center shadow-sm">
            <div className="text-6xl">📭</div>
            <h2 className="text-xl font-semibold text-gray-900">No orders found</h2>
            <p className="text-sm text-gray-600">
              {searchQuery
                ? 'Try adjusting your search or filters.'
                : totalOrders === 0
                ? "You haven't placed any orders yet."
                : 'No orders match your current filters.'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="rounded-full bg-amazon-yellow px-8 py-2.5 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !isError && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const isExpanded = expandedOrderId === order.id;
              const visibleItems = order.orderItems.slice(0, 2);
              const extraItems = order.orderItems.length - 2;

              return (
                <div
                  key={order.id}
                  className="rounded-sm bg-white shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="uppercase text-xs font-semibold tracking-wide text-gray-500">
                        Order Placed
                      </span>
                      <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <span className="uppercase text-xs font-semibold tracking-wide text-gray-500">
                        Total
                      </span>
                      <p className="font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="uppercase text-xs font-semibold tracking-wide text-gray-500">
                        Payment
                      </span>
                      <p className="font-medium text-gray-900">
                        {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-500">#{order.orderNumber}</span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="px-6 py-4">
                    <div className="flex flex-col gap-3">
                      {visibleItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-50">
                            <ImageWithFallback
                              src={item.productImageUrl ?? null}
                              alt={item.productName}
                              productName={item.productName}
                              className="h-full w-full object-contain"
                              containerClassName="h-full w-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-xs text-gray-500">
                              {formatPrice(item.unitPrice)} each
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      ))}
                      {extraItems > 0 && !isExpanded && (
                        <p className="text-sm text-amazon-link hover:underline cursor-pointer"
                          onClick={() => setExpandedOrderId(order.id)}>
                          + {extraItems} more item{extraItems > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 border-t pt-4 space-y-4">
                        {/* Remaining items */}
                        {order.orderItems.slice(2).map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-50">
                              <ImageWithFallback
                                src={item.productImageUrl ?? null}
                                alt={item.productName}
                                productName={item.productName}
                                className="h-full w-full object-contain"
                                containerClassName="h-full w-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-xs text-gray-500">
                                {formatPrice(item.unitPrice)} each
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice(item.subtotal)}
                            </p>
                          </div>
                        ))}

                        {/* Address + Payment side by side */}
                        <div className="grid gap-6 sm:grid-cols-2 border-t pt-4">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                              Delivery Address
                            </h4>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.address.fullName}
                            </p>
                            <p className="text-sm text-gray-600">{order.address.addressLine1}</p>
                            {order.address.addressLine2 && (
                              <p className="text-sm text-gray-600">{order.address.addressLine2}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              {order.address.city}, {order.address.state} – {order.address.pincode}
                            </p>
                            <p className="text-sm text-gray-600">Ph: {order.address.phone}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                              Order Summary
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{formatPrice(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tax:</span>
                                <span>{formatPrice(order.taxAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span
                                  className={order.shippingAmount === 0 ? 'text-amazon-success' : ''}
                                >
                                  {order.shippingAmount === 0
                                    ? 'FREE'
                                    : formatPrice(order.shippingAmount)}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold text-gray-900 border-t pt-1">
                                <span>Total:</span>
                                <span>{formatPrice(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions Row */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
                      <button
                        onClick={() => navigate('/products')}
                        className="rounded-full bg-amazon-yellow px-4 py-2 text-xs font-semibold text-black hover:bg-amazon-yellow-hover"
                      >
                        Buy Again
                      </button>
                      <button
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order.id)
                        }
                        className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'}
                      </button>
                      {(order.status === 'SHIPPED' || order.status === 'PROCESSING') && (
                        <button className="rounded-full border border-amazon-link px-4 py-2 text-xs font-semibold text-amazon-link hover:bg-blue-50">
                          📦 Track Order
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <>
                          <button className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                            📝 Write a Review
                          </button>
                          <button className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                            🔄 Return Items
                          </button>
                        </>
                      )}
                      <button className="ml-auto rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        📄 Invoice
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded px-3 py-2 text-sm font-medium ${
                      p === page
                        ? 'bg-amazon-blue text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
