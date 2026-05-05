import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import CedarCTA from "@/components/CedarCTA";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import MiniFaq from "@/components/MiniFaq";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";

const Contact = () => {
  useDocumentTitle(
    "Contact",
    `Get in touch with Creek Construction — call ${CONTACT.phone} or email ${CONTACT.email}. Free quotes across Calgary, Edmonton, and surrounding Alberta.`,
  );

  // Four contact rows, sharing the bronze crescendo so the eye sweeps top-to-bottom.
  const ROW_COUNT = 4;

  return (
    <main className="min-h-screen bg-background" aria-label="Contact — Creek Construction">
      <Navigation />
      <SkipToContent target="section-contact" />

      <PageHero
        variant="evergreen-typographic"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        numeral="I"
        sectionLabel="GET IN TOUCH"
        title={["Let's talk about", "your project."]}
        italic="Free quote. Honest answers."
        subtitle="No high-pressure sales. We respond within 24–48 hours."
        triptychQueries={[
          { service: "decks", shot_type: ["hero", "elevation"], min_quality: "reference", kind: "image" },
          { shot_type: ["detail", "process"], min_quality: "reference", kind: "image" },
          { shot_type: ["wide", "interior", "elevation"], min_quality: "reference", kind: "image" },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <CedarCTA />
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-evergreen-foreground/65 hover:text-evergreen-foreground transition-colors min-h-[44px] px-2"
          >
            or call {CONTACT.phone}
          </a>
        </div>
      </PageHero>

      <section id="section-contact" className={`${SECTION_PADDING.default}`} aria-labelledby="contact-heading">
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.wide} mx-auto grid md:grid-cols-2 gap-16 items-start`}>
            {/* Contact info — single panel with hairline rows */}
            <div>
              <SectionHeader
                numeral="II"
                label="DIRECT"
                headingId="contact-heading"
                heading="Reach us directly."
                subheading="The fastest way is the phone."
              />

              <aside
                className="mt-10 rounded-sm border border-border/40 grain-texture shadow-contact overflow-hidden"
                style={{ borderLeft: `2px solid hsl(var(--cedar) / ${bronzeStep(0, ROW_COUNT)})` }}
                aria-label="Direct contact details"
              >
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="flex items-center gap-4 px-5 py-5 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Call or Text</p>
                    <p className="text-foreground font-medium group-hover/row:text-cedar transition-colors duration-200">
                      {CONTACT.phone}
                    </p>
                  </div>
                </a>

                <div className="border-t border-border/30" aria-hidden />

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-4 px-5 py-5 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Email</p>
                    <p className="text-foreground font-medium group-hover/row:text-cedar transition-colors duration-200 truncate">
                      {CONTACT.email}
                    </p>
                  </div>
                </a>

                <div className="border-t border-border/30" aria-hidden />

                <div className="flex items-center gap-4 px-5 py-5">
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Response Time</p>
                    <p className="text-foreground font-medium">Within 24–48 hours</p>
                  </div>
                </div>

                <div className="border-t border-border/30" aria-hidden />

                <div className="flex items-start gap-4 px-5 py-5">
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">Service Areas</p>
                    <p className="text-foreground font-medium">Calgary, Edmonton &amp; surrounding Alberta</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Including {CONTACT.cities.slice(0, 4).join(", ")} + more
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            {/* Quote CTA card — shared closer used identically across the site */}
            <div id="section-contact-next" className="scroll-mt-24">
              <QuoteCloserCard asSection={false} />
            </div>
          </div>
        </div>
      </section>

      <MiniFaq background="secondary" />

      <Footer />
    </main>
  );
};

export default Contact;
