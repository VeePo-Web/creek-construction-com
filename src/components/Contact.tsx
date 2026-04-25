import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { Phone, Mail } from "lucide-react";
import { CONTACT } from "@/config/contact";

const Contact = () => {
  return (
    <section
      id="section-contact"
      className="py-24 md:py-32 bg-background relative overflow-hidden grain-overlay"
      aria-labelledby="contact-heading"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div
        className="absolute top-0 inset-x-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(180deg, hsl(var(--evergreen) / 0.06) 0%, transparent 100%)" }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <SectionHeader
                numeral="VI"
                label="START HERE"
                headingId="contact-heading"
                heading="Let's Build Something Right."
                subheading="Free quote. No high-pressure sales. We'll give you straight answers."
              />

              <ScrollRevealMotion delay={0.2}>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Tell us about your project — size, timing, materials you're considering. We'll come look,
                  give you an honest scope and a fair price in writing, and let you take it from there.
                </p>
              </ScrollRevealMotion>

              <ScrollRevealMotion delay={0.3}>
                <div
                  className="relative pl-8 py-5 my-10"
                  style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.3)", marginLeft: "-0.15em" }}
                >
                  <span className="quote-mark-float absolute -top-3 -left-1" aria-hidden>
                    {"\u201C"}
                  </span>
                  <p className="text-xl font-serif italic text-foreground/55 leading-snug pt-6">
                    Excellence in the work. Pride in every detail.
                  </p>
                </div>
              </ScrollRevealMotion>

              <ScrollRevealMotion delay={0.4}>
                <CedarCTA>Request a Quote</CedarCTA>
              </ScrollRevealMotion>
            </div>

            <div>
              <ScrollRevealMotion delay={0.2}>
                <h3 className="text-minimal text-muted-foreground mb-6">DIRECT CONTACT</h3>
                <div className="space-y-3 mb-10">
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    className="grain-texture flex items-center gap-4 px-5 py-4 rounded-sm shadow-contact border border-border/40 hover:border-cedar/40 hover:bg-cedar/[0.03] hover:shadow-elevated transition-all duration-500 group/contact min-h-[44px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                    style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.5)" }}
                  >
                    <Phone className="h-4 w-4 text-cedar group-hover/contact:scale-110 transition-transform duration-500" aria-hidden />
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Call or Text</p>
                      <p className="text-foreground font-medium group-hover/contact:text-cedar transition-colors duration-500">
                        {CONTACT.phone}
                      </p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="grain-texture flex items-center gap-4 px-5 py-4 rounded-sm shadow-contact border border-border/40 hover:border-cedar/40 hover:bg-cedar/[0.03] hover:shadow-elevated transition-all duration-500 group/contact min-h-[44px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                    style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.8)" }}
                  >
                    <Mail className="h-4 w-4 text-cedar group-hover/contact:scale-110 transition-transform duration-500 shrink-0" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Email</p>
                      <p className="text-foreground font-medium group-hover/contact:text-cedar transition-colors duration-500 truncate">
                        {CONTACT.email}
                      </p>
                    </div>
                  </a>
                </div>
              </ScrollRevealMotion>

              <ScrollRevealMotion delay={0.3}>
                <h3 className="text-minimal text-muted-foreground mb-6">SERVICE AREAS</h3>
                <div className="flex flex-wrap gap-2 mb-10" role="list" aria-label="Service areas">
                  {CONTACT.cities.map((city, i) => {
                    const baseOpacity = 0.15 + (i / (CONTACT.cities.length - 1)) * 0.55;
                    return (
                      <span
                        key={city}
                        role="listitem"
                        className="text-sm text-muted-foreground border rounded-sm px-3 py-2 min-h-[40px] flex items-center transition-all duration-500 cursor-default hover:text-foreground hover:bg-cedar/[0.04] hover:border-cedar/60 grain-texture shadow-contact"
                        style={{ borderColor: `hsl(var(--cedar) / ${baseOpacity})` }}
                      >
                        {city}
                      </span>
                    );
                  })}
                </div>
              </ScrollRevealMotion>

              <ScrollRevealMotion delay={0.45}>
                <div className="card-glass grain-texture shadow-contact border border-border/40 p-8 rounded-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-cedar/20" />
                    <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">
                      What to expect
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3"><span className="text-cedar">·</span>Reply within 24–48 hours</li>
                    <li className="flex gap-3"><span className="text-cedar">·</span>On-site visit at your convenience</li>
                    <li className="flex gap-3"><span className="text-cedar">·</span>Written quote — clear scope, clear price</li>
                    <li className="flex gap-3"><span className="text-cedar">·</span>No deposit required to receive your quote</li>
                  </ul>
                </div>
              </ScrollRevealMotion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
