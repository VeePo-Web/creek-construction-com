import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import ProjectTile from "@/components/ui/project-tile";
import ProjectGallery from "@/components/ProjectGallery";
import TestimonialStrip from "@/components/TestimonialStrip";

import { ProjectsJsonLd } from "@/components/JsonLd";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Hammer, Fence, Paintbrush, Home, Trees, type LucideIcon } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { PROJECTS, formatStatus } from "@/data/projects";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";

interface PlaceholderItem {
  title: string;
  location: string;
  service: string;
  description: string;
  icon: LucideIcon;
}

/** Service categories that don’t yet have a real photographed project — render as icon placeholders. */
const PLACEHOLDERS: PlaceholderItem[] = [
  { title: "Two-Tier Cedar Deck", location: "Calgary NW", service: "decks", icon: Hammer, description: "Cedar deck on a sloped lot with a built-in bench and integrated planter boxes." },
  { title: "Cedar Privacy Fence", location: "Sherwood Park", service: "fencing", icon: Fence, description: "Six-foot fence with horizontal slats and a custom side gate." },
  { title: "Full Exterior Repaint", location: "Calgary SW", service: "painting", icon: Paintbrush, description: "Two coats over proper prep, all trim and fascia repainted, hand-cut lines." },
  { title: "Soffit & Fascia Replace", location: "Edmonton", service: "siding", icon: Home, description: "Old aluminum stripped, water damage repaired, new pre-finished metal install." },
  { title: "Cedar Pergola", location: "Okotoks", service: "pergolas", icon: Trees, description: "12×14 pergola over an existing patio with stained cedar and powder-coated brackets." },
];

const Work = () => {
  useDocumentTitle(
    "Our Work",
    "Recent residential exterior projects across Calgary, Edmonton, and surrounding Alberta — decks, fencing, sheds, painting, siding, pergolas.",
  );
  const { openModal } = useQuoteModal();

  const totalCount = PROJECTS.length + PLACEHOLDERS.length;

  return (
    <main className="min-h-screen bg-background" aria-label="Our Work — Creek Construction">
      <ProjectsJsonLd />
      <Navigation />
      <SkipToContent target={PROJECTS.length > 0 ? "section-featured" : "section-gallery"} />

      <PageHero
        variant="cinematic-bleed"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Our Work" }]}
        sectionLabel="SELECTED WORK"
        title={["The work", "speaks first."]}
        subtitle="Selected projects across Calgary, Edmonton, and the towns in between."
        query={{ shot_type: ["hero", "elevation", "wide"], min_quality: "reference", kind: "image" }}
        videoQuery={{ kind: "video", min_quality: "portfolio" }}
        height="84vh"
        minHeight="640px"
      >
        <CedarCTA />
      </PageHero>

      {/* Featured editorial galleries — real photographed projects */}
      {PROJECTS.length > 0 && (
        <section id="section-featured" className={`${SECTION_PADDING.default}`} aria-labelledby="featured-heading">
          <div className="container mx-auto px-5 sm:px-6">
            <div className={`${MAX_WIDTH.wide} mx-auto`}>
              <SectionHeader
                label="FEATURED PROJECT"
                headingId="featured-heading"
                heading={PROJECTS[0].title + "."}
                subheading={PROJECTS[0].summary}
              />

              <div className="mt-12 space-y-20">
                {PROJECTS.map((project, idx) => (
                  <article key={project.slug} aria-labelledby={`project-${project.slug}-heading`}>
                    {idx > 0 && (
                      <header className="mb-6 flex flex-col items-start gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6 flex-wrap">
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
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Service-category placeholder grid — replaced as real photos arrive */}
      <section id="section-gallery" className={`${SECTION_PADDING.default} bg-secondary`} aria-labelledby="gallery-heading">
        <div className="container mx-auto px-5 sm:px-6">
          <div className={`${MAX_WIDTH.wide} mx-auto`}>
            <SectionHeader
              label="MORE WORK"
              headingId="gallery-heading"
              heading="Across every service."
              subheading="Click any category to request a quote for similar work."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 [&>*:nth-child(5)]:lg:col-start-2" role="list">
              {PLACEHOLDERS.map((w, i) => (
                <ProjectTile
                  key={i}
                  item={{
                    title: w.title,
                    location: w.location,
                    description: w.description,
                    icon: w.icon,
                    service: w.service as import("@/lib/api/public-media").ServiceCategory,
                  }}
                  index={i}
                  total={PLACEHOLDERS.length}
                  onClick={() => openModal([w.service])}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60">
                More projects added each month
              </p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialStrip background="background" />

      <QuoteCloserCard eyebrow="Quote a similar build" background="secondary" />

      <Footer />
    </main>
  );
};

export default Work;
