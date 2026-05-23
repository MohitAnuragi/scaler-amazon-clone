type ErrorStateProps = {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
};

export const ErrorState = ({ title, description, action }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center rounded bg-white p-8 text-center shadow-sm">
    <div className="mb-3 text-3xl">🐶</div>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
    {action && (
      <button
        className="mt-4 rounded bg-amazon-yellow px-4 py-2 text-sm font-semibold hover:bg-amazon-yellow-hover"
        onClick={action.onClick}
      >
        {action.label}
      </button>
    )}
  </div>
);
