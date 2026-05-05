import SectionHeader from "@/components/SectionHeader";
import FaqAccordion, { type FaqItem } from "@/components/ui/faq-accordion";
import CedarCTA from "@/components/CedarCTA";
import { FAQS_CORE } from "@/config/faqs";
import { SECTION_PADDING } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";

interface MiniFaqProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items?: FaqItem[];
  asSection?: boolean;
  background?: "background" | "secondary";
  showCta?: boolean;
}

/**
 * MiniFaq — shared 4-question accordion used on Home, Services, Contact.
 * Wraps FaqAccordion with the canonical SectionHeader + optional trailing CTA.
 */
const MiniFaq = ({
  eyebrow = "COMMON QUESTIONS",
  heading = "Straight answers.",
  subheading = "If we don’t address yours, ask on the call — we always pick up.",
  items = FAQS_CORE,
  asSection = true,
  background = "background",
  showCta = true,
}: MiniFaqProps) => {
  const { ref, cls, style } = useReveal();

  const inner = (
    <div ref={ref} className={`max-w-3xl mx-auto ${cls}`} style={style}>
      <SectionHeader
        variant="quiet"
        label={eyebrow}
        headingId="faq-heading"
        heading={heading}
        subheading={subheading}
      />
      <FaqAccordion items={items} className="mt-10" />
      {showCta && (
        <div className="mt-12 flex justify-center">
          <CedarCTA />
        </div>
      )}
    </div>
  );

  if (!asSection) return inner;

  return (
    <section
      id="section-faq"
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"}`}
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-6">{inner}</div>
    </section>
  );
};

export default MiniFaq;
