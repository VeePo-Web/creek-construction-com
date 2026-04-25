import { Star } from "lucide-react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import type { ServiceCategory } from "@/lib/api/public-media";

// PLACEHOLDER TESTIMONIALS — replace with real customer quotes when available.
// Keep the structure: { quote, name, location, type, service, rating } and the cards
// will rerender automatically. `service` ties the photo thumbnail to the right work.
const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "They quoted what they'd build, then built exactly that. No surprise charges, no half-finished trim. The deck looks better than the photos we showed them.",
      name: "Mark T.",
      location: "Calgary NW",
      type: "DECK",
      service: "decks" as ServiceCategory,
      rating: 5,
    },
    {
      quote:
        "Honest crew. Showed up when they said, cleaned up every day, and the fence is dead straight. We've already booked them for our shed.",
      name: "Sarah & James R.",
      location: "Sherwood Park",
      type: "FENCE",
      service: "fencing" as ServiceCategory,
      rating: 5,
    },
    {
      quote:
        "Repainted the whole exterior plus all the trim. Two years in and it still looks fresh. You can tell the prep work was done properly.",
      name: "Dave K.",
      location: "Cochrane",
      type: "PAINTING",
      service: "painting" as ServiceCategory,
      rating: 5,
    },
  ];

  return (
    <section
      id="section-testimonials"
      className="py-24 md:py-32 relative overflow-hidden grain-overlay"
      aria-labelledby="testimonials-heading"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 900px",
        background:
          "linear-gradient(180deg, hsl(var(--secondary)) 0%, hsl(var(--muted)) 40%, hsl(var(--muted)) 60%, hsl(var(--secondary)) 100%)",
      }}
    >
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--muted)) 100%)" }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            numeral="IV"
            label="FROM ALBERTA HOMEOWNERS"
            headingId="testimonials-heading"
            heading="The Work Speaks for Itself."
            subheading="What clients say after we've packed up the truck."
            badge="03 Reviews"
            baseDelay={0}
          />

          <div className="mb-16" />

          <div
            className="grid md:grid-cols-3 gap-6 lg:gap-8 group/cards"
            role="list"
            style={{ contain: "layout style" }}
          >
            {testimonials.map((t, i) => (
              <ScrollRevealMotion key={i} delay={0.2 + i * 0.12} y={28}>
                <article
                  className="card-glass grain-texture rounded-sm group/card relative p-8 md:p-10 space-y-6 h-full flex flex-col transition-all duration-500 ease-smooth group-hover/cards:opacity-65 group-hover/cards:scale-[0.98] hover:!opacity-100 hover:!scale-100 shadow-contact hover:shadow-elevated"
                  role="listitem"
                  aria-label={`Testimonial from ${t.name}, ${t.location}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-medium tracking-wider transition-all duration-500 group-hover/card:scale-110"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--cedar) / ${0.1 + i * 0.08}), hsl(var(--cedar) / ${0.18 + i * 0.1}))`,
                          border: `1.5px solid hsl(var(--cedar) / ${0.2 + i * 0.12})`,
                          color: "hsl(var(--cedar))",
                        }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <span className="text-minimal text-cedar">{t.type}</span>
                    </div>
                    <span className="text-[11px] tracking-[0.2em] text-muted-foreground/40 font-light tabular-nums">
                      {String(i + 1).padStart(2, "0")}/{String(testimonials.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star
                        key={si}
                        className="h-3 w-3 text-cedar/60 fill-cedar/40 group-hover/card:fill-cedar/70 group-hover/card:text-cedar transition-colors duration-500"
                        style={{ transitionDelay: `${si * 40}ms` }}
                        aria-hidden
                      />
                    ))}
                  </div>

                  <div
                    className={`${["w-8", "w-12", "w-20"][i]} ${["group-hover/card:w-16", "group-hover/card:w-24", "group-hover/card:w-full"][i]} h-px bg-gradient-to-r from-cedar to-cedar/50 transition-all duration-700`}
                  />

                  <blockquote className="text-foreground leading-relaxed text-base md:text-lg font-light relative flex-1">
                    <span className="quote-mark-float absolute -top-2 -left-1 group-hover/card:text-cedar/25 transition-colors duration-500" aria-hidden>
                      {"\u201C"}
                    </span>
                    <span className="block pt-8">
                      {t.quote}
                      {"\u201D"}
                    </span>
                  </blockquote>

                  <footer className="pt-6 mt-auto border-t border-cedar/15 group-hover/card:border-cedar/30 transition-all duration-500">
                    <cite className="not-italic">
                      <p className="text-sm font-medium text-foreground transition-colors duration-500 group-hover/card:text-cedar">
                        {t.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{t.location}</p>
                    </cite>
                  </footer>
                </article>
              </ScrollRevealMotion>
            ))}
          </div>

          <ScrollRevealMotion delay={0.45} className="mt-16 flex justify-center">
            <div
              tabIndex={0}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 sm:px-8 py-4 border border-border/30 rounded-sm hover:border-cedar/20 transition-all duration-700 group/trust focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
              role="status"
              aria-label="Pride in the work — every project, every time"
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 text-cedar fill-cedar/50 group-hover/trust:fill-cedar/70 transition-colors duration-500"
                    style={{ transitionDelay: `${i * 60}ms` }}
                    aria-hidden
                  />
                ))}
              </div>
              <div className="hidden sm:block w-px h-6 bg-border/40 group-hover/trust:bg-cedar/20 transition-colors duration-500" />
              <span className="text-[11px] tracking-[0.15em] text-muted-foreground/60 uppercase">
                Pride in the work · Every project, every time
              </span>
            </div>
          </ScrollRevealMotion>

          <ScrollRevealMotion delay={0.5} className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-lg italic font-serif text-foreground/40 tracking-wide">
              Three projects. One standard. No shortcuts.
            </p>
            <CedarCTA variant="secondary">Request a Quote</CedarCTA>
          </ScrollRevealMotion>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
