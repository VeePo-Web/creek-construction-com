import type { ReactNode, CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";

interface ScrollRevealMotionProps {
  children: ReactNode;
  /** Delay in seconds (legacy framer convention; converted to ms internally). */
  delay?: number;
  /** Pixel offset for the slide-up — kept for API compat, no-op now (CSS uses fixed translate-y-3). */
  y?: number;
  /** Kept for API compat — duration is fixed by the CSS class on the hook. */
  duration?: number;
  /** Kept for API compat — the shared observer always unobserves on intersect. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * ScrollRevealMotion — thin compatibility shim over `useReveal`.
 *
 * Originally a framer-motion `<motion.div whileInView>` wrapper. Replaced
 * during the perf pass with a CSS-only IntersectionObserver hook so the
 * site no longer pays the framer-motion bundle cost (~50KB gz) for what
 * is fundamentally an opacity + translateY transition.
 *
 * The component keeps its previous prop shape so the 18 callsites can
 * stay untouched. `y` and `duration` are now no-ops (the hook hard-codes
 * a 12px slide and a 500ms ease-smooth transition); `delay` still works
 * but is converted from seconds → ms.
 */
const ScrollRevealMotion = ({
  children,
  delay = 0,
  className,
  style,
}: ScrollRevealMotionProps) => {
  const { ref, cls, style: revealStyle } = useReveal({
    delay: Math.round(delay * 1000),
  });

  const merged: CSSProperties = { ...revealStyle, ...style };

  return (
    <div
      ref={ref}
      className={className ? `${cls} ${className}` : cls}
      style={merged}
    >
      {children}
    </div>
  );
};

export default ScrollRevealMotion;
