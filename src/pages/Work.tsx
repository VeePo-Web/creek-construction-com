import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import ProjectGallery from "@/components/ProjectGallery";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Hammer, Fence, Paintbrush, Home, Trees, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { PROJECTS, formatStatus } from "@/data/projects";

interface PlaceholderItem {
  title: string;
  location: string;
  service: string;
  description: string;
  icon: LucideIcon;
}

/** Service categories that don't yet have a real photographed project — render as icon placeholders. */
const PLACEHOLDERS: PlaceholderItem[] = [
  { title: "Two-Tier Cedar Deck", location: "Calgary NW", service: "decks", icon: Hammer, description: "Cedar deck on a sloped lot with a built-in bench and integrated planter boxes." },
  { title: "Cedar Privacy Fence", location: "Sherwood Park", service: "fencing", icon: Fence, description: "Six-foot fence with horizontal slats and a custom side gate." },
  { title: "Full Exterior Repaint", location: "Calgary SW", service: "painting", icon: Paintbrush, description: "Two coats over proper prep, all trim and fascia repainted, hand-cut lines." },
  { title: "Soffit & Fascia Replace", location: "Edmonton", service: "siding", icon: Home, description: "Old aluminum stripped, water damage repaired, new pre-finished metal install." },
  { title: "Cedar Pergola", location: "Okotoks", service: "pergolas", icon: Trees, description: "12×14 pergola over an existing patio with stained cedar and powder-coated brackets." },
];

const Work = () => {
  useDocumentTitle("Our Work", "Recent residential exterior projects across Calgary, Edmonton, and surrounding Alberta — decks, fencing, sheds, painting, siding, pergolas.");
  const { openModal } = useQuoteModal();

  const totalCount = PROJECTS.length + PLACEHOLDERS.length;

  return (
    <main className="min-h-screen bg-background" aria-label="Our Work — Creek Construction">
      <Navigation />

      <section className="relative bg-evergreen text-evergreen-foreground py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 60%, hsl(150 30% 6%) 100%)",
          }}
        />
        <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[10px] tracking-[0.2em] uppercase">
            <Link to="/" className="text-evergreen-foreground/40 hover:text-cedar transition-colors">Home</Link>
            <span className="text-evergreen-foreground/20">·</span>
            <span className="text-cedar/80">Our Work</span>
          </nav>
          <h1 className="font-serif text-evergreen-foreground mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            The work speaks first.
          </h1>
          <p className="text-lg text-evergreen-foreground/70 italic font-serif max-w-xl">
            Selected recent projects across Calgary, Edmonton, and surrounding Alberta.
          </p>

          {/* Sister studios — quiet editorial footnote */}
          <div className="mt-12 flex items-center gap-3 text-evergreen-foreground/30">
            <div className="w-8 h-px bg-evergreen-foreground/20" />
            <span className="text-[10px] tracking-[0.25em] uppercase">
              Sister studios · B &amp; P Saunas · Hickory &amp; Rose
            </span>
          </div>
        </div>
      </section>

      {/* Featured editorial galleries — real photographed projects */}
      {PROJECTS.length > 0 && (
        <section className="py-20 md:py-28 grain-overlay" aria-labelledby="featured-heading">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                numeral="I"
                label="FEATURED PROJECT"
                headingId="featured-heading"
                heading={PROJECTS[0].title + "."}
                subheading={PROJECTS[0].summary}
                badge={`${PROJECTS[0].location} · ${formatStatus(PROJECTS[0].status)}`}
              />

              <div className="mt-12 space-y-20">
                {PROJECTS.map((project, idx) => (
                  <ScrollRevealMotion key={project.slug} delay={0.05} y={24}>
                    <article aria-labelledby={`project-${project.slug}-heading`}>
                      {idx > 0 && (
                        <header className="mb-6 flex items-baseline justify-between gap-6 flex-wrap">
                          <h2
                            id={`project-${project.slug}-heading`}
                            className="font-serif text-3xl md:text-4xl text-foreground"
                          >
                            {project.title}
                          </h2>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-cedar/80">
                            {project.location} · {formatStatus(project.status)} · {project.year}
                          </p>
                        </header>
                      )}
                      <ProjectGallery project={project} priority={idx === 0} />
                      <button
                        type="button"
                        onClick={() => openModal([project.service])}
                        className="mt-6 text-[11px] tracking-[0.2em] uppercase text-cedar hover:text-cedar-hover transition-colors min-h-[44px] inline-flex items-center gap-2"
                      >
                        Quote a similar build
                        <span aria-hidden>→</span>
                      </button>
                    </article>
                  </ScrollRevealMotion>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Service-category placeholder grid — replaced as real photos arrive */}
      <section className="py-20 md:py-28 bg-muted grain-overlay" aria-labelledby="gallery-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              numeral="II"
              label="MORE WORK"
              headingId="gallery-heading"
              heading="Across every service."
              subheading="Click any category to request a quote for similar work."
              badge={`0${totalCount} Projects`}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12" role="list">
              {PLACEHOLDERS.map((w, i) => {
                const Icon = w.icon;
                return (
                  <ScrollRevealMotion key={i} delay={i * 0.06} y={28}>
                    <article role="listitem" className="group">
                      <button
                        type="button"
                        onClick={() => openModal([w.service])}
                        className="block w-full text-left"
                        aria-label={`Request a quote like ${w.title}`}
                      >
                        <div
                          className="relative aspect-[4/5] rounded-sm overflow-hidden grain-texture transition-all duration-700 group-hover:shadow-elevated"
                          style={{
                            background:
                              "linear-gradient(135deg, hsl(150 25% 14%) 0%, hsl(150 25% 8%) 100%)",
                          }}
                        >
                          <div className="absolute inset-0 grain-overlay opacity-50 pointer-events-none" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="h-16 w-16 text-cedar/30 group-hover:text-cedar/50 transition-all duration-700 group-hover:scale-110" aria-hidden />
                          </div>
                          <div className="absolute top-5 right-5 pointer-events-none">
                            <span className="text-white/15 text-4xl font-serif select-none group-hover:text-white/30 transition-colors duration-700">
                              {String(i + 2).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-cedar/80 mb-1.5">
                              {w.location}
                            </p>
                            <h3 className="font-serif text-lg text-white">{w.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-4 px-1">
                          {w.description}
                        </p>
                      </button>
                    </article>
                  </ScrollRevealMotion>
                );
              })}
            </div>

            <ScrollRevealMotion delay={0.2} className="mt-20 text-center">
              <p className="text-sm text-muted-foreground italic mb-6">
                More projects added each month.
              </p>
              <CedarCTA>Request a Quote</CedarCTA>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Work;
