import CedarCTA from "@/components/CedarCTA";
import { SECTION_PADDING } from "@/lib/spacing";

interface QuoteCloserCardProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  preselectServices?: string[];
  asSection?: boolean;
  id?: string;
  background?: "background" | "secondary";
}

/**
 * QuoteCloserCard — the single canonical "ask" used across every public page.
 * Pass 33: flat evergreen plate, no grain, no gradient. Trust signals
 * collapse to a single calm middle-dot line under the CTA.
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
    <div className="relative bg-evergreen overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-cedar">
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
        <p className="eyebrow text-cedar/80 mb-4">{eyebrow}</p>
        <h2 className="font-serif text-evergreen-foreground text-3xl sm:text-4xl md:text-[40px] lg:text-5xl xl:text-[56px] leading-[1.1] tracking-[-0.02em] text-pretty mb-5 max-w-[22ch]">
          {heading}
        </h2>
        <p className="text-evergreen-foreground/70 leading-relaxed mb-8 max-w-[52ch]">
          {body}
        </p>

        <CedarCTA preselectServices={preselectServices}>Get my free quote</CedarCTA>

        <p className="mt-6 text-[11px] tracking-[0.22em] uppercase text-evergreen-foreground/55">
          Free · No obligation · 24-hour reply
        </p>
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
      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">{card}</div>
      </div>
    </section>
  );
};

export default QuoteCloserCard;
