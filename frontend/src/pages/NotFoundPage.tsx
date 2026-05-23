import { useNavigate } from "react-router-dom";
import { ErrorState } from "../components/ui/ErrorState";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <ErrorState
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        action={{ label: "Back to Home", onClick: () => navigate("/") }}
      />
    </div>
  );
};
