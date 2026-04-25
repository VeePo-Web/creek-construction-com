import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProgressiveImage from "@/components/ProgressiveImage";

interface ImageDividerProps {
  image: string;
  alt: string;
  caption?: string;
  index?: number;
  total?: number;
}

let _prefersReducedMotion: boolean | null = null;
function prefersReducedMotion() {
  if (_prefersReducedMotion === null) {
    _prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return _prefersReducedMotion;
}

const ImageDivider = ({ image, alt, caption, index, total }: ImageDividerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    inner.style.willChange = "transform";
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const vh = window.innerHeight;
          const centerOffset = rect.top + rect.height / 2 - vh / 2;
          const offset = centerOffset * -0.2;
          const clamped = Math.max(-40, Math.min(40, offset));
          inner.style.transform = `scale(1.18) translateY(${clamped}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();
        } else {
          window.removeEventListener("scroll", onScroll);
          inner.style.willChange = "auto";
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (inner) inner.style.willChange = 'auto';
    };
  }, []);

  const indexLabel = index !== undefined && total !== undefined
    ? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    : null;

  return (
    <div
      ref={containerRef}
      className="relative h-[50vh] md:h-[55vh] overflow-hidden group/divider"
      role="img"
      aria-label={alt}
      style={{ contain: 'layout style paint' }}
    >
      <div ref={innerRef} className="absolute inset-0 scale-[1.18]" aria-hidden="true">
        <ProgressiveImage
          src={image}
          alt={alt}
          className="w-full h-full"
          sizes="100vw"
        />
      </div>

      {/* Dual-layer cinematic vignette: top/bottom + radial edge burn */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--foreground) / 0.3) 0%, hsl(var(--foreground) / 0.02) 20%, hsl(var(--foreground) / 0.02) 80%, hsl(var(--foreground) / 0.3) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, hsl(var(--foreground) / 0.15) 100%)",
        }}
      />

      {/* Cedar warmth on hover — dual layer: bottom gradient + radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/divider:opacity-100 transition-opacity duration-1000"
        style={{
          background:
            "linear-gradient(180deg, transparent 20%, hsl(28 50% 52% / 0.06) 50%, hsl(28 50% 52% / 0.12) 80%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/divider:opacity-100 transition-opacity duration-[1.5s]"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 55%, hsl(28 50% 52% / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Center divider line with warm glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px bg-cedar group-hover/divider:w-28 group-hover/divider:shadow-[0_0_16px_hsl(28_50%_52%/0.5),0_0_32px_hsl(28_50%_52%/0.2)] shadow-[0_0_6px_hsl(28_50%_52%/0.15)] transition-[width,box-shadow] duration-1000"
        initial={{ width: 0, opacity: 0 }}
        animate={inView ? { width: 64, opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />

      {/* Thermal crescendo dots flanking the line */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover/divider:opacity-100 transition-opacity duration-700"
        initial={false}
      >
        {[0.15, 0.4, 0.8].map((opacity, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full transition-transform duration-700"
            style={{
              backgroundColor: `hsl(28 50% 52% / ${opacity})`,
              transitionDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </motion.div>

      {/* Index numeral — top right editorial counter */}
      {indexLabel && (
        <motion.div
          className="absolute top-6 right-6 md:top-8 md:right-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-[11px] tracking-[0.2em] tabular-nums font-light text-white/20 group-hover/divider:text-white/50 transition-colors duration-700">
            {indexLabel}
          </span>
        </motion.div>
      )}

      {/* Editorial caption — bottom left with hover slide */}
      {caption && (
        <motion.div
          className="absolute bottom-6 left-6 md:bottom-8 md:left-8"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="flex items-center gap-3 group-hover/divider:gap-4 transition-all duration-700">
            <div className="w-4 h-px bg-cedar/30 group-hover/divider:w-8 group-hover/divider:bg-cedar/60 transition-all duration-700" />
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 group-hover/divider:text-white/65 transition-colors duration-700 select-none">
              {caption}
            </p>
          </div>
        </motion.div>
      )}

      {/* Right-side provenance — editorial symmetry */}
      <motion.div
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 hidden md:block"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-px bg-white/15 group-hover/divider:w-10 group-hover/divider:bg-cedar/30 transition-all duration-700" />
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 group-hover/divider:text-white/40 transition-colors duration-700">
            B&P
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageDivider;
