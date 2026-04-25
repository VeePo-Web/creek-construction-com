import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AmbientVideoBleedProps {
  src: string;
  /** Optional poster — first frame fallback. */
  poster?: string;
  /** Aspect ratio container (e.g. "21 / 9"). Defaults to "21 / 9". */
  aspectRatio?: string;
  /** Override height (e.g. "32vh") — used for full-bleed strips. */
  height?: string;
  /** Opacity overlay for compositing under copy (0–1). */
  opacity?: number;
  className?: string;
  /** When true, the video is decorative (no narrative) — sets aria-hidden. */
  decorative?: boolean;
  /** Description for non-decorative videos (announced by assistive tech). */
  ariaLabel?: string;
}

/**
 * AmbientVideoBleed — silent looping video as ambient texture.
 *
 * Discipline (the Five Video Laws):
 *  1. Always muted, playsinline, autoplay, loop — never with sound.
 *  2. Always a poster fallback.
 *  3. IntersectionObserver pauses off-screen — saves battery.
 *  4. prefers-reduced-motion → renders the poster as a still image.
 *  5. Save-Data → also falls back to poster.
 *
 * The component lazy-mounts the <video> only when the section enters the
 * viewport, so 7 video bleeds across one page never load 7 video files
 * upfront — only the visible ones.
 */
const AmbientVideoBleed = ({
  src,
  poster,
  aspectRatio = "21 / 9",
  height,
  opacity = 1,
  className,
  decorative = true,
  ariaLabel,
}: AmbientVideoBleedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Respect Save-Data
  useEffect(() => {
    const c = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (c?.saveData) setSaveData(true);
  }, []);

  // Lazy mount + pause when off-screen
  useEffect(() => {
    if (reducedMotion || saveData) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldRender(true);
            // Try to play once mounted
            const v = videoRef.current;
            if (v && v.paused) v.play().catch(() => undefined);
          } else {
            // Pause to save battery; keep mounted so resume is instant
            const v = videoRef.current;
            if (v && !v.paused) v.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion, saveData]);

  const fallbackToPoster = reducedMotion || saveData;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden bg-evergreen", className)}
      style={{
        aspectRatio: height ? undefined : aspectRatio,
        height,
        contain: "layout paint style",
      }}
      aria-hidden={decorative}
      {...(!decorative && ariaLabel ? { "aria-label": ariaLabel } : {})}
    >
      {fallbackToPoster ? (
        poster ? (
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity }}
          />
        ) : (
          // No poster + reduced motion → just a quiet evergreen surface
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 60%, hsl(150 30% 18%) 0%, hsl(150 30% 8%) 100%)",
            }}
          />
        )
      ) : (
        shouldRender && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
            disablePictureInPicture
            preload="metadata"
            poster={poster}
            style={{ opacity }}
            // Ensure muted is enforced even if a script tries to flip it
            onVolumeChange={(e) => {
              const v = e.currentTarget;
              if (!v.muted) v.muted = true;
            }}
          >
            <source src={src} type={inferType(src)} />
          </video>
        )
      )}
    </div>
  );
};

function inferType(src: string): string {
  const lower = src.toLowerCase();
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mov")) return "video/quicktime";
  if (lower.endsWith(".m4v")) return "video/mp4";
  return "video/mp4";
}

export default AmbientVideoBleed;
