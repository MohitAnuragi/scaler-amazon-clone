type LoadingStateProps = {
  title?: string;
  description?: string;
};

export const LoadingState = ({
  title = "Loading",
  description = "Getting things ready for you.",
}: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-600">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-amazon-orange" />
      <div className="text-sm font-semibold text-gray-700">{title}</div>
      {description ? <p className="text-xs text-gray-500">{description}</p> : null}
    </div>
  );
};
