import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditorialPictureProps {
  src: string;
  alt: string;
  /** Intrinsic dimensions — required to prevent CLS. */
  width: number;
  height: number;
  /** LQIP base64 string (data URI optional). Renders as a blurred backdrop. */
  lqip?: string | null;
  /** Set true ONLY for the LCP image on a page (one per page). */
  priority?: boolean;
  /** Responsive sizes hint, e.g. "(min-width:1024px) 50vw, 100vw". */
  sizes?: string;
  className?: string;
  /** Extra container class — useful for aspect ratio overrides. */
  wrapperClassName?: string;
  /** Show subtle cedar warmth on hover. */
  cedarHover?: boolean;
}

/**
 * EditorialPicture — the atomic image primitive.
 *
 * Always renders:
 *  - LQIP blurred backdrop (instant, no flash)
 *  - Aspect-ratio-locked container (zero CLS)
 *  - Lazy load by default; eager + fetchpriority high if priority
 *  - Cedar-warmth hover overlay (optional)
 *
 * Pages must always supply width/height/alt — runtime warns if missing.
 *
 * NOTE: AVIF/WebP variants will be auto-served once the process-media
 * function is wired. Until then, this component renders the source
 * directly (which Supabase serves via CDN — fine for now).
 */
const EditorialPicture = ({
  src,
  alt,
  width,
  height,
  lqip,
  priority = false,
  sizes,
  className,
  wrapperClassName,
  cedarHover = false,
}: EditorialPictureProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  if (process.env.NODE_ENV !== "production" && !alt) {
    console.warn("[EditorialPicture] missing alt for", src);
  }

  const aspectRatio = `${width} / ${height}`;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-secondary group",
        wrapperClassName,
      )}
      style={{ aspectRatio, contain: "layout paint style" }}
    >
      {/* LQIP backdrop — blurred placeholder */}
      {lqip && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            loaded ? "opacity-0" : "opacity-100",
          )}
          style={{
            backgroundImage: `url(${lqip.startsWith("data:") ? lqip : `data:image/jpeg;base64,${lqip}`})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {/* No LQIP? Subtle warm fallback so the box isn't stark */}
      {!lqip && !loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(35 18% 90%) 50%, hsl(var(--secondary)) 100%)",
          }}
        />
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        {...(sizes ? { sizes } : {})}
        onLoad={() => setLoaded(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />

      {/* Cedar warmth on hover */}
      {cedarHover && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, hsl(var(--cedar) / 0.12) 100%)",
          }}
        />
      )}
    </div>
  );
};

export default EditorialPicture;
