import QuoteFormInline from "@/components/quote/QuoteFormInline";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";

interface InlineQuoteSectionProps {
  background?: "background" | "secondary";
  /** DOM id for the section. Defaults to `section-quote`. */
  id?: string;
  eyebrow?: string;
  heading?: string;
}

/**
 * InlineQuoteSection — homepage funnel terminal #1.
 *
 * Eyebrow + serif headline left, the form right. Trust language lives
 * once at the closer; we don't repeat it here.
 */
const InlineQuoteSection = ({
  background = "secondary",
  id = "section-quote",
  eyebrow = "TELL US WHAT YOU'RE BUILDING",
  heading = "Get a real quote in 24 hours.",
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
            </div>

            <QuoteFormInline surface={background} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InlineQuoteSection;
