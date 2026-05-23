type StarRatingProps = {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: number;
};

export const StarRating = ({
  rating,
  size = 16,
  showCount = true,
  count,
}: StarRatingProps) => {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div className="flex items-center gap-1 text-sm text-gray-700">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            style={{ fontSize: size }}
            className={index < Math.round(rounded) ? "text-amazon-star" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && typeof count === "number" && (
        <span className="text-xs text-gray-600">({count.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
};
