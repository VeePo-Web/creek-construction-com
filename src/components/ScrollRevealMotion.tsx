import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealMotionProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

// Lazy-evaluate to avoid SSR/hydration mismatch; cache after first access
let _prefersReducedMotion: boolean | null = null;
function prefersReducedMotion() {
  if (_prefersReducedMotion === null) {
    _prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return _prefersReducedMotion;
}

const ScrollRevealMotion = ({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  once = true,
  className,
}: ScrollRevealMotionProps) => {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealMotion;
