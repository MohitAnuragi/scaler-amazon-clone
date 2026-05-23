import { Link, matchPath, useLocation } from "react-router-dom";
import { breadcrumbRoutes } from "../../config/navigation";

const resolveLabel = (path: string) => {
  const match = breadcrumbRoutes.find((route) =>
    matchPath({ path: route.path, end: true }, path)
  );
  return match?.label;
};

export const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const crumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    const label =
      resolveLabel(path) ||
      decodeURIComponent(segment).replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    return { path, label };
  });

  return (
    <nav className="border-b bg-white" aria-label="Breadcrumb">
      <div className="mx-auto max-w-[1500px] px-4 py-3 text-sm text-gray-600">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/" className="font-medium text-gray-700 hover:text-black">
            Home
          </Link>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <div key={crumb.path} className="flex items-center gap-2">
                <span className="text-gray-400">/</span>
                {isLast ? (
                  <span className="font-medium text-gray-900">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-black">
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
