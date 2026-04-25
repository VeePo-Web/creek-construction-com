import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import { CONTACT } from "@/config/contact";

const About = () => {
  useDocumentTitle(
    "About",
    "Creek Construction — locally owned residential exterior contractor serving Calgary, Edmonton, and surrounding Alberta.",
  );

  const steps = [
    { title: "Request", desc: "Tell us what you're building. Online form, a call, or a text — whatever's easiest." },
    { title: "Site Visit & Quote", desc: "We come look in person. Honest scope, fair price, in writing — usually within 48 hours." },
    { title: "Schedule", desc: "We lock in a start date and a realistic finish date. No vague windows." },
    { title: "Build", desc: "Our crew, on-site. We protect your property, clean up daily, and stay in touch." },
    { title: "Walkthrough & Warranty", desc: "We walk it together at the end. If something isn't right, we make it right." },
  ];

  return (
    <main className="min-h-screen bg-background" aria-label="About — Creek Construction">
      <Navigation />

      <section className="relative bg-evergreen text-evergreen-foreground py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 60%, hsl(150 30% 6%) 100%)",
          }}
        />
        <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[10px] tracking-[0.2em] uppercase">
            <Link to="/" className="text-evergreen-foreground/40 hover:text-cedar transition-colors">Home</Link>
            <span className="text-evergreen-foreground/20">·</span>
            <span className="text-cedar/80">About</span>
          </nav>
          <h1 className="font-serif text-evergreen-foreground mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Built on the work itself.
          </h1>
          <p className="text-lg text-evergreen-foreground/70 italic font-serif max-w-xl">
            Locally owned. Calgary and Edmonton. No gimmicks — just the craft.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 grain-overlay" aria-labelledby="story-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <SectionHeader
              numeral="II"
              label="WHO WE ARE"
              headingId="story-heading"
              heading="A small crew that takes the work seriously."
            />
            <ScrollRevealMotion delay={0.2}>
              <div className="space-y-6 mt-8 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Creek Construction is a locally owned, residential-exterior contractor working
                  across the Calgary and Edmonton metros. We build decks, fences, sheds, pergolas —
                  and we paint, side, and repair the parts of your home that face the weather.
                </p>
                <p>
                  We don't subcontract the build. The crew you meet at the quote is the crew on-site
                  doing the work. That's how we keep quality consistent, and it's why we'd rather do
                  fewer projects exceptionally well than chase volume.
                </p>
                <p>
                  Our marketing is the work itself. If a job doesn't earn the next referral, we
                  treat that as a failure on our end. That's the standard.
                </p>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-secondary grain-overlay" aria-labelledby="process-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <SectionHeader
              numeral="III"
              label="HOW WE WORK"
              headingId="process-heading"
              heading="The Creek Process."
              subheading="Five steps. Nothing surprising along the way."
              badge="05 Steps"
            />

            <div className="space-y-4 mt-12" role="list">
              {steps.map((s, i) => {
                const opacity = 0.2 + (i / (steps.length - 1)) * 0.65;
                return (
                  <ScrollRevealMotion key={i} delay={i * 0.08}>
                    <div
                      role="listitem"
                      className="flex items-start gap-5 pl-6 py-5 rounded-sm transition-all duration-500 hover:bg-cedar/[0.03] hover:pl-8 hover:shadow-elevated grain-texture shadow-contact border border-border/40 bg-background"
                      style={{ borderLeft: `2px solid hsl(var(--cedar) / ${opacity})` }}
                    >
                      <span className="text-cedar/30 text-xs tabular-nums mt-1.5 font-medium">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-1.5">{s.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </ScrollRevealMotion>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 grain-overlay" aria-labelledby="areas-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <SectionHeader
              numeral="IV"
              label="WHERE WE WORK"
              headingId="areas-heading"
              heading="Calgary, Edmonton, and the towns in between."
            />
            <div className="flex flex-wrap gap-2 mt-10">
              {CONTACT.cities.map((city, i) => {
                const baseOpacity = 0.15 + (i / (CONTACT.cities.length - 1)) * 0.55;
                return (
                  <span
                    key={city}
                    className="text-sm text-muted-foreground border rounded-sm px-3 py-2 hover:text-foreground hover:bg-cedar/[0.04] hover:border-cedar/60 transition-all duration-500 grain-texture shadow-contact"
                    style={{ borderColor: `hsl(var(--cedar) / ${baseOpacity})` }}
                  >
                    {city}
                  </span>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground/70 mt-6 italic">
              Not on the list? Ask anyway — we'll let you know if we can travel.
            </p>

            <div className="mt-12">
              <CedarCTA>Request a Quote</CedarCTA>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
