import { useNavigate } from 'react-router-dom';
import {
  useCartQuery,
  useUpdateCartItem,
  useRemoveCartItem,
  useCartSummary,
} from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const CartPage = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCartQuery();
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();
  const summary = useCartSummary();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <div className="mx-auto max-w-[1500px] px-4 py-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="shimmer h-36 rounded-sm" />
              ))}
            </div>
            <div className="shimmer h-48 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  const hasOutOfStock = cart?.items.some((i) => i.isOutOfStock) ?? false;
  const itemCount = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const savings =
    cart?.items.reduce((s, i) => {
      const compare = i.product.compareAtPrice;
      if (compare && compare > i.product.price) {
        return s + (compare - i.product.price) * i.quantity;
      }
      return s;
    }, 0) ?? 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <div className="mx-auto max-w-[1500px] px-4 py-10">
          <div className="flex flex-col items-center gap-6 rounded-sm bg-white p-12 text-center shadow-sm">
            <div className="text-8xl">🛒</div>
            <div>
              <h1 className="text-3xl font-normal text-gray-900">
                Your Amazon Cart is empty.
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Your shopping cart is waiting. Give it purpose – fill it with groceries,
                clothing, household supplies, electronics, and more.
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="rounded-full bg-amazon-yellow px-8 py-3 text-sm font-semibold text-black hover:bg-amazon-yellow-hover"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="mx-auto max-w-[1500px] px-4 py-6">
        {hasOutOfStock && (
          <div className="mb-4 rounded-sm border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            ⚠️ Some items in your cart are currently unavailable. Please remove them before
            checking out.
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* Left: Cart Items */}
          <div className="rounded-sm bg-white shadow-sm">
            <div className="flex items-baseline justify-between border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-normal text-gray-900">Shopping Cart</h1>
              <span className="text-sm text-gray-500">Price</span>
            </div>

            {cart.items.map((item) => (
              <div
                key={item.id}
                className={`border-b border-gray-200 px-6 py-4 ${
                  item.isOutOfStock ? 'opacity-60' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div
                    className="h-32 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded bg-gray-50 p-1"
                    onClick={() => navigate(`/products/${item.product.slug}`)}
                  >
                    <ImageWithFallback
                      src={item.product.images?.[0]?.url ?? null}
                      alt={item.product.name}
                      productName={item.product.name}
                      categorySlug={item.product.category?.slug}
                      className="h-full w-full object-contain"
                      containerClassName="h-full w-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 justify-between">
                    <div className="flex-1 pr-4">
                      <button
                        onClick={() => navigate(`/products/${item.product.slug}`)}
                        className="line-clamp-2 text-left text-sm font-medium text-amazon-link hover:underline"
                      >
                        {item.product.name}
                      </button>
                      {item.product.brand && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          Brand: {item.product.brand}
                        </p>
                      )}
                      <p
                        className={`mt-1 text-xs font-semibold ${
                          item.isOutOfStock ? 'text-red-600' : 'text-amazon-success'
                        }`}
                      >
                        {item.isOutOfStock ? 'Currently unavailable' : 'In Stock'}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Sold by: <span className="text-amazon-link">Amazon</span>
                      </p>
                      <p className="mt-0.5 text-xs text-amazon-success">
                        FREE Delivery by Tomorrow
                      </p>

                      {/* Qty + Actions */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {!item.isOutOfStock && (
                          <div className="flex items-center gap-1 rounded-sm border border-gray-300 bg-white px-2 py-1">
                            <span className="text-xs text-gray-600">Qty:</span>
                            <select
                              value={item.quantity}
                              onChange={(e) =>
                                updateQty({
                                  cartItemId: item.id,
                                  quantity: Number(e.target.value),
                                })
                              }
                              disabled={isUpdating}
                              className="cursor-pointer bg-transparent text-sm outline-none"
                            >
                              {Array.from(
                                { length: Math.min(10, item.product.stockQuantity) },
                                (_, i) => i + 1
                              ).map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() =>
                            removeItem({ cartItemId: item.id, quantity: item.quantity })
                          }
                          disabled={isRemoving}
                          className="text-xs text-amazon-link hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-xs text-amazon-link hover:underline">
                          Save for later
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => navigate('/products')}
                          className="text-xs text-amazon-link hover:underline"
                        >
                          See more like this
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.lineSubtotal)}
                      </p>
                      {item.product.compareAtPrice &&
                        item.product.compareAtPrice > item.product.price && (
                          <>
                            <p className="text-xs text-gray-500">
                              M.R.P:{' '}
                              <span className="line-through">
                                {formatPrice(item.product.compareAtPrice * item.quantity)}
                              </span>
                            </p>
                            <p className="text-xs font-semibold text-amazon-red">
                              {Math.round(
                                ((item.product.compareAtPrice - item.product.price) /
                                  item.product.compareAtPrice) *
                                  100
                              )}
                              % off
                            </p>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Total (bottom of items) */}
            {summary && (
              <div className="px-6 py-4 text-right">
                {savings > 0 && (
                  <p className="text-sm text-amazon-red">
                    Your items saved{' '}
                    <span className="font-bold">{formatPrice(savings)}</span> of discount
                  </p>
                )}
                <p className="mt-1 text-xl">
                  Subtotal ({itemCount} items):{' '}
                  <span className="font-bold text-gray-900">
                    {formatPrice(summary.subtotal)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          {summary && (
            <div className="h-fit rounded-sm bg-white p-5 shadow-sm lg:sticky lg:top-24">
              {summary.shipping === 0 && (
                <p className="mb-3 text-sm text-amazon-success">
                  ✓ Your order qualifies for{' '}
                  <span className="font-bold">FREE Delivery.</span> Choose this option at
                  checkout.
                </p>
              )}
              <p className="text-lg">
                Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''}):{' '}
                <span className="font-bold text-gray-900">
                  {formatPrice(summary.subtotal)}
                </span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input type="checkbox" id="cart-gift" className="h-4 w-4" />
                <label htmlFor="cart-gift" className="text-sm text-gray-700">
                  This order contains a gift
                </label>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                disabled={hasOutOfStock || cart.items.length === 0}
                className="mt-4 w-full rounded-full bg-amazon-yellow py-2.5 text-sm font-semibold text-black hover:bg-amazon-yellow-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Buy ({itemCount} item{itemCount > 1 ? 's' : ''})
              </button>

              <div className="mt-4 space-y-1 border-t pt-4 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span
                    className={
                      summary.shipping === 0 ? 'font-semibold text-amazon-success' : ''
                    }
                  >
                    {summary.shipping === 0 ? 'FREE' : formatPrice(summary.shipping)}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-amazon-red">
                    <span>Discount</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold text-gray-900">
                  <span>Order Total</span>
                  <span>{formatPrice(summary.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
