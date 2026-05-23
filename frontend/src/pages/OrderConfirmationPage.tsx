import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import type { Order } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { LoadingState } from '../components/ui/LoadingState';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

const PAYMENT_LABELS: Record<string, string> = {
  COD: 'Cash on Delivery',
  CARD: 'Credit / Debit Card',
  UPI: 'UPI',
  NET_BANKING: 'Net Banking',
};

const STATUS_STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const getStepStatus = (orderStatus: string, stepKey: string) => {
  const order = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const orderIdx = order.indexOf(orderStatus);
  const stepIdx = order.indexOf(stepKey);
  if (stepIdx < orderIdx) return 'completed';
  if (stepIdx === orderIdx) return 'active';
  return 'pending';
};

export const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [animate, setAnimate] = useState(false);

  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const orderNumberParam = searchParams.get('orderNumber');

  const { data: fetchedOrder, isLoading } = useQuery({
    queryKey: ['order-confirmation', orderNumberParam],
    queryFn: async () => {
      if (!orderNumberParam) return null;
      const res = await apiClient.getOrderByNumber(orderNumberParam);
      return res.data.data as Order;
    },
    enabled: !stateOrder && Boolean(orderNumberParam),
  });

  const order = stateOrder ?? fetchedOrder ?? null;

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const currentDate = new Date();
  const deliveryDate = new Date(currentDate);
  deliveryDate.setDate(currentDate.getDate() + 6);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1500px] px-4 py-10">
        <LoadingState title="Loading order" description="Fetching your confirmation details." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <div className="mx-auto max-w-[1500px] px-4 py-10">
          <div className="flex flex-col items-center gap-6 rounded-sm bg-white p-12 text-center shadow-sm">
            <div className="text-6xl">📦</div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Order Placed Successfully!
            </h1>
            <p className="text-sm text-gray-600">
              Thank you for shopping with us. Your order has been received.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="rounded-full border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-full bg-amazon-yellow px-6 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = order.orderItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1500px] px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-col items-center gap-4 rounded-sm bg-white p-8 text-center shadow-sm">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full bg-amazon-success text-white text-4xl transition-all duration-500 ${
                animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              ✓
            </div>
            <div>
              <h1 className="text-3xl font-normal text-gray-900">
                Order Placed, Thank you!
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Confirmation email sent for order #{order.orderNumber}
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="text-center">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="mt-1 text-2xl font-bold tracking-wide text-gray-900">
                #{order.orderNumber}
              </p>
              <p className="mt-2 text-xs text-gray-500">Order ID: {order.id}</p>
            </div>

            <hr className="my-4 border-green-200" />

            <div className="grid gap-6 sm:grid-cols-3 text-center">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Estimated Delivery
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatDate(deliveryDate.toISOString())}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-sm bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">
                Items Ordered ({itemCount})
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {order.orderItems.map((item) => (
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
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.unitPrice)} each
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-sm bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium text-gray-900">
                    {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === 'PAID'
                        ? 'text-amazon-success'
                        : order.paymentStatus === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1 mt-1">
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
                    className={order.shippingAmount === 0 ? 'text-amazon-success font-semibold' : ''}
                  >
                    {order.shippingAmount === 0 ? 'FREE' : formatPrice(order.shippingAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1 font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-sm bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">{order.address.fullName}</p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p>
                  {order.address.city}, {order.address.state} – {order.address.pincode}
                </p>
                <p>{order.address.country}</p>
                <p>Phone: {order.address.phone}</p>
              </div>
            </div>
          </div>

          <div className="rounded-sm bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((step, idx) => {
                const status = getStepStatus(order.status, step.key);
                return (
                  <div key={step.key} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          status === 'completed'
                            ? 'bg-amazon-success text-white'
                            : status === 'active'
                            ? 'border-2 border-amazon-success bg-white text-amazon-success'
                            : 'border-2 border-gray-300 bg-white text-gray-400'
                        }`}
                      >
                        {status === 'completed' ? '✓' : idx + 1}
                      </div>
                      <p
                        className={`mt-1 text-center text-xs ${
                          status !== 'pending'
                            ? 'font-semibold text-amazon-success'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          status === 'completed' ? 'bg-amazon-success' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => navigate('/orders')}
              className="rounded-full border-2 border-gray-300 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              📋 View All Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-amazon-yellow py-3 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
            >
              🏠 Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
