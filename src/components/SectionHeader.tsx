import ScrollRevealMotion from "@/components/ScrollRevealMotion";

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
 * Renders: numeral · divider · label, then heading, subheading, and optional badge.
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
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">
            {numeral}
          </span>
          <div className="w-8 h-px bg-cedar/20" />
          <span
            className={`text-minimal ${cedarLabel ? "text-cedar" : "text-muted-foreground"}`}
          >
            {label}
          </span>
        </div>
      </ScrollRevealMotion>

      <ScrollRevealMotion delay={baseDelay + 0.1}>
        <h2 id={headingId} className="text-display text-foreground mb-4">{heading}</h2>
      </ScrollRevealMotion>

      {subheading && (
        <ScrollRevealMotion delay={baseDelay + 0.15}>
          <p className="text-subhead text-foreground/60 italic font-serif mb-8">
            {subheading}
          </p>
        </ScrollRevealMotion>
      )}

      {badge && (
        <ScrollRevealMotion delay={baseDelay + 0.2}>
          <div className="flex items-center gap-3" aria-label={badge}>
            <div className="w-12 h-px bg-cedar/15" />
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">
              {badge}
            </span>
          </div>
        </ScrollRevealMotion>
      )}
    </>
  );
};

export default SectionHeader;
