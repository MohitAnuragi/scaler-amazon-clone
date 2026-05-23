import { Link, Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-gray-900">
            amazon<span className="text-amazon-orange">.in</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-amazon-blue hover:underline">
            Back to shopping
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
