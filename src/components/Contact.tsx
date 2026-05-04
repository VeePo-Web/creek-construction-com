import QuoteCloserCard from "@/components/QuoteCloserCard";
import { SECTION_PADDING } from "@/lib/spacing";

/**
 * Contact — homepage closer.
 *
 * Now a thin wrapper around the shared <QuoteCloserCard /> so the homepage
 * ends with the same evergreen "What's next" plate used on Services, About,
 * Work, and Contact. One closer, one CTA phrase, one trust line — site-wide.
 *
 * The id="section-contact" anchor is preserved (skip-link target, FAB
 * fallback observer, deep links).
 */
const Contact = () => {
  return (
    <section
      id="section-contact"
      className={`${SECTION_PADDING.default} bg-background`}
      aria-label="Request a quote"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <QuoteCloserCard asSection={false} eyebrow="What's next" />
        </div>
      </div>
    </section>
  );
};

export default Contact;
