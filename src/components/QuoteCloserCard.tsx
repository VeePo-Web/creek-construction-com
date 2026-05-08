import CedarCTA from "@/components/CedarCTA";
import { TRUST_SIGNALS } from "@/config/trust-signals";
import { BACKDROP } from "@/lib/colors";
import { SECTION_PADDING } from "@/lib/spacing";

interface QuoteCloserCardProps {
  /** Eyebrow over the headline. Defaults to "What's next". */
  eyebrow?: string;
  /** Big serif headline. */
  heading?: string;
  /** Supporting paragraph. */
  body?: string;
  /** Pre-select these service ids in the QuoteModal. */
  preselectServices?: string[];
  /** Wrap in its own <section> with vertical padding. Default true. */
  asSection?: boolean;
  /** Override the section id. Default "section-closer". */
  id?: string;
  /** Background tone when rendered as a section. Default "background". */
  background?: "background" | "secondary";
}

/**
 * QuoteCloserCard — the single canonical "ask" used across every public page.
 *
 * Cedar-bordered evergreen plate: eyebrow → headline → body → primary
 * CedarCTA → trust strip. Trust language is owned here and nowhere else.
 */
const QuoteCloserCard = ({
  eyebrow = "What’s next",
  heading = "Tell us about your project.",
  body = "It takes about 30 seconds — your phone and name to start. We reply within 24–48 hours.",
  preselectServices,
  asSection = true,
  id = "section-closer",
  background = "background",
}: QuoteCloserCardProps) => {
  const card = (
    <div
      className="rounded-sm overflow-hidden relative md:grain-texture before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] md:before:w-[3px] before:bg-cedar"
      style={{
        background: BACKDROP.evergreenCard,
      }}
    >
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
        <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-4">
          {eyebrow}
        </p>
        <h2 className="font-serif text-evergreen-foreground text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.1] tracking-[-0.02em] text-pretty mb-5 max-w-[20ch] md:max-w-[28ch] lg:max-w-[34ch]">
          {heading}
        </h2>
        <p className="text-evergreen-foreground/70 leading-relaxed mb-8 max-w-[52ch]">
          {body}
        </p>

        <CedarCTA preselectServices={preselectServices}>Get my free quote</CedarCTA>

        <div
          className="mt-8 pt-6 border-t border-evergreen-foreground/10 flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-5 md:gap-y-2.5"
          aria-label="Trust signals"
        >
          {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-evergreen-foreground/55"
            >
              <Icon className="h-2 w-2 md:h-2.5 md:w-2.5 text-cedar/80" aria-hidden strokeWidth={1.6} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (!asSection) return card;

  return (
    <section
      id={id}
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"}`}
      aria-label="Request a quote"
    >
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">{card}</div>
      </div>
    </section>
  );
};

export default QuoteCloserCard;
