import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import { Hammer, Fence, Paintbrush } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import CedarCTA from "@/components/CedarCTA";

// PLACEHOLDER PROJECTS — neutral evergreen panels until real photos are uploaded.
// To swap in real images: replace each card body with an <img src={...} /> using
// the same wrapper, and remove the Icon block.
const Portfolio = () => {
  const { openModal } = useQuoteModal();

  const projects = [
    {
      title: "Custom Cedar Deck",
      location: "Calgary NW",
      description: "Two-tier cedar deck with built-in bench seating and a privacy screen along the property line.",
      service: "decks",
      icon: Hammer,
    },
    {
      title: "Privacy Fence",
      location: "Sherwood Park",
      description: "Six-foot vertical wood fence on a sloped lot — straight posts, level top, gates that latch perfectly.",
      service: "fencing",
      icon: Fence,
    },
    {
      title: "Full Exterior Repaint",
      location: "Cochrane",
      description: "Complete prep, two coats, all trim and fascia. Hand-cut lines at every transition.",
      service: "painting",
      icon: Paintbrush,
    },
  ];

  return (
    <section
      id="work"
      className="py-24 md:py-32 bg-muted relative grain-overlay"
      aria-labelledby="portfolio-heading"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1200px" }}
    >
      <div
        className="absolute top-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(180deg, hsl(var(--secondary)) 0%, transparent 100%)" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--evergreen) / 0.06) 100%)" }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <SectionHeader
              numeral="V"
              label="RECENT WORK"
              headingId="portfolio-heading"
              heading="Built to Belong."
              subheading="Real projects, real properties, real people."
              badge="03 Recent · Calgary & Edmonton"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6" role="list">
            {projects.map((project, i) => {
              const Icon = project.icon;
              return (
                <ScrollRevealMotion key={i} delay={i * 0.1} y={32}>
                  <article role="listitem" className="group">
                    <button
                      type="button"
                      onClick={() => openModal([project.service])}
                      className="block w-full text-left"
                      aria-label={`Request a quote like ${project.title}`}
                    >
                      <div
                        className="relative aspect-[4/5] rounded-sm overflow-hidden grain-texture transition-all duration-700 group-hover:shadow-elevated"
                        style={{
                          background:
                            "linear-gradient(135deg, hsl(150 25% 14%) 0%, hsl(150 25% 8%) 100%)",
                        }}
                      >
                        <div className="absolute inset-0 grain-overlay opacity-50 pointer-events-none" />

                        {/* Bronze accent line */}
                        <div
                          className="absolute top-0 left-0 h-px transition-all duration-700 group-hover:w-full"
                          style={{
                            width: "30%",
                            background: "linear-gradient(90deg, hsl(var(--cedar)), transparent)",
                          }}
                        />

                        {/* Centered icon — placeholder for real photo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon
                            className="h-20 w-20 text-cedar/30 group-hover:text-cedar/50 transition-all duration-700 group-hover:scale-110"
                            aria-hidden
                          />
                        </div>

                        <div className="absolute top-6 right-6 pointer-events-none">
                          <span className="text-white/15 text-5xl md:text-6xl font-serif leading-none select-none group-hover:text-white/30 transition-all duration-700">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-[10px] tracking-[0.2em] uppercase text-cedar/80 mb-2">
                            {project.location}
                          </p>
                          <h3 className="font-serif text-xl text-white">{project.title}</h3>
                        </div>
                      </div>

                      <div
                        className="mt-4 grain-texture pl-5 py-3 pr-4 transition-all duration-500 group-hover:bg-cedar/[0.04] group-hover:pl-7 rounded-sm shadow-contact border border-border/40 group-hover:shadow-elevated"
                        style={{ borderLeft: `2px solid hsl(var(--cedar) / ${[0.2, 0.5, 0.85][i]})` }}
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </button>
                  </article>
                </ScrollRevealMotion>
              );
            })}
          </div>

          <ScrollRevealMotion delay={0.2} className="mt-16 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-cedar/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
              <div className="w-12 h-px bg-cedar/20" />
            </div>
            <p className="text-lg italic font-serif text-foreground/40 tracking-wide mb-8">
              Every project gets the same standard of work.
            </p>
            <CedarCTA>Request a Quote</CedarCTA>
          </ScrollRevealMotion>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
