import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingState } from "../components/ui/LoadingState";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { status, hydrated } = useAuthStore();

  if (!hydrated || status === "loading") {
    return (
      <div className="mx-auto max-w-[1500px] px-4">
        <LoadingState title="Checking your account" description="Please wait a moment." />
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
};
