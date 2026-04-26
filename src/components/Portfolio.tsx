import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import { Hammer, Fence, Paintbrush, Home, type LucideIcon } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import CedarCTA from "@/components/CedarCTA";
import MediaSlot from "@/components/media/MediaSlot";
import type { ServiceCategory } from "@/lib/api/public-media";
import { useApprovedMedia } from "@/hooks/useApprovedMedia";
import { BACKDROP, bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { useMemo } from "react";

interface PortfolioCard {
  title: string;
  location: string;
  description: string;
  service: ServiceCategory;
  icon: LucideIcon;
}

/** Catalogue of every service we *can* surface here. We pick the top
 *  three that actually have approved cloud media so the strip is always
 *  filled with real work. */
const ALL_CARDS: Record<ServiceCategory, PortfolioCard> = {
  decks: {
    title: "Custom Decks",
    location: "Calgary & Edmonton",
    description: "Cedar, pressure-treated and composite decks — built level, fastened tight, finished to last.",
    service: "decks",
    icon: Hammer,
  },
  sheds: {
    title: "Backyard Sheds & Studios",
    location: "Calgary & Edmonton",
    description: "Custom storage, workshops and studio sheds, framed and finished on-site.",
    service: "sheds",
    icon: Home,
  },
  fencing: {
    title: "Cedar & Privacy Fencing",
    location: "Calgary & Edmonton",
    description: "Horizontal slats, board-on-board, lattice tops — set straight and plumb on every panel.",
    service: "fencing",
    icon: Fence,
  },
  painting: {
    title: "Exterior Painting",
    location: "Calgary & Edmonton",
    description: "Full prep, two coats, hand-cut lines at every transition. Trim, fascia, soffits — every edge.",
    service: "painting",
    icon: Paintbrush,
  },
  siding: {
    title: "Siding & Cladding",
    location: "Calgary & Edmonton",
    description: "Replacement siding and re-clad — vinyl, fibre cement, board-and-batten.",
    service: "siding",
    icon: Home,
  },
  pergolas: { title: "Pergolas", location: "Calgary & Edmonton", description: "Timber pergolas built to anchor a deck or patio.", service: "pergolas", icon: Hammer },
  interiors: { title: "Interiors", location: "Calgary & Edmonton", description: "Selected interior renovation work.", service: "interiors", icon: Home },
  exterior: { title: "Exterior Renovations", location: "Calgary & Edmonton", description: "Whole-property exterior renovations.", service: "exterior", icon: Home },
  other: { title: "Custom Carpentry", location: "Calgary & Edmonton", description: "One-off custom carpentry projects.", service: "other", icon: Hammer },
};

/** The display priority when multiple services have media. */
const SERVICE_PRIORITY: ServiceCategory[] = [
  "decks", "sheds", "fencing", "painting", "siding", "pergolas",
];

/**
 * Portfolio — cinematic horizontal scroll-snap strip. Picks the top three
 * services that actually have approved cloud media so the strip is always
 * filled with real work. Falls back to decks/sheds/fencing when nothing
 * is loaded yet.
 */
const Portfolio = () => {
  const { openModal } = useQuoteModal();

  // Pull every approved photo so we can detect which services have stock.
  const { items, loading } = useApprovedMedia({
    kind: "image",
    min_quality: "reference",
    limit: 200,
  });

  const projects: PortfolioCard[] = useMemo(() => {
    if (loading || items.length === 0) {
      // Sensible default while loading
      return [ALL_CARDS.decks, ALL_CARDS.sheds, ALL_CARDS.fencing];
    }
    const counts = new Map<ServiceCategory, number>();
    for (const m of items) {
      if (!m.service) continue;
      counts.set(m.service, (counts.get(m.service) ?? 0) + 1);
    }
    const ranked = SERVICE_PRIORITY
      .filter((s) => (counts.get(s) ?? 0) >= 1)
      .slice(0, 3)
      .map((s) => ALL_CARDS[s]);
    if (ranked.length >= 3) return ranked;
    // Pad with the priority list to keep the 3-up grid intact.
    const padded = [...ranked];
    for (const s of SERVICE_PRIORITY) {
      if (padded.length >= 3) break;
      const card = ALL_CARDS[s];
      if (!padded.find((p) => p.service === card.service)) padded.push(card);
    }
    return padded;
  }, [items, loading]);

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

          <div
            className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-6 md:mx-0 px-6 md:px-0 pb-4 md:pb-0"
            role="list"
            style={{ scrollbarWidth: "none" }}
          >
            {projects.map((project, i) => {
              const Icon = project.icon;
              const opacity = bronzeStep(i, projects.length);
              return (
                <ScrollRevealMotion
                  key={project.service}
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
                        style={{ background: BACKDROP.evergreenPlate }}
                      >
                        <MediaSlot
                          query={{
                            service: project.service,
                            shot_type: ["hero", "elevation", "wide"],
                            kind: "image",
                            min_quality: "reference",
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
