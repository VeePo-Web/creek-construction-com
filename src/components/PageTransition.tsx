import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const variants = {
  initial: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0.1 : 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : -8,
    transition: {
      duration: prefersReducedMotion ? 0.1 : 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const curtainVariants = {
  initial: { scaleY: 0 },
  animate: {
    scaleY: [0, 1, 1, 0],
    transition: {
      duration: 0.65,
      times: [0, 0.3, 0.5, 1],
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
};

/* Cedar accent line slides across the curtain midpoint */
const accentVariants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: [0, 1, 1, 0],
    opacity: [0, 0.6, 0.6, 0],
    transition: {
      duration: 0.65,
      times: [0.1, 0.35, 0.55, 0.9],
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/* Three thermal-crescendo embers pulse at staggered delays */
const emberVariants = (delay: number) => ({
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: [0, 1, 1, 0],
    scale: [0.4, 1, 1, 0.4],
    transition: {
      duration: 0.6,
      delay,
      times: [0, 0.3, 0.6, 1],
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
});

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Cedar curtain overlay — full-screen wipe */}
          {!prefersReducedMotion && (
            <motion.div
              className="fixed inset-0 z-[60] pointer-events-none"
              style={{ transformOrigin: "top", contain: "strict" }}
              variants={curtainVariants}
              initial="initial"
              animate="animate"
            >
              {/* Gradient background — dark charcoal to warm cedar undertone */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(20 10% 6%) 0%, hsl(20 10% 8%) 30%, hsl(25 15% 12%) 70%, hsl(28 20% 14%) 100%)",
                }}
              />
              {/* Subtle grain texture on the curtain */}
              <div className="absolute inset-0 grain-overlay" />

              {/* Cedar accent line at midpoint */}
              <motion.div
                className="absolute top-1/2 left-0 right-0 h-[1px]"
                style={{
                  transformOrigin: "left",
                  background:
                    "linear-gradient(90deg, transparent, hsl(28 50% 52% / 0.6) 30%, hsl(28 50% 52% / 0.8) 50%, hsl(28 50% 52% / 0.6) 70%, transparent)",
                  boxShadow: "0 0 12px hsl(28 50% 52% / 0.3), 0 0 24px hsl(28 50% 52% / 0.1)",
                }}
                variants={accentVariants}
                initial="initial"
                animate="animate"
              />

              {/* Thermal crescendo embers — three rising dots */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                {[0.15, 0.4, 0.8].map((opacity, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: `hsl(28 50% 52% / ${opacity})` }}
                    variants={emberVariants(0.15 + i * 0.06)}
                    initial="initial"
                    animate="animate"
                  />
                ))}
              </div>
            </motion.div>
          )}
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
