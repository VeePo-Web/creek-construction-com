import { Phone } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import FaqAccordion, { type FaqItem } from "@/components/ui/faq-accordion";
import CedarCTA from "@/components/CedarCTA";
import { FAQS_CORE } from "@/config/faqs";
import { CONTACT } from "@/config/contact";
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
  /** Show "Have more questions? Call …" tel-link below the accordion. */
  showPhoneFallback?: boolean;
  /** Override heading id (only needed if two FAQs share one page). */
  headingId?: string;
}

/**
 * MiniFaq — shared 4-question accordion used on Home, Services, Contact.
 * Wraps FaqAccordion with the canonical SectionHeader + optional trailing
 * CedarCTA + phone-fallback row. The phone fallback is the FlexServices
 * pattern: every objection-killer ends with a tel link for users who
 * still prefer to talk.
 */
const MiniFaq = ({
  eyebrow = "COMMON QUESTIONS",
  heading = "Straight answers.",
  subheading = "If we don’t address yours, ask on the call — we always pick up.",
  items = FAQS_CORE,
  asSection = true,
  background = "background",
  showCta = false,
  showPhoneFallback = true,
  headingId = "faq-heading",
}: MiniFaqProps) => {
  const { ref, cls, style } = useReveal();

  const inner = (
    <div ref={ref} className={`max-w-3xl mx-auto ${cls}`} style={style}>
      <SectionHeader
        variant="quiet"
        label={eyebrow}
        headingId={headingId}
        heading={heading}
        subheading={subheading}
        disableMotion
      />
      <FaqAccordion items={items} className="mt-10" />
      {showPhoneFallback && (
        <div className="mt-10 pt-6 border-t border-cedar/15 text-center">
          <p className="text-sm text-muted-foreground">
            Have more questions?{" "}
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="inline-flex items-center gap-1.5 text-cedar hover:text-cedar-hover font-medium transition-colors"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden /> Call {CONTACT.phone}
            </a>
          </p>
        </div>
      )}
      {showCta && (
        <div className="mt-10 flex justify-center">
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
      aria-labelledby={headingId}
    >
      <div className="container mx-auto px-6">{inner}</div>
    </section>
  );
};

export default MiniFaq;
