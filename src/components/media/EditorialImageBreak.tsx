import { useReveal } from "@/hooks/useReveal";

interface EditorialImageBreakProps {
  src: string;
  alt: string;
  /** Desktop aspect — mobile always falls back to 4/3 for closer crop. Default 21/9. */
  aspect?: "21/9" | "16/9" | "3/2";
  /** Edge gradient strength. Default "calm". */
  intensity?: "calm" | "cinematic";
  /** Soft fade into the background colour above. Default true. */
  topBlend?: boolean;
  /** Soft fade into the background colour below. Default true. */
  bottomBlend?: boolean;
  /** Eager-load (only when bleed is above the fold). Default false. */
  priority?: boolean;
  /** Width/height for CLS lock. Default 1920×823 (21:9). */
  width?: number;
  height?: number;
}

const ASPECT_CLASS: Record<NonNullable<EditorialImageBreakProps["aspect"]>, string> = {
  "21/9": "md:aspect-[21/9]",
  "16/9": "md:aspect-[16/9]",
  "3/2": "md:aspect-[3/2]",
};

/**
 * EditorialImageBreak — full-bleed editorial photography between text-heavy
 * sections. Creek's restrained answer to a magazine plate: no overlay copy,
 * cedar-tinted vignette, gentle scale-on-hover, optional top/bottom blends
 * so the image dissolves into the cream surround instead of ending hard.
 *
 * Use to break long type runs (BrandStatement, About story/process/areas,
 * Services contract/FAQ). Never carries text — that's what SectionHeader is for.
 */
const EditorialImageBreak = ({
  src,
  alt,
  aspect = "21/9",
  intensity = "calm",
  topBlend = true,
  bottomBlend = true,
  priority = false,
  width = 1920,
  height = 823,
}: EditorialImageBreakProps) => {
  const { ref, cls, style } = useReveal();

  const edgeOpacity = intensity === "cinematic" ? 0.35 : 0.22;
  const vignetteOpacity = intensity === "cinematic" ? 0.12 : 0.08;

  return (
    <section
      ref={ref}
      aria-label="Editorial photograph"
      className={`relative w-full overflow-hidden bg-background ${cls}`}
      style={style}
    >
      {topBlend && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16 md:h-24 z-10 pointer-events-none bg-gradient-to-b from-background to-transparent"
        />
      )}

      <div
        className={`relative aspect-[4/3] ${ASPECT_CLASS[aspect]} w-full overflow-hidden group`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="block w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        {/* Cedar-tinted vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 55%, hsl(var(--cedar) / ${vignetteOpacity}) 100%)`,
          }}
        />

        {/* Cinematic side bleeds */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/4 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, hsl(var(--background) / ${edgeOpacity}), transparent)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-1/4 pointer-events-none"
          style={{
            background: `linear-gradient(270deg, hsl(var(--background) / ${edgeOpacity}), transparent)`,
          }}
        />
      </div>

      {bottomBlend && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 md:h-24 z-10 pointer-events-none bg-gradient-to-t from-background to-transparent"
        />
      )}
    </section>
  );
};

export default EditorialImageBreak;
