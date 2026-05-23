import { calculateDiscount, formatPrice } from "../../utils/formatters";

type PriceDisplayProps = {
  price: number;
  compareAtPrice?: number | null;
  discountPercent?: number;
};

export const PriceDisplay = ({
  price,
  compareAtPrice,
  discountPercent,
}: PriceDisplayProps) => {
  const computedDiscount =
    typeof compareAtPrice === "number"
      ? calculateDiscount(compareAtPrice, price)
      : 0;
  const finalDiscount = discountPercent ?? computedDiscount;

  return (
    <div className="space-y-1">
      <div className="text-lg font-semibold text-black">{formatPrice(price)}</div>
      {compareAtPrice ? (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="line-through">M.R.P: {formatPrice(compareAtPrice)}</span>
          <span className="text-amazon-success">{finalDiscount}% off</span>
        </div>
      ) : null}
    </div>
  );
};
