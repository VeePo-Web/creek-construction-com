import { cn } from "@/lib/utils";
import { HEADLINE } from "@/lib/typography";

export type KineticSize = "display" | "cinematic" | "service" | "compact";

interface KineticHeadlineProps {
  /**
   * Each entry is rendered as its own line with a staggered clip-reveal.
   * Two short lines (4–6 words each) reads best.
   */
  lines: string[];
  /**
   * Optional italic-serif accent line, set in cedar, with a hairline
   * underline that draws after the line lifts in. Used as the punctuation
   * tail (e.g. "Pride in every detail.").
   */
  italic?: string;
  /** Visual scale tier. */
  size?: KineticSize;
  /** Stagger between successive lines, in ms. Default 140. */
  staggerMs?: number;
  /** Initial delay before the first line begins, in ms. Default 200. */
  initialDelayMs?: number;
  /** Use the dark-surface treatment (evergreen → cream). */
  onDark?: boolean;
  /** Render as <h1> by default; pages may pass <h2> for sub-page heroes. */
  as?: "h1" | "h2";
  /** Override the headline className. */
  className?: string;
  /** Additional class for the italic line. */
  italicClassName?: string;
  /** ARIA label override; otherwise concatenates lines + italic. */
  ariaLabel?: string;
}

const SIZE_TO_FONT: Record<KineticSize, string> = {
  // Largest — homepage hero
  display:
    "font-serif leading-[1.02] tracking-tight text-balance",
  // Cinematic — full-bleed work hero
  cinematic:
    "font-serif leading-[1.04] tracking-tight text-balance",
  // Mid — services / projects
  service: HEADLINE.display,
  // Quiet — about / contact / sub-pages
  compact: HEADLINE.section,
};

const SIZE_TO_INLINE: Record<KineticSize, string> = {
  display: "clamp(2.75rem, 6.4vw, 6rem)",
  cinematic: "clamp(2.75rem, 6vw, 5.5rem)",
  service: "clamp(2.25rem, 4.5vw, 4rem)",
  compact: "clamp(2rem, 3.5vw, 3.25rem)",
};

const ITALIC_SCALE: Record<KineticSize, string> = {
  display: "0.6em",
  cinematic: "0.55em",
  service: "0.55em",
  compact: "0.6em",
};

/**
 * KineticHeadline — line-by-line clip reveal with optional italic tail.
 *
 * Editorial discipline:
 *   - Splits the title into discrete <span> lines so each can land on its own beat.
 *   - The italic tail draws a hairline underline 380ms after the line lifts in.
 *   - Honors prefers-reduced-motion at the source — see src/index.css.
 *   - Screen readers receive the full string via aria-label; visual lines are aria-hidden.
 *
 * Use this everywhere a hero <h1> is needed. Never compose the animation by hand.
 *
 * @example
 *   <KineticHeadline
 *     lines={["Excellence in", "the Work."]}
 *     italic="Pride in every detail."
 *     size="display"
 *     onDark
 *   />
 */
const KineticHeadline = ({
  lines,
  italic,
  size = "display",
  staggerMs = 140,
  initialDelayMs = 200,
  onDark = false,
  as = "h1",
  className,
  italicClassName,
  ariaLabel,
}: KineticHeadlineProps) => {
  const Tag = as;
  const labelText = ariaLabel ?? [...lines, italic].filter(Boolean).join(" ");

  const colorClass = onDark
    ? "text-evergreen-foreground"
    : "text-foreground";

  const italicColorClass = onDark
    ? "text-cedar/95"
    : "text-cedar";

  return (
    <Tag
      aria-label={labelText}
      className={cn(SIZE_TO_FONT[size], colorClass, "mb-0", className)}
      style={{ fontSize: SIZE_TO_INLINE[size] }}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="kinetic-line"
          style={
            {
              "--kinetic-delay": `${initialDelayMs + i * staggerMs}ms`,
            } as React.CSSProperties
          }
        >
          {line}
        </span>
      ))}
      {italic && (
        <span className="block mt-3 md:mt-4">
          <span
            aria-hidden="true"
            className={cn(
              "kinetic-italic font-serif italic",
              italicColorClass,
              italicClassName,
            )}
            style={
              {
                fontSize: ITALIC_SCALE[size],
                "--kinetic-delay": `${initialDelayMs + lines.length * staggerMs + 220}ms`,
              } as React.CSSProperties
            }
          >
            {italic}
          </span>
        </span>
      )}
    </Tag>
  );
};

export default KineticHeadline;
