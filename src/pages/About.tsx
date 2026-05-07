import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { CONTACT } from "@/config/contact";
import { bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { BODY } from "@/lib/typography";
import { CREEK_PROCESS as STEPS } from "@/config/process";
import { STATS_TRIO } from "@/config/stats";

const About = () => {
  useDocumentTitle(
    "About",
    "Creek Construction — locally owned residential exterior contractor serving Calgary, Edmonton, and surrounding Alberta.",
  );

  return (
    <main className="min-h-screen bg-background" aria-label="About — Creek Construction">
      <Navigation />
      <SkipToContent target="section-story" />


      <PageHero
        variant="evergreen-typographic"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About" }]}
        
        sectionLabel="OUR STORY"
        title={["Built on the", "work itself."]}
        subtitle="Calgary and Edmonton. The crew you meet is the crew on-site."
        ambientClipQuery={{ kind: "video", min_quality: "portfolio" }}
        triptychQueries={[
          { shot_type: ["process", "detail"], min_quality: "reference", kind: "image" },
          { shot_type: ["detail", "interior"], min_quality: "reference", kind: "image" },
          { shot_type: ["wide", "elevation", "hero"], min_quality: "reference", kind: "image" },
        ]}
      >
        <CedarCTA />
      </PageHero>

      <section id="section-story" className={`${SECTION_PADDING.default}`} aria-labelledby="story-heading">
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              label="WHO WE ARE"
              headingId="story-heading"
              heading="A small crew that takes the work seriously."
            />
            <div className="space-y-6 mt-8 max-w-[62ch]">
              <p className={BODY.lead}>
                Creek Construction is a locally owned, residential-exterior contractor working
                across the Calgary and Edmonton metros. We build decks, fences, sheds, pergolas —
                and we paint, side, and repair the parts of your home that face the weather.
              </p>
              <p className={BODY.lead}>
                We don’t subcontract the build. The crew you meet at the quote is the crew on-site
                doing the work. That’s how we keep quality consistent, and it’s why we’d rather do
                fewer projects exceptionally well than chase volume.
              </p>
            </div>

            {/* Inline stat trio — quiet, no border, no CTA */}
            <div
              className="mt-12 pt-8 border-t border-cedar/15 grid grid-cols-3 gap-4 sm:gap-6"
              role="group"
              aria-label="Creek by the numbers"
            >
              {STATS_TRIO.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl md:text-3xl text-foreground leading-none tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70 mt-2 leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="section-process" className={`${SECTION_PADDING.default} bg-secondary`} aria-labelledby="process-heading">
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              label="HOW WE WORK"
              headingId="process-heading"
              heading="The Creek Process."
              subheading="Five steps. Nothing surprising along the way."
            />

            <div className="space-y-4 mt-12" role="list">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  role="listitem"
                  className="flex items-start gap-5 pl-6 py-5 rounded-sm transition-[background-color,transform] duration-300 hover:bg-cedar/[0.03] hover:translate-x-1 border border-border/40 bg-background"
                  style={{ borderLeft: `2px solid hsl(var(--cedar) / ${bronzeStep(i, STEPS.length)})` }}
                >
                  <span className="text-cedar/30 text-xs tabular-nums mt-1.5 font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-lg font-medium text-foreground mb-1.5">{s.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="section-areas" className={`${SECTION_PADDING.default}`} aria-labelledby="areas-heading">
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              label="WHERE WE WORK"
              headingId="areas-heading"
              heading="Calgary, Edmonton, and the towns in between."
            />
            <div className="flex flex-wrap gap-2 mt-10">
              {CONTACT.cities.map((city, i) => (
                <span
                  key={city}
                  className="text-sm text-muted-foreground border rounded-sm px-3 py-2.5 inline-flex items-center min-h-[44px] hover:text-foreground hover:bg-cedar/[0.04] hover:border-cedar/60 transition-[color,background-color,border-color] duration-300 grain-texture shadow-contact"
                  style={{ borderColor: `hsl(var(--cedar) / ${bronzeStep(i, CONTACT.cities.length)})` }}
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground/70 mt-6 italic">
              Not on the list? Ask anyway — we’ll let you know if we can travel.
            </p>
          </div>
        </div>
      </section>

      <QuoteCloserCard eyebrow="Up next" background="secondary" />

      <Footer />
    </main>
  );
};

export default About;
