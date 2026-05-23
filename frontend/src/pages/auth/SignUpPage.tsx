import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { apiClient } from "../../config/api";
import { LoadingState } from "../../components/ui/LoadingState";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { status, hydrated, signIn } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hydrated || status === "loading") {
    return (
      <div className="mx-auto max-w-[1500px] px-4">
        <LoadingState title="Preparing sign-up" description="Setting up your account." />
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
      const res = await apiClient.signup({ email, password, firstName, lastName });
      const { user, token } = res.data.data;
      signIn({ user: { id: user.id, name: user.name, email: user.email }, token });
      addToast({ type: "success", message: "Account created successfully!" });
      navigate("/account", { replace: true });
    } catch {
      addToast({ type: "error", message: "Sign up failed. Email may already be in use." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[420px] px-4 py-10">
      <div className="rounded border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
        <p className="mt-1 text-sm text-gray-500">Join Amazon.in to track orders and save items.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-amazon-orange"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-amazon-orange"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-amazon-orange"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-amazon-orange"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-amazon-orange py-2 text-sm font-semibold text-black hover:bg-amazon-orange-hover disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create your Amazon account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-amazon-link hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
