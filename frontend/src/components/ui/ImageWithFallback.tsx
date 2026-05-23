import { useMemo, useState } from "react";
import { getFallbackImageSrc } from "../../utils/imageFallbacks";
import type { CSSProperties } from "react";

type ImageWithFallbackProps = {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  categorySlug?: string | null;
  categoryName?: string | null;
  productName?: string | null;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  style?: CSSProperties;
};

export const ImageWithFallback = ({
  src,
  alt,
  className = "",
  containerClassName = "",
  fallbackSrc,
  categorySlug,
  categoryName,
  productName,
  loading = "lazy",
  decoding = "async",
  style,
}: ImageWithFallbackProps) => {
  const resolvedFallback = useMemo(
    () =>
      fallbackSrc ??
      getFallbackImageSrc({
        categorySlug,
        categoryName,
        productName,
        altText: alt,
      }),
    [alt, categoryName, categorySlug, fallbackSrc, productName]
  );

  const initialSrc = src && src.trim().length > 0 ? src : resolvedFallback;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    // First attempt: switch to resolved fallback (category/local)
    if (currentSrc !== resolvedFallback) {
      setCurrentSrc(resolvedFallback);
      return;
    }
    // Final fallback: local no-image placeholder to avoid broken icon
    const final = '/assets/images/no-image.svg';
    if (currentSrc !== final) {
      setCurrentSrc(final);
      return;
    }
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`.trim()}>
      {!isLoaded && <div className="absolute inset-0 shimmer" aria-hidden="true" />}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} transition-opacity duration-200 ${isLoaded ? "opacity-100" : "opacity-0"}`.trim()}
        style={style}
        loading={loading}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </div>
  );
};
