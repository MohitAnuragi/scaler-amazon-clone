import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Breadcrumbs } from "../components/layout/Breadcrumbs";

export const MainLayout = () => {
  const { pathname } = useLocation();
  const showBreadcrumbs = pathname !== "/";

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <Navbar />
      {showBreadcrumbs ? <Breadcrumbs /> : null}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
