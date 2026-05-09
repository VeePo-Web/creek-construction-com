import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { TESTIMONIALS_TOP3, type Testimonial } from "@/config/testimonials";
import { bronzeStep } from "@/lib/colors";
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
  eyebrow = "WHAT NEIGHBORS SAY",
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
        label={eyebrow}
        headingId={headingId}
        heading={heading}
        subheading={subheading}
        disableMotion
      />

      <ul
        role="list"
        className="mt-12 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((t, i) => (
          <li
            key={t.firstName + i}
            className="relative flex flex-col p-6 lg:p-8 sm:min-h-[220px] lg:min-h-[260px] bg-background border border-cedar/10 transition-colors duration-300 hover:border-cedar/30"
          >
            <span aria-hidden className="absolute -top-2 left-5 font-serif text-[56px] leading-none text-cedar/25 select-none">
              &ldquo;
            </span>
            <p className="font-serif text-lg md:text-xl text-foreground/90 leading-snug flex-1 pt-6">
              {t.quote}
            </p>
            <div className="mt-8 pt-5 border-t border-cedar/10 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-y-1 gap-x-2">
              <p className="text-sm text-foreground">
                <span className="text-cedar/70 mr-1.5">—</span>
                {t.firstName}
              </p>
              <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground/65">
                {t.city} · {t.service}
              </p>
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
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"} ${topRule ? "border-t border-transparent" : ""}`}
      style={topRule ? { borderImage: "linear-gradient(90deg, transparent 0%, hsl(var(--cedar) / 0.28) 50%, transparent 100%) 1" } : undefined}
      aria-labelledby={headingId}
    >
      <div className="container mx-auto px-5 sm:px-6">{inner}</div>
    </section>
  );
};

export default TestimonialStrip;
