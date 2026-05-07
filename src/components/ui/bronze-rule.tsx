import { cn } from "@/lib/utils";
import { EYEBROW } from "@/lib/typography";

interface BronzeRuleProps {
  /** Optional roman numeral or short tag rendered before the rule. */
  numeral?: string;
  /** Eyebrow label rendered after the rule. */
  label?: string;
  /** Eyebrow color context. Defaults to muted-foreground on light surfaces. */
  variant?: "default" | "accent" | "onDark";
  /** Length of the divider stroke. Default: 32px. */
  width?: "short" | "default" | "long";
  className?: string;
}

const widthMap = {
  short: "w-6",
  default: "w-10",
  long: "w-12 sm:w-14 md:w-16",
} as const;

const labelClass = {
  default: EYEBROW.default,
  accent: EYEBROW.accent,
  onDark: EYEBROW.onDark,
} as const;

/**
 * BronzeRule — the canonical editorial header divider.
 *
 *   numeral  —————  EYEBROW LABEL
 *
 * Replaces ~15 hand-rolled `<div className="w-X h-px bg-cedar/Y">` blocks
 * across Hero, About, FeaturedProjects, Services. Always renders the
 * numeral with tabular-nums and consistent letter-spacing.
 */
const BronzeRule = ({
  numeral,
  label,
  variant = "default",
  width = "default",
  className,
}: BronzeRuleProps) => {
  return (
    <div className={cn("flex items-center gap-4", className)} aria-hidden={!label}>
      {numeral && (
        <span className="text-[11px] tracking-[0.2em] text-cedar/50 font-light tabular-nums">
          {numeral}
        </span>
      )}
      <div className={cn(widthMap[width], "h-px bg-cedar/30")} />
      {label && <span className={labelClass[variant]}>{label}</span>}
    </div>
  );
};

export default BronzeRule;
