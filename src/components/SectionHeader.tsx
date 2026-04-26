import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import BronzeRule from "@/components/ui/bronze-rule";
import { HEADLINE } from "@/lib/typography";

interface SectionHeaderProps {
  /** Roman numeral or number string, e.g. "I", "II", "03" */
  numeral: string;
  /** Uppercase label for the section, e.g. "THE RITUAL" */
  label: string;
  /** Section heading id for aria-labelledby */
  headingId: string;
  /** Optional: use cedar color for label (default: muted-foreground) */
  cedarLabel?: boolean;
  /** Main display heading */
  heading: string;
  /** Italic serif sub-heading */
  subheading?: string;
  /** Counter badge text, e.g. "03 Truths" */
  badge?: string;
  /** Delays for staggered reveal */
  baseDelay?: number;
}

/**
 * SectionHeader — editorial section intro used across all homepage sections.
 * Composes BronzeRule (numeral + rule + eyebrow) + heading + subheading + badge.
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
}: SectionHeaderProps) => {
  return (
    <>
      <ScrollRevealMotion delay={baseDelay}>
        <BronzeRule
          numeral={numeral}
          label={label}
          variant={cedarLabel ? "accent" : "default"}
          className="mb-6"
        />
      </ScrollRevealMotion>

      <ScrollRevealMotion delay={baseDelay + 0.1}>
        <h2 id={headingId} className={`${HEADLINE.section} mb-4`}>{heading}</h2>
      </ScrollRevealMotion>

      {subheading && (
        <ScrollRevealMotion delay={baseDelay + 0.15}>
          <p className="text-subhead text-foreground/60 italic font-serif mb-8 text-balance">
            {subheading}
          </p>
        </ScrollRevealMotion>
      )}

      {badge && (
        <ScrollRevealMotion delay={baseDelay + 0.2}>
          <BronzeRule label={badge} variant="default" width="long" />
        </ScrollRevealMotion>
      )}
    </>
  );
};

export default SectionHeader;
