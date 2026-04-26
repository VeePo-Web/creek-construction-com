import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { Phone, Mail } from "lucide-react";
import { CONTACT } from "@/config/contact";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { useReveal } from "@/hooks/useReveal";

/**
 * Contact — homepage closer.
 *
 * One section reveal at the container root (single IntersectionObserver
 * for the whole block). Right column is now ONE bordered panel with
 * internal hairline rows instead of 4 separate tiles, each with their
 * own grain + shadow + hover transition. Same information, ~5× fewer
 * paint roots, no per-tile hover noise.
 */
const Contact = () => {
  const { ref, cls, style } = useReveal();

  return (
    <section
      id="section-contact"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
      aria-labelledby="contact-heading"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 900px" }}
    >
      <div className="container mx-auto px-6">
        <div ref={ref} className={`max-w-7xl mx-auto ${cls}`} style={style}>
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <SectionHeader
                variant="quiet"
                label="THE NEXT STEP IS A CONVERSATION"
                headingId="contact-heading"
                heading="Let's build something right."
                subheading="Free quote. No high-pressure sales. We'll give you straight answers."
              />

              <p className="text-lg text-muted-foreground leading-relaxed mt-4 mb-10">
                Tell us about your project — size, timing, materials you're considering. We'll come look,
                give you an honest scope and a fair price in writing, and let you take it from there.
              </p>

              <CedarCTA>Request a Quote</CedarCTA>
            </div>

            <div>
              <MediaSlot
                query={{
                  shot_type: ["wide", "hero", "elevation"],
                  kind: "image",
                  min_quality: "portfolio",
                }}
                sizes={MEDIA_SIZES.HALF}
                wrapperClassName="aspect-detail w-full rounded-sm mb-8"
                cedarHover
                fallback={null}
              />

              {/* Single panel — phone / email / areas / expectations.
                  One border, one grain layer, internal hairlines between rows. */}
              <aside
                className="rounded-sm border border-border/40 grain-texture shadow-contact overflow-hidden"
                style={{ borderLeft: "2px solid hsl(var(--cedar) / 0.5)" }}
                aria-label="Direct contact and service information"
              >
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="flex items-center gap-4 px-5 py-4 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                >
                  <Phone className="h-4 w-4 text-cedar shrink-0" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Call or Text</p>
                    <p className="text-foreground font-medium group-hover/row:text-cedar transition-colors duration-200">
                      {CONTACT.phone}
                    </p>
                  </div>
                </a>

                <div className="border-t border-border/30" aria-hidden />

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-4 px-5 py-4 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                >
                  <Mail className="h-4 w-4 text-cedar shrink-0" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Email</p>
                    <p className="text-foreground font-medium group-hover/row:text-cedar transition-colors duration-200 truncate">
                      {CONTACT.email}
                    </p>
                  </div>
                </a>

                <div className="border-t border-border/30" aria-hidden />

                <div className="px-5 py-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">
                    Service Areas
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="list" aria-label="Service areas">
                    {CONTACT.cities.map((city) => (
                      <span
                        key={city}
                        role="listitem"
                        className="text-xs text-muted-foreground/80 px-2 py-1 border border-border/40 rounded-sm"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/30" aria-hidden />

                <div className="px-5 py-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">
                    What to expect
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex gap-2"><span className="text-cedar shrink-0">·</span>Reply within 24–48 hours</li>
                    <li className="flex gap-2"><span className="text-cedar shrink-0">·</span>On-site visit at your convenience</li>
                    <li className="flex gap-2"><span className="text-cedar shrink-0">·</span>Written quote — clear scope, clear price</li>
                    <li className="flex gap-2"><span className="text-cedar shrink-0">·</span>No deposit required to receive your quote</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
