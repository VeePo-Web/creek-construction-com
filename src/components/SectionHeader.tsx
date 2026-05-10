import type { ReactNode } from "react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { HEADLINE, BODY } from "@/lib/typography";

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
  const centered = align === "center";

  // Eyebrows, numerals, and counter badges are intentionally not rendered.
  // They added visual clutter; the H2 + optional subhead carry the section.
  void label; void numeral; void badge; void cedarLabel; void variant;

  const Wrap = ({ delay, children }: { delay: number; children: ReactNode }) =>
    disableMotion ? <>{children}</> : <ScrollRevealMotion delay={delay}>{children}</ScrollRevealMotion>;

  return (
    <div className={centered ? "flex flex-col items-center text-center" : ""}>
      <Wrap delay={baseDelay}>
        <h2
          id={headingId}
          className={`${HEADLINE.section} ${subheading ? "mb-6 md:mb-7" : ""} [&:last-child]:mb-0`}
        >
          {heading}
        </h2>
      </Wrap>

      {subheading && (
        <Wrap delay={baseDelay + 0.1}>
          <p className={`${BODY.lead} text-pretty max-w-[56ch] ${centered ? "mx-auto" : ""}`}>
            {subheading}
          </p>
        </Wrap>
      )}
    </div>
  );
};

export default SectionHeader;
