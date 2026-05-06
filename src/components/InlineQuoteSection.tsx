import { Check } from "lucide-react";
import QuoteFormInline from "@/components/quote/QuoteFormInline";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";

interface InlineQuoteSectionProps {
  background?: "background" | "secondary";
  /** DOM id for the section. Defaults to `section-quote`. */
  id?: string;
  eyebrow?: string;
  heading?: string;
  bullets?: string[];
}

/**
 * InlineQuoteSection — homepage funnel terminal #1.
 *
 * FlexServices puts the form between the hero and the services so the
 * impatient lead never has to scroll the whole page. Creek does the same,
 * but in editorial voice: serif headline + 3 trust bullets on the left,
 * the actual form on the right.
 *
 * The closer card at the bottom of the page remains for considered leads.
 */
const InlineQuoteSection = ({
  background = "secondary",
  id = "section-quote",
  eyebrow = "TELL US WHAT YOU'RE BUILDING",
  heading = "Get a real quote in 24 hours.",
  bullets = [
    "Free, written, no obligation.",
    "We quote what we’ll actually charge.",
    "Calgary, Edmonton & surrounding Alberta.",
  ],
}: InlineQuoteSectionProps) => {
  const { ref, cls, style } = useReveal();
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"}`}
      aria-labelledby={headingId}
    >
      <div className="container mx-auto px-6">
        <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
          <div className={`grid lg:grid-cols-[5fr_7fr] ${GRID_GAP.editorial} items-start`}>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-3">{eyebrow}</p>
              <h2
                id={headingId}
                className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.05] tracking-tight"
              >
                {heading}
              </h2>
              <ul className="mt-8 space-y-3" role="list">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-cedar/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-cedar" aria-hidden />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <QuoteFormInline surface={background} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InlineQuoteSection;
