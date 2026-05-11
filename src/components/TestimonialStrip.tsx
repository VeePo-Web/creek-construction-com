import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { TESTIMONIALS_TOP3, type Testimonial } from "@/config/testimonials";
import { HEADLINE } from "@/lib/typography";

import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";

interface TestimonialStripProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items?: Testimonial[];
  /** Wrap in <section>. Default true. */
  asSection?: boolean;
  /** Background tone. Default "background". */
  background?: "background" | "secondary";
  /** Show trailing CedarCTA row. Default true. */
  showCta?: boolean;
  /** Override heading id (only needed if two strips share one page). */
  headingId?: string;
  /** Faint hairline at section top — used when adjacent to a same-bg section. */
  topRule?: boolean;
}

/**
 * TestimonialStrip — three editorial quote cards with the bronze
 * thermal-crescendo border. Reused on Home, Services, About, Work.
 */
const TestimonialStrip = ({
  eyebrow: _eyebrow,
  heading = "Quiet recommendations.",
  subheading,
  items = TESTIMONIALS_TOP3,
  asSection = true,
  background = "background",
  showCta = false,
  headingId = "testimonials-heading",
  topRule = false,
}: TestimonialStripProps) => {
  const { ref, cls, style } = useReveal();

  const inner = (
    <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
      <SectionHeader
        variant="quiet"
        headingId={headingId}
        heading={heading}
        subheading={subheading}
        disableMotion
      />

      <ul
        role="list"
        className="mt-12 grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((t, i) => (
          <li
            key={t.firstName + i}
            className="flex flex-col"
          >
            <p className={`${HEADLINE.card} text-foreground/90 leading-snug flex-1`}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 hairline pt-4">
              <p className="text-sm text-foreground">{t.firstName}</p>
            </div>
          </li>
        ))}
      </ul>

      {showCta && (
        <div className="mt-14 flex justify-center">
          <CedarCTA />
        </div>
      )}
    </div>
  );

  if (!asSection) return inner;

  return (
    <section
      id="section-testimonials"
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"} ${topRule ? "hairline" : ""} min-h-[100svh] flex flex-col justify-center`}
      aria-labelledby={headingId}
    >
      <div className="container-page">{inner}</div>
    </section>
  );
};

export default TestimonialStrip;
