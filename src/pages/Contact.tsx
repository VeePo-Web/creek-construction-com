import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT } from "@/config/contact";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";

const Contact = () => {
  useDocumentTitle(
    "Contact",
    `Get in touch with Creek Construction — call ${CONTACT.phone} or email ${CONTACT.email}. Free quotes across Calgary, Edmonton, and surrounding Alberta.`,
  );

  return (
    <main className="min-h-screen bg-background" aria-label="Contact — Creek Construction">
      <Navigation />

      <section className="relative bg-evergreen text-evergreen-foreground py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 60%, hsl(150 30% 6%) 100%)",
          }}
        />
        <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[10px] tracking-[0.2em] uppercase">
            <Link to="/" className="text-evergreen-foreground/40 hover:text-cedar transition-colors">Home</Link>
            <span className="text-evergreen-foreground/20">·</span>
            <span className="text-cedar/80">Contact</span>
          </nav>
          <h1 className="font-serif text-evergreen-foreground mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Let's talk about your project.
          </h1>
          <p className="text-lg text-evergreen-foreground/70 italic font-serif max-w-xl">
            Free quote. No high-pressure sales. Honest answers.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 grain-overlay" aria-labelledby="contact-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            {/* Contact info */}
            <div>
              <SectionHeader
                numeral="II"
                label="DIRECT"
                headingId="contact-heading"
                heading="Reach us directly."
                subheading="The fastest way is the phone."
              />

              <div className="space-y-3 mt-10">
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="grain-texture flex items-center gap-4 px-5 py-5 rounded-sm shadow-contact border border-border/40 hover:border-cedar/40 hover:bg-cedar/[0.03] hover:shadow-elevated transition-all duration-500 group min-h-[44px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                  style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.4)" }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Call or Text</p>
                    <p className="text-foreground font-medium group-hover:text-cedar transition-colors duration-500">
                      {CONTACT.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="grain-texture flex items-center gap-4 px-5 py-5 rounded-sm shadow-contact border border-border/40 hover:border-cedar/40 hover:bg-cedar/[0.03] hover:shadow-elevated transition-all duration-500 group min-h-[44px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                  style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.65)" }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Email</p>
                    <p className="text-foreground font-medium group-hover:text-cedar transition-colors duration-500 truncate">
                      {CONTACT.email}
                    </p>
                  </div>
                </a>

                <div
                  className="grain-texture flex items-center gap-4 px-5 py-5 rounded-sm shadow-contact border border-border/40"
                  style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.85)" }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Response Time</p>
                    <p className="text-foreground font-medium">Within 24–48 hours</p>
                  </div>
                </div>

                <div
                  className="grain-texture flex items-start gap-4 px-5 py-5 rounded-sm shadow-contact border border-border/40"
                  style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.95)" }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-cedar/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-cedar" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">Service Areas</p>
                    <p className="text-foreground font-medium">Calgary, Edmonton & surrounding Alberta</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Including {CONTACT.cities.slice(0, 4).join(", ")} + more
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote CTA card */}
            <ScrollRevealMotion delay={0.2}>
              <div
                className="rounded-sm overflow-hidden relative grain-texture"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--evergreen)) 0%, hsl(150 25% 10%) 100%)",
                  borderLeft: "3px solid hsl(var(--cedar))",
                }}
              >
                <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
                <div className="relative z-10 p-10 md:p-12">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-4">
                    The fastest path
                  </p>
                  <h2 className="font-serif text-evergreen-foreground text-3xl md:text-4xl leading-tight mb-5">
                    Send us your project details.
                  </h2>
                  <p className="text-evergreen-foreground/70 leading-relaxed mb-8">
                    A quick, three-step form. Tell us what you're building, where you're located,
                    and how you'd like us to reach you. We'll be in touch within 24–48 hours.
                  </p>

                  <ul className="space-y-2 text-sm text-evergreen-foreground/60 mb-10">
                    <li className="flex gap-3"><span className="text-cedar">·</span>Free, no-obligation quote</li>
                    <li className="flex gap-3"><span className="text-cedar">·</span>On-site visit at your convenience</li>
                    <li className="flex gap-3"><span className="text-cedar">·</span>Clear scope and price in writing</li>
                  </ul>

                  <CedarCTA>Request a Quote</CedarCTA>
                </div>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
