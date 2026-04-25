import { Star } from "lucide-react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import saunaStonesPremium from "@/assets/sauna-stones-premium.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "I didn\u2019t have to coordinate a single trade. They showed up, installed it, walked me through everything. I used it that night.",
      name: "Mark T.",
      location: "Edmonton",
      type: "BACKYARD",
      anxiety: "Ease of install",
      rating: 5,
    },
    {
      quote: "We\u2019ve used it three times a week since November. At \u221228\u00B0C it still heats up in under 40 minutes. The winter performance is real.",
      name: "Sarah & James R.",
      location: "Sherwood Park",
      type: "ACREAGE",
      anxiety: "Winter performance",
      rating: 5,
    },
    {
      quote: "It looks like it was always meant to be here. Our neighbors assumed we hired an architect. It\u2019s just B&P doing what they do.",
      name: "Dave K.",
      location: "Canmore",
      type: "MOUNTAIN",
      anxiety: "Aesthetic integration",
      rating: 5,
    },
  ];

  return (
    <section id="section-testimonials" className="py-32 md:py-40 relative overflow-hidden grain-overlay section-bleed-top" aria-labelledby="testimonials-heading" style={{
      contentVisibility: 'auto', containIntrinsicSize: 'auto 900px',
      background: "linear-gradient(180deg, hsl(var(--secondary)) 0%, hsl(var(--muted)) 40%, hsl(var(--muted)) 60%, hsl(var(--secondary)) 100%)",
    }}>
      {/* Premium stones background — faint atmospheric layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={saunaStonesPremium}
          alt=""
          role="presentation"
          aria-hidden="true"
          width="1920"
          height="1280"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.04]"
          style={{ filter: 'blur(1px) saturate(0.6)' }}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>
      {/* Subtle cedar grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, hsl(var(--cedar) / 0.3) 80px, hsl(var(--cedar) / 0.3) 81px)',
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(var(--muted)) 100%)' }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            numeral="IV"
            label="FROM ALBERTA HOMEOWNERS"
            headingId="testimonials-heading"
            heading="Real Installs. Real Rituals."
            subheading="What Alberta homeowners say after first heat."
            badge="03 Testimonials · 03 Properties"
            baseDelay={0}
          />

          <div className="mb-20" />
          
          {/* CSS-only sibling dimming: parent hover dims all, individual hover restores */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 group/cards" role="list" style={{ contain: 'layout style' }}>
            {testimonials.map((t, i) => (
              <ScrollRevealMotion key={i} delay={0.25 + i * 0.15} y={32}>
                <article
                  className={`card-glass grain-texture rounded-sm md:testimonial-depth-${i + 1} group/card relative p-8 md:p-10 space-y-6 h-full flex flex-col transition-all duration-500 ease-smooth group-hover/cards:opacity-65 group-hover/cards:scale-[0.98] hover:!opacity-100 hover:!scale-100 shadow-contact hover:shadow-elevated`}
                  role="listitem"
                  aria-label={`Testimonial from ${t.name}, ${t.location}`}
                >
                  {/* Editorial number + type + location avatar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-medium tracking-wider transition-all duration-500 group-hover/card:scale-110 group-hover/card:shadow-thermal"
                        style={{
                          background: `linear-gradient(135deg, hsl(28 50% 52% / ${0.1 + i * 0.08}), hsl(28 50% 52% / ${0.18 + i * 0.1}))`,
                          border: `1.5px solid hsl(28 50% 52% / ${0.2 + i * 0.12})`,
                          color: 'hsl(28 50% 52%)',
                          boxShadow: `0 2px 8px hsl(28 50% 52% / 0.1)`,
                        }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <span className="text-minimal text-cedar">{t.type}</span>
                    </div>
                    <span className="text-[11px] tracking-[0.2em] text-muted-foreground/40 font-light tabular-nums">
                      {String(i + 1).padStart(2, '0')}/{String(testimonials.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Star rating — warm cedar stars */}
                  <div className="flex items-center gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star
                        key={si}
                        className="h-3 w-3 text-cedar/60 fill-cedar/40 group-hover/card:fill-cedar/70 group-hover/card:text-cedar transition-colors duration-500"
                        style={{ transitionDelay: `${si * 40}ms` }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Thermal crescendo line */}
                  <div className={`${["w-8", "w-12", "w-20"][i]} ${["group-hover/card:w-16", "group-hover/card:w-24", "group-hover/card:w-full"][i]} h-px bg-gradient-to-r from-cedar to-cedar/50 transition-all duration-700`} />

                  <blockquote className="text-foreground leading-relaxed text-lg md:text-xl font-light relative flex-1">
                    <span className="quote-mark-float absolute -top-2 -left-1 group-hover/card:text-cedar/25 transition-colors duration-500" aria-hidden="true">{"\u201C"}</span>
                    <span className="block pt-8">{t.quote}{"\u201D"}</span>
                  </blockquote>

                  <footer className="pt-6 mt-auto border-t border-cedar/15 group-hover/card:border-cedar/30 transition-all duration-500">
                    <cite className="not-italic">
                      <p className="text-sm font-medium text-foreground transition-colors duration-500 group-hover/card:text-cedar">{t.name}</p>
                      <p className="text-sm text-muted-foreground mt-1 transition-colors duration-500 group-hover/card:text-muted-foreground/80">{t.location}</p>
                    </cite>
                   <span
                      tabIndex={0}
                      className="inline-block mt-3 text-[11px] tracking-widest text-cedar/70 border border-cedar/20 rounded-sm px-3 py-1.5 uppercase transition-all duration-500 cursor-default shadow-contact group-hover/card:border-cedar/40 group-hover/card:bg-cedar/[0.05] group-hover/card:shadow-[0_0_16px_hsl(28_50%_52%/0.15)] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      style={{ borderLeft: `2.5px solid hsl(28 50% 52% / ${[0.25, 0.55, 0.9][i]})` }}
                    >
                      {t.anxiety}
                    </span>
                  </footer>
                </article>
              </ScrollRevealMotion>
            ))}
          </div>

          {/* Aggregate trust signal */}
          <ScrollRevealMotion delay={0.45} className="mt-16 flex justify-center">
            <div tabIndex={0} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 sm:px-8 py-4 border border-border/30 rounded-sm hover:border-cedar/20 hover:shadow-[0_0_20px_hsl(28_50%_52%/0.08)] transition-all duration-700 group/trust focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2" role="status" aria-label="Average rating: 5.0 stars across all Alberta installations">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-cedar fill-cedar/50 group-hover/trust:fill-cedar/70 transition-colors duration-500" style={{ transitionDelay: `${i * 60}ms` }} aria-hidden="true" />
                ))}
              </div>
              <div className="hidden sm:block w-px h-6 bg-border/40 group-hover/trust:bg-cedar/20 transition-colors duration-500" />
              <span className="text-[11px] tracking-[0.15em] text-muted-foreground/60 uppercase group-hover/trust:text-muted-foreground/80 transition-colors duration-500">5.0 Average · All Alberta Installs</span>
            </div>
          </ScrollRevealMotion>

          <ScrollRevealMotion delay={0.5} className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-lg italic font-serif text-foreground/40 tracking-wide">
              Three properties. Three rituals. One standard.
            </p>
            <CedarCTA to="/plan" variant="secondary">YOUR RITUAL NEXT</CedarCTA>
          </ScrollRevealMotion>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
