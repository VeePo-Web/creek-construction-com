import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import { Hammer, Fence, Paintbrush, type LucideIcon } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import CedarCTA from "@/components/CedarCTA";
import { getProjectsByService, type Project } from "@/data/projects";
import MediaSlot from "@/components/media/MediaSlot";
import type { ServiceCategory } from "@/lib/api/public-media";
import { BACKDROP, bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";

interface PortfolioCard {
  title: string;
  location: string;
  description: string;
  service: string;
  icon: LucideIcon;
  realProject?: Project;
}

/**
 * Portfolio — cinematic horizontal scroll-snap strip (deliberately distinct
 * from FeaturedProjects' tabular grid). On md+ it lays out as a 3-up grid
 * with deeper portrait cards; on mobile it's a swipeable snap-x rail.
 *
 * Tokenized: SECTION_PADDING.default, MAX_WIDTH.wide, bronzeStep(),
 * BACKDROP.evergreenPlate. NO grain on the section root — this section is
 * cinematic / photo-led, the photos carry the texture.
 */
const Portfolio = () => {
  const { openModal } = useQuoteModal();

  const realShed = getProjectsByService("sheds").find((p) => p.featured);

  const projects: PortfolioCard[] = [
    {
      title: "Custom Cedar Deck",
      location: "Calgary NW",
      description: "Two-tier cedar deck with built-in bench seating and a privacy screen along the property line.",
      service: "decks",
      icon: Hammer,
    },
    {
      title: realShed?.title ?? "Backyard Studio Shed",
      location: realShed?.location ?? "Edmonton",
      description: realShed?.summary ?? "Custom backyard structures, framed and finished to last.",
      service: "sheds",
      icon: Fence,
      realProject: realShed,
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
      className={`${SECTION_PADDING.default} bg-muted relative`}
      aria-labelledby="portfolio-heading"
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
        <div className={`${MAX_WIDTH.wide} mx-auto`}>
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

          {/* Mobile: horizontal scroll-snap rail. md+: 3-up grid. */}
          <div
            className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-6 md:mx-0 px-6 md:px-0 pb-4 md:pb-0"
            role="list"
            style={{ scrollbarWidth: "none" }}
          >
            {projects.map((project, i) => {
              const Icon = project.icon;
              const photo = project.realProject?.hero;
              const opacity = bronzeStep(i, projects.length);
              return (
                <ScrollRevealMotion
                  key={i}
                  delay={i * 0.1}
                  y={32}
                  className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto"
                >
                  <article role="listitem" className="group">
                    <button
                      type="button"
                      onClick={() => openModal([project.service])}
                      className="block w-full text-left"
                      aria-label={`Request a quote like ${project.title}`}
                    >
                      <div
                        className="relative aspect-[4/5] rounded-sm overflow-hidden transition-all duration-700 group-hover:shadow-elevated"
                        style={photo ? undefined : { background: BACKDROP.evergreenPlate }}
                      >
                        {photo ? (
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            width={photo.width}
                            height={photo.height}
                            loading="lazy"
                            decoding="async"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                          />
                        ) : (
                          <MediaSlot
                            query={{
                              service: project.service as ServiceCategory,
                              shot_type: ["hero", "elevation", "wide"],
                              kind: "image",
                              min_quality: "portfolio",
                            }}
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            wrapperClassName="absolute inset-0 w-full h-full"
                            className="transition-transform duration-[1.2s] group-hover:scale-105"
                            fallback={
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Icon
                                  className="h-20 w-20 text-cedar/30 group-hover:text-cedar/50 transition-all duration-700 group-hover:scale-110"
                                  aria-hidden
                                />
                              </div>
                            }
                          />
                        )}

                        {/* Bronze accent line */}
                        <div
                          className="absolute top-0 left-0 h-px transition-all duration-700 group-hover:w-full z-10"
                          style={{
                            width: "30%",
                            background: "linear-gradient(90deg, hsl(var(--cedar)), transparent)",
                          }}
                        />

                        <div className="absolute top-6 right-6 pointer-events-none z-10">
                          <span className="text-white/30 text-5xl md:text-6xl font-serif leading-none select-none group-hover:text-white/60 transition-all duration-700 [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10">
                          <p className="text-[10px] tracking-[0.2em] uppercase text-cedar/90 mb-2">
                            {project.location}
                          </p>
                          <h3 className="font-serif text-xl text-white">{project.title}</h3>
                        </div>
                      </div>

                      <div
                        className="mt-4 pl-5 py-3 pr-4 transition-all duration-500 group-hover:bg-cedar/[0.04] group-hover:pl-7 rounded-sm shadow-contact border border-border/40 group-hover:shadow-elevated"
                        style={{ borderLeft: `2px solid hsl(var(--cedar) / ${opacity})` }}
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
