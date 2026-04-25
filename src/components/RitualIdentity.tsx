import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";

const RitualIdentity = () => {
  const ritualPoints = [
    { lead: "If you train hard and recover on willpower alone — ", resolve: "this changes that.", opacity: 0.15 },
    { lead: "If you carry tension that sleep alone doesn't fix — ", resolve: "this addresses it.", opacity: 0.4 },
    { lead: "If Alberta winter makes you go inward — ", resolve: "this gives you a reason to step outside.", opacity: 0.8 },
  ];

  return (
    <section id="section-truth" className="py-32 md:py-40 bg-background relative grain-overlay" aria-labelledby="ritual-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
      {/* Gradient bleed from hero darkness into warmth */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, hsl(20 10% 8% / 0.12) 0%, hsl(20 10% 8% / 0.04) 40%, transparent 100%)',
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(20 10% 8% / 0.06) 100%)' }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            numeral="I"
            label="THE RITUAL"
            headingId="ritual-heading"
            cedarLabel
            heading="Stop Trying to Be Consistent. Build a Ritual You Can Actually Keep."
            subheading="Discipline fades. Infrastructure doesn't."
          />

          <ScrollRevealMotion delay={0.3}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-20 max-w-2xl mt-8">
              You're not undisciplined. Your environment isn't designed for recovery. 
              Wellness that depends on motivation eventually stops happening. 
              A ritual that's built into your property never does.
            </p>
          </ScrollRevealMotion>

          {/* Ritual count badge */}
          <ScrollRevealMotion delay={0.4}>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-px bg-cedar/15" />
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">03 Truths</span>
            </div>
          </ScrollRevealMotion>
          
          <div className="space-y-4 mb-20" role="list" aria-label="Three truths about the sauna ritual">
            {ritualPoints.map((item, i) => (
              <ScrollRevealMotion key={i} delay={0.5 + i * 0.15}>
                <div
                  role="listitem"
                   className="flex items-start gap-6 pl-6 py-6 -ml-px transition-all duration-500 hover:bg-accent/5 hover:pl-8 hover:translate-y-[-1px] hover:shadow-elevated group/ritual cursor-default grain-texture shadow-contact border border-border/40 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                   tabIndex={0}
                   style={{ borderLeft: `2px solid hsl(28 50% 52% / ${item.opacity})` }}
                >
                  <span className="text-2xl md:text-3xl font-serif text-cedar/15 leading-none select-none mt-1 transition-colors duration-500 group-hover/ritual:text-cedar/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-foreground text-lg flex-1">
                    {item.lead}
                    <span className="text-muted-foreground transition-colors duration-500 group-hover/ritual:text-cedar/70">{item.resolve}</span>
                  </p>
                </div>
              </ScrollRevealMotion>
            ))}
          </div>

          {/* Signature pull-quote with warmth on hover */}
          <ScrollRevealMotion delay={0.2}>
            <div
              className="relative pl-8 md:pl-12 py-5 mb-16 group/quote cursor-default"
              style={{ borderLeft: '2px solid hsl(28 50% 52% / 0.2)', marginLeft: '-0.15em' }}
            >
              <span className="quote-mark-float absolute -top-3 -left-1 group-hover/quote:text-cedar/25 transition-all duration-700 group-hover/quote:scale-105" style={{ transformOrigin: 'top left' }} aria-hidden="true">{"\u201C"}</span>
              <p className="text-2xl md:text-3xl font-serif italic text-foreground/70 leading-snug tracking-wide pt-6 transition-colors duration-500 group-hover/quote:text-foreground/85">
                A sauna isn\u2019t a purchase. It\u2019s a permanent shift in how you end the day.
              </p>
            </div>
          </ScrollRevealMotion>

          {/* CTA with editorial trust line */}
          <ScrollRevealMotion delay={0.3}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <CedarCTA to="/plan">START YOUR PLAN</CedarCTA>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground/40 uppercase flex items-center min-h-[44px]">
                Free consultation · Alberta only
              </span>
            </div>
          </ScrollRevealMotion>

          {/* Closing editorial line */}
          <ScrollRevealMotion delay={0.4}>
            <div className="mt-20 pt-8 border-t border-border/20 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground/30 uppercase">Infrastructure Over Willpower</span>
              <div className="w-8 h-px bg-cedar/15" />
            </div>
          </ScrollRevealMotion>
        </div>
      </div>
    </section>
  );
};

export default RitualIdentity;
