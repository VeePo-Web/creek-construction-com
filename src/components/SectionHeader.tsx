import type { ReactNode } from "react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import BronzeRule from "@/components/ui/bronze-rule";
import { HEADLINE } from "@/lib/typography";

interface SectionHeaderProps {
  /** Roman numeral or number string. Ignored when variant="quiet". */
  numeral?: string;
  /** Uppercase label for the section, e.g. "OUR APPROACH". */
  label: string;
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
}

/**
 * SectionHeader — editorial section intro.
 *
 * In default mode this composes BronzeRule (numeral + rule + eyebrow)
 * + heading + italic subheading + counter badge.
 *
 * In "quiet" mode the numeral and the counter badge are dropped — the
 * eyebrow + headline + subhead carry the section alone. This is the
 * Fantasy.co reduction principle: the second time a page says something,
 * it should say it more quietly.
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
  variant = "default",
  disableMotion = false,
}: SectionHeaderProps) => {
  const showNumeral = variant === "default" && numeral;
  const showBadge = variant === "default" && badge;

  const Wrap = ({ delay, children }: { delay: number; children: ReactNode }) =>
    disableMotion ? <>{children}</> : <ScrollRevealMotion delay={delay}>{children}</ScrollRevealMotion>;

  return (
    <>
      <Wrap delay={baseDelay}>
        <BronzeRule
          numeral={showNumeral ? numeral : undefined}
          label={label}
          variant={cedarLabel ? "accent" : "default"}
          className="mb-6"
        />
      </Wrap>

      <Wrap delay={baseDelay + 0.1}>
        <h2 id={headingId} className={`${HEADLINE.section} mb-4`}>{heading}</h2>
      </Wrap>

      {subheading && (
        <Wrap delay={baseDelay + 0.15}>
          <p className="text-subhead text-foreground/60 italic font-serif mb-8 text-balance">
            {subheading}
          </p>
        </Wrap>
      )}

      {showBadge && (
        <Wrap delay={baseDelay + 0.2}>
          <BronzeRule label={badge!} variant="default" width="long" />
        </Wrap>
      )}
    </>
  );
};

export default SectionHeader;
