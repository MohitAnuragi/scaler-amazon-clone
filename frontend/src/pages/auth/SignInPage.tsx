import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../../config/api";
import { LoadingState } from "../../components/ui/LoadingState";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, hydrated, signIn } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/account";

  if (!hydrated || status === "loading") {
    return (
      <div className="mx-auto max-w-[1500px] px-4">
        <LoadingState title="Preparing sign-in" description="Syncing your account details." />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.login(email.trim(), password);
      const { user, token } = res.data.data;
      signIn({ user: { id: user.id, name: user.name, email: user.email }, token });
      addToast({ type: "success", message: `Welcome back, ${user.name.split(" ")[0]}!` });
      navigate(from, { replace: true });
    } catch {
      addToast({ type: "error", message: "Invalid email or password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[420px] px-4 py-10">
      <div className="rounded border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email and password to access your account.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-amazon-orange"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-amazon-orange"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-amazon-orange py-2 text-sm font-semibold text-black hover:bg-amazon-orange-hover disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing you in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-600">
          New to Amazon?{" "}
          <Link to="/signup" className="font-medium text-amazon-link hover:underline">
            Create your account
          </Link>
        </div>
      </div>
    </div>
  );
};
