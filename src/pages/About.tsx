import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { CONTACT } from "@/config/contact";
import { bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { BODY } from "@/lib/typography";

const STEPS = [
  { title: "Request", desc: "Tell us what you\u2019re building. Online form, a call, or a text \u2014 whatever\u2019s easiest." },
  { title: "Site Visit & Quote", desc: "We come look in person. Honest scope, fair price, in writing \u2014 usually within 48 hours." },
  { title: "Schedule", desc: "We lock in a start date and a realistic finish date. No vague windows." },
  { title: "Build", desc: "Our crew, on-site. We protect your property, clean up daily, and stay in touch." },
  { title: "Walkthrough & Warranty", desc: "We walk it together at the end. If something isn\u2019t right, we make it right." },
];

const About = () => {
  useDocumentTitle(
    "About",
    "Creek Construction \u2014 locally owned residential exterior contractor serving Calgary, Edmonton, and surrounding Alberta.",
  );

  return (
    <main className="min-h-screen bg-background" aria-label="About \u2014 Creek Construction">
      <Navigation />

      <PageHero
        variant="evergreen"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About" }]}
        numeral="I"
        sectionLabel="OUR STORY"
        title="Built on the work itself."
        subtitle="Locally owned. Calgary and Edmonton. No gimmicks \u2014 just the craft."
      />

      <section className={`${SECTION_PADDING.default} grain-overlay`} aria-labelledby="story-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <SectionHeader
              numeral="II"
              label="WHO WE ARE"
              headingId="story-heading"
              heading="A small crew that takes the work seriously."
            />
            <ScrollRevealMotion delay={0.2}>
              <div className="space-y-6 mt-8">
                <p className={BODY.lead}>
                  Creek Construction is a locally owned, residential-exterior contractor working
                  across the Calgary and Edmonton metros. We build decks, fences, sheds, pergolas \u2014
                  and we paint, side, and repair the parts of your home that face the weather.
                </p>
                <p className={BODY.lead}>
                  We don\u2019t subcontract the build. The crew you meet at the quote is the crew on-site
                  doing the work. That\u2019s how we keep quality consistent, and it\u2019s why we\u2019d rather do
                  fewer projects exceptionally well than chase volume.
                </p>
                <p className={BODY.lead}>
                  Our marketing is the work itself. If a job doesn\u2019t earn the next referral, we
                  treat that as a failure on our end. That\u2019s the standard.
                </p>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <section className={`${SECTION_PADDING.default} bg-secondary grain-overlay`} aria-labelledby="process-heading">
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              numeral="III"
              label="HOW WE WORK"
              headingId="process-heading"
              heading="The Creek Process."
              subheading="Five steps. Nothing surprising along the way."
              badge="05 Steps"
            />

            <div className="space-y-4 mt-12" role="list">
              {STEPS.map((s, i) => (
                <ScrollRevealMotion key={i} delay={i * 0.08}>
                  <div
                    role="listitem"
                    className="flex items-start gap-5 pl-6 py-5 rounded-sm transition-all duration-500 hover:bg-cedar/[0.03] hover:pl-8 hover:shadow-elevated grain-texture shadow-contact border border-border/40 bg-background"
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
                </ScrollRevealMotion>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${SECTION_PADDING.default} grain-overlay`} aria-labelledby="areas-heading">
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              numeral="IV"
              label="WHERE WE WORK"
              headingId="areas-heading"
              heading="Calgary, Edmonton, and the towns in between."
            />
            <div className="flex flex-wrap gap-2 mt-10">
              {CONTACT.cities.map((city, i) => (
                <span
                  key={city}
                  className="text-sm text-muted-foreground border rounded-sm px-3 py-2 hover:text-foreground hover:bg-cedar/[0.04] hover:border-cedar/60 transition-all duration-500 grain-texture shadow-contact"
                  style={{ borderColor: `hsl(var(--cedar) / ${bronzeStep(i, CONTACT.cities.length)})` }}
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground/70 mt-6 italic">
              Not on the list? Ask anyway \u2014 we\u2019ll let you know if we can travel.
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
