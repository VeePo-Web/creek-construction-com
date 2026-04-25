import { useState, useCallback, useRef, useEffect } from "react";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Additional overlay styles (vignettes, gradients) */
  overlayStyle?: React.CSSProperties;
  /** Cedar warmth overlay on hover */
  cedarHover?: boolean;
  /** Provenance caption shown on hover */
  caption?: string;
  /** Counter label e.g. "01/03" */
  counter?: string;
  /** fetchPriority for LCP images */
  priority?: boolean;
  /** Responsive sizes hint for resource selection */
  sizes?: string;
}

/**
 * Premium progressive image with blur-up reveal, cinematic vignette,
 * and optional cedar-warmth hover. Respects prefers-reduced-motion.
 */
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ProgressiveImage = ({
  src,
  alt,
  className = "",
  overlayStyle,
  cedarHover = true,
  caption,
  counter,
  priority = false,
  sizes,
}: ProgressiveImageProps) => {
  const [loaded, setLoaded] = useState(prefersReducedMotion);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image is already cached, mark loaded immediately
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    <div className={`relative overflow-hidden rounded-sm group ${className}`} style={{ contain: 'layout style' }}>
      {/* Placeholder shimmer while loading — dual-layer cedar warmth */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        {/* Base warm tone */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(25 15% 92%) 50%, hsl(var(--secondary)) 100%)',
        }} />
        {/* Sweeping cedar shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, transparent 35%, hsl(var(--cedar) / 0.06) 45%, hsl(var(--cedar) / 0.1) 50%, hsl(var(--cedar) / 0.06) 55%, transparent 65%, transparent 100%)",
            backgroundSize: "300% 100%",
            animation: loaded ? "none" : "img-shimmer 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
        {/* Subtle pulsing cedar ember at center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-1 h-1 rounded-full"
            style={{
              backgroundColor: 'hsl(var(--cedar) / 0.2)',
              animation: loaded ? "none" : "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Actual image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width="1200"
        height="800"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        {...(sizes ? { sizes } : {})}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-all duration-1000 ${
          prefersReducedMotion ? "" : "group-hover:scale-105"
        } ${
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-[1.02]"
        }`}
        style={loaded ? undefined : { willChange: "opacity, transform, filter" }}
      />

      {/* Cinematic vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={
          overlayStyle ?? {
            background:
              "linear-gradient(180deg, hsl(var(--foreground) / 0.15) 0%, transparent 25%, transparent 75%, hsl(var(--foreground) / 0.2) 100%), radial-gradient(ellipse at center, transparent 50%, hsl(20 10% 8% / 0.12) 100%)",
          }
        }
      />

      {/* Cedar warmth on hover */}
      {cedarHover && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, hsl(28 50% 52% / 0.12) 100%)",
          }}
        />
      )}

      {/* Provenance caption */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0 flex items-end justify-between">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/60">
            {caption}
          </p>
          {counter && (
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/30">
              {counter}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
