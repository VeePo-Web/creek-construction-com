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
  eyebrow: _eyebrow,
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
        <h2 className={cn(HEADLINE.section, "text-evergreen-foreground leading-[1.1] mb-5 max-w-[22ch]")}>
          {heading}
        </h2>
        <p className="font-sans text-evergreen-foreground/75 text-[15px] sm:text-base leading-[1.65] text-balance mb-8 max-w-[52ch]">
          {body}
        </p>

        <CedarCTA preselectServices={preselectServices}>Get my free quote</CedarCTA>
      </div>
    </div>
  );

  if (!asSection) return card;

  return (
    <section
      id={id}
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"} min-h-[100svh] flex flex-col justify-center`}
      aria-label="Request a quote"
    >
      <div className="container-page">
        <div className="max-w-4xl mx-auto">{card}</div>
      </div>
    </section>
  );
};

export default QuoteCloserCard;
