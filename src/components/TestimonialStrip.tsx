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
            className="flex flex-col p-6 lg:p-8 md:min-h-[260px] bg-background border border-border/40 rounded-sm transition-[background-color,border-color] duration-300 hover:bg-cedar/[0.03] hover:border-cedar/30"
            style={{
              borderLeft: `2px solid hsl(var(--cedar) / ${Math.max(bronzeStep(i, items.length), 0.3)})`,
            }}
          >
            <span
              aria-hidden
              className="font-serif text-cedar/30 text-3xl md:text-4xl leading-none mb-2 select-none"
            >
              &ldquo;
            </span>
            <p className="font-serif text-lg md:text-xl text-foreground leading-snug flex-1">
              {t.quote}
            </p>
            <div className="mt-8 pt-5 border-t border-border/40 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-foreground">
                <span className="text-cedar/70 mr-1.5">—</span>
                {t.firstName}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
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
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"}`}
      aria-labelledby={headingId}
    >
      <div className="container mx-auto px-5 sm:px-6">{inner}</div>
    </section>
  );
};

export default TestimonialStrip;
