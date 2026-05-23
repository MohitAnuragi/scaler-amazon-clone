import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingState } from "../components/ui/LoadingState";
import { AuthLayout } from "../layouts/AuthLayout";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const HomePage = lazy(() => import("../pages/HomePage").then((m) => ({ default: m.HomePage })));
const ProductListingPage = lazy(() =>
  import("../pages/ProductListingPage").then((m) => ({ default: m.ProductListingPage }))
);
const ProductDetailPage = lazy(() =>
  import("../pages/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage }))
);
const CartPage = lazy(() => import("../pages/CartPage").then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() =>
  import("../pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage }))
);
const OrderConfirmationPage = lazy(() =>
  import("../pages/OrderConfirmationPage").then((m) => ({ default: m.OrderConfirmationPage }))
);
const OrderHistoryPage = lazy(() =>
  import("../pages/OrderHistoryPage").then((m) => ({ default: m.OrderHistoryPage }))
);

const SignInPage = lazy(() =>
  import("../pages/auth/SignInPage").then((m) => ({ default: m.SignInPage }))
);
const SignUpPage = lazy(() =>
  import("../pages/auth/SignUpPage").then((m) => ({ default: m.SignUpPage }))
);
const WishlistPage = lazy(() =>
  import("../pages/WishlistPage").then((m) => ({ default: m.WishlistPage }))
);
const AccountPage = lazy(() =>
  import("../pages/account/AccountPage").then((m) => ({ default: m.AccountPage }))
);
const ReturnsPage = lazy(() =>
  import("../pages/account/ReturnsPage").then((m) => ({ default: m.ReturnsPage }))
);
const TodaysDealsPage = lazy(() =>
  import("../pages/info/TodaysDealsPage").then((m) => ({ default: m.TodaysDealsPage }))
);
const CustomerServicePage = lazy(() =>
  import("../pages/info/CustomerServicePage").then((m) => ({ default: m.CustomerServicePage }))
);
const RegistryPage = lazy(() =>
  import("../pages/info/RegistryPage").then((m) => ({ default: m.RegistryPage }))
);
const SellPage = lazy(() =>
  import("../pages/info/SellPage").then((m) => ({ default: m.SellPage }))
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);

const RouteLoader = () => (
  <div className="mx-auto max-w-[1500px] px-4">
    <LoadingState title="Loading page" description="Fetching the latest view." />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/new-releases" element={<Navigate to="/products?sort=newest" replace />} />
          <Route path="/electronics" element={<Navigate to="/products?category=electronics" replace />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/todays-deals" element={<TodaysDealsPage />} />
          <Route path="/customer-service" element={<CustomerServicePage />} />
          <Route path="/registry" element={<RegistryPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
