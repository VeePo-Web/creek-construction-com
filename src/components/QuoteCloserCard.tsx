import CedarCTA from "@/components/CedarCTA";
import { SECTION_PADDING } from "@/lib/spacing";
import { HEADLINE } from "@/lib/typography";
import { cn } from "@/lib/utils";

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
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className={cn(HEADLINE.section, "text-evergreen-foreground leading-[1.1] mb-5 max-w-[22ch]")}>
          {heading}
        </h2>
        <p className="text-evergreen-foreground/70 leading-relaxed mb-8 max-w-[52ch]">
          {body}
        </p>

        <CedarCTA preselectServices={preselectServices}>Get my free quote</CedarCTA>

        <p className="mt-6 eyebrow opacity-55">
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
