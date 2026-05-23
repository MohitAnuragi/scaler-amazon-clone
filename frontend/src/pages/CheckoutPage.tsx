import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import { useCartSummary } from '../hooks/useCart';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import type { Address, PaymentMethod } from '../types';
import { formatPrice } from '../utils/formatters';
import { ErrorState } from '../components/ui/ErrorState';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  COD: 'Cash on Delivery',
  CARD: 'Credit / Debit Card',
  UPI: 'UPI',
  NET_BANKING: 'Net Banking',
};

const STEP_LABELS = ['', '1. Address', '2. Payment', '3. Review'];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cartSummary = useCartSummary();
  const addToast = useUIStore((s) => s.addToast);
  const { status, hydrated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Load saved addresses from API
  const { data: addresses = [], isLoading: addrLoading, refetch: refetchAddresses } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await apiClient.getAddresses();
      return res.data.data;
    },
    enabled: hydrated && status === 'authenticated',
  });

  const addAddressMutation = useMutation({
    mutationFn: () => apiClient.addAddress(formData),
    onSuccess: (res) => {
      const newAddress = res.data.data;
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddress(newAddress.id);
      setShowAddressForm(false);
      setCurrentStep(2);
      refetchAddresses();
      addToast({ type: 'success', message: 'Address saved successfully.' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to save address. Please try again.' });
    },
  });

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      if (def) setSelectedAddress(def.id);
    }
  }, [addresses, selectedAddress]);

  const placeOrderMutation = useMutation({
    mutationFn: () =>
      apiClient.placeOrder({ addressId: selectedAddress, paymentMethod }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      useCartStore.getState().resetCart();
      const order = res.data.data;
      navigate(`/order-confirmation?orderNumber=${encodeURIComponent(order.orderNumber)}`, {
        state: { order },
      });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to place order. Please try again.' });
    },
  });

  if (!cartSummary) {
    return (
      <div className="mx-auto max-w-[1500px] px-4 py-6">
        <ErrorState
          title="Cart is empty"
          description="Please add items to your cart before checkout."
          action={{ label: 'Continue Shopping', onClick: () => navigate('/products') }}
        />
      </div>
    );
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddressMutation.mutate();
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      addToast({ type: 'error', message: 'Please select a delivery address.' });
      return;
    }
    placeOrderMutation.mutate();
  };

  const displayAddresses = addresses;
  const itemCount = cartSummary.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1500px] px-4 py-6">
        <h1 className="mb-6 text-3xl font-normal text-gray-900">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <button
                onClick={() => step < currentStep && setCurrentStep(step)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                  step <= currentStep
                    ? 'bg-amazon-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                } ${step < currentStep ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
              >
                {step}
              </button>
              <span
                className={`text-sm font-semibold ${
                  step <= currentStep ? 'text-amazon-blue' : 'text-gray-400'
                }`}
              >
                {STEP_LABELS[step]}
              </span>
              {step < 3 && (
                <div
                  className={`mx-2 h-0.5 w-10 ${
                    step < currentStep ? 'bg-amazon-blue' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Steps */}
          <div className="space-y-4">
            {/* Step 1: Shipping Address */}
            <div className="rounded-sm border border-amazon-border bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    currentStep >= 1 ? 'bg-amazon-blue text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="ml-auto text-xs text-amazon-link hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              <div className="px-6 py-5 space-y-4">
                {addrLoading ? (
                  <div className="shimmer h-20 rounded" />
                ) : displayAddresses.length === 0 && !showAddressForm ? (
                  <p className="text-sm text-gray-600">No saved addresses. Add a new address below.</p>
                ) : (
                  <div className="space-y-3">
                    {displayAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex cursor-pointer items-start gap-3 rounded border p-4 transition ${
                          selectedAddress === addr.id
                            ? 'border-amazon-orange bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={(e) => {
                            setSelectedAddress(e.target.value);
                            if (currentStep === 1) setCurrentStep(2);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{addr.fullName}</p>
                            {addr.isDefault && (
                              <span className="rounded-full bg-amazon-blue px-2 py-0.5 text-xs text-white">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {addr.addressLine1}
                            {addr.addressLine2 && `, ${addr.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.city}, {addr.state} – {addr.pincode}
                          </p>
                          <p className="text-sm text-gray-600">India</p>
                          <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-sm text-amazon-link hover:underline"
                >
                  {showAddressForm ? '− Cancel' : '+ Add a new address'}
                </button>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="space-y-3 border-t pt-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        required
                        className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      name="addressLine1"
                      placeholder="Address Line 1"
                      value={formData.addressLine1}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                    />
                    <input
                      type="text"
                      name="addressLine2"
                      placeholder="Address Line 2 (Optional)"
                      value={formData.addressLine2}
                      onChange={handleFormChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleFormChange}
                        required
                        className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleFormChange}
                        required
                        className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                      />
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleFormChange}
                        required
                        className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addAddressMutation.isPending}
                      className="rounded bg-amazon-yellow px-5 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover disabled:opacity-60"
                    >
                      {addAddressMutation.isPending ? 'Saving...' : 'Use This Address'}
                    </button>
                  </form>
                )}

                {currentStep === 1 && selectedAddress && (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="mt-2 rounded bg-amazon-yellow px-5 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            {currentStep >= 2 && (
              <div className="rounded-sm border border-amazon-border bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amazon-blue text-sm font-bold text-white">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  {currentStep > 2 && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="ml-auto text-xs text-amazon-link hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>

                <div className="px-6 py-5 space-y-3">
                  {(['COD', 'CARD', 'UPI', 'NET_BANKING'] as const).map((method) => (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-center gap-3 rounded border p-4 transition ${
                        paymentMethod === method
                          ? 'border-amazon-orange bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="h-4 w-4"
                      />
                      <span className="font-medium text-gray-900">
                        {PAYMENT_LABELS[method]}
                      </span>
                    </label>
                  ))}

                  {paymentMethod === 'CARD' && (
                    <div className="space-y-3 border-t pt-4">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'UPI' && (
                    <div className="border-t pt-4">
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g. name@upi)"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-amazon-blue focus:outline-none"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="mt-1 rounded bg-amazon-yellow px-5 py-2 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep >= 3 && (
              <div className="rounded-sm border border-amazon-border bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amazon-blue text-sm font-bold text-white">
                    3
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Review Items &amp; Place Order</h2>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Items */}
                  <div className="space-y-3 border-b pb-4">
                    {cartSummary.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-50">
                          <ImageWithFallback
                            src={item.product.images?.[0]?.url ?? null}
                            alt={item.product.name}
                            productName={item.product.name}
                            categorySlug={item.product.category?.slug}
                            className="h-full w-full object-contain"
                            containerClassName="h-full w-full"
                          />
                        </div>
                        <div className="flex flex-1 justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatPrice(item.lineSubtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Items ({itemCount}):
                      </span>
                      <span>{formatPrice(cartSummary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18%):</span>
                      <span>{formatPrice(cartSummary.estimatedTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span
                        className={cartSummary.shipping === 0 ? 'font-semibold text-amazon-success' : ''}
                      >
                        {cartSummary.shipping === 0 ? 'FREE' : formatPrice(cartSummary.shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold text-gray-900">
                      <span>Order Total:</span>
                      <span>{formatPrice(cartSummary.total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={placeOrderMutation.isPending}
                    className="w-full rounded-full bg-amazon-yellow py-3 font-semibold text-black hover:bg-amazon-yellow-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {placeOrderMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      'Place your order'
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    By placing your order, you agree to Amazon's{' '}
                    <span className="text-amazon-link cursor-pointer hover:underline">
                      privacy notice
                    </span>{' '}
                    and{' '}
                    <span className="text-amazon-link cursor-pointer hover:underline">
                      conditions of use
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Card */}
          <div className="h-fit rounded-sm border border-amazon-border bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <button
              onClick={() => currentStep < 3 ? null : navigate('/checkout')}
              disabled={placeOrderMutation.isPending}
              className={`w-full rounded-full py-3 text-sm font-semibold text-black transition ${
                currentStep < 3
                  ? 'bg-amazon-yellow hover:bg-amazon-yellow-hover'
                  : 'bg-amazon-yellow hover:bg-amazon-yellow-hover disabled:opacity-60'
              }`}
            >
              {currentStep === 3 ? (
                placeOrderMutation.isPending ? 'Placing Order...' : 'Place your order'
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <h3 className="font-bold text-gray-900">Order Summary</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Items ({itemCount}):</span>
                  <span>{formatPrice(cartSummary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatPrice(cartSummary.estimatedTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span
                    className={cartSummary.shipping === 0 ? 'text-amazon-success font-semibold' : ''}
                  >
                    {cartSummary.shipping === 0 ? 'FREE' : formatPrice(cartSummary.shipping)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-lg">{formatPrice(cartSummary.total)}</span>
              </div>
            </div>

            {/* Items preview */}
            <div className="mt-4 space-y-2 border-t pt-4">
              {cartSummary.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-2">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-50">
                    <ImageWithFallback
                      src={item.product.images?.[0]?.url ?? null}
                      alt={item.product.name}
                      productName={item.product.name}
                      categorySlug={item.product.category?.slug}
                      className="h-full w-full object-contain"
                      containerClassName="h-full w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {cartSummary.items.length > 3 && (
                <p className="text-xs text-gray-500">
                  + {cartSummary.items.length - 3} more item(s)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
