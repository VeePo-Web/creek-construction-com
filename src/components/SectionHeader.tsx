import type { ReactNode } from "react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { HEADLINE } from "@/lib/typography";

interface SectionHeaderProps {
  /** Roman numeral or number string. Ignored when variant="quiet". */
  numeral?: string;
  /** Uppercase label for the section, e.g. "OUR APPROACH". Optional — when absent, the bronze rule row is skipped. */
  label?: string;
  /** Section heading id for aria-labelledby. */
  headingId: string;
  /** Optional: use cedar color for label (default: muted-foreground). */
  cedarLabel?: boolean;
  /** Main display heading. */
  heading: string;
  /** Italic serif sub-heading. */
  subheading?: string;
  /** Counter badge text. Ignored when variant="quiet". */
  badge?: string;
  /** Delays for staggered reveal. */
  baseDelay?: number;
  /**
   * "default" — full editorial intro (numeral + rule + label + heading
   * + italic subhead + counter badge). Used on sub-pages and on sections
   * the user navigates *to* explicitly.
   *
   * "quiet" — drops the numeral and the badge. Just the rule + label,
   * the heading, and the optional subhead. Use on the homepage where
   * the scroll itself signals progress and the editorial garnish piles up.
   */
  variant?: "default" | "quiet";
  /**
   * Skip the per-line ScrollRevealMotion wrappers. Use when the parent
   * already animates the whole section via `useReveal()` — avoids the
   * "double reveal" jitter and ~4 framer subscriptions per header.
   */
  disableMotion?: boolean;
  /** Horizontal alignment. Defaults to "left" (homepage); pass "center" on sub-page sections. */
  align?: "left" | "center";
}

/**
 * SectionHeader — editorial section intro.
 */
const SectionHeader = ({
  numeral,
  label,
  headingId,
  cedarLabel = false,
  heading,
  subheading,
  badge,
  baseDelay = 0,
  variant = "quiet",
  disableMotion = false,
  align = "left",
}: SectionHeaderProps) => {
  const showNumeral = variant === "default" && numeral;
  const showBadge = variant === "default" && badge;
  const centered = align === "center";

  const Wrap = ({ delay, children }: { delay: number; children: ReactNode }) =>
    disableMotion ? <>{children}</> : <ScrollRevealMotion delay={delay}>{children}</ScrollRevealMotion>;

  return (
    <div className={centered ? "flex flex-col items-center text-center" : ""}>
      {label && (
        <Wrap delay={baseDelay}>
          <p className={`eyebrow mb-5 ${centered ? "text-center" : ""}`}>
            {showNumeral && (
              <span className="text-cedar/55 tabular-nums mr-3">{numeral}</span>
            )}
            {label}
          </p>
        </Wrap>
      )}

      <Wrap delay={baseDelay + 0.1}>
        <h2 id={headingId} className={`${HEADLINE.section} mb-3 [&:last-child]:mb-0`}>{heading}</h2>
      </Wrap>

      {subheading && (
        <Wrap delay={baseDelay + 0.15}>
          <p className="text-base md:text-lg text-muted-foreground mb-6 text-pretty max-w-[56ch]">
            {subheading}
          </p>
        </Wrap>
      )}

      {showBadge && (
        <Wrap delay={baseDelay + 0.2}>
          <p className="eyebrow mt-2">{badge}</p>
        </Wrap>
      )}
    </div>
  );
};

export default SectionHeader;
