import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { Check, Minus } from "lucide-react";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import type { ServiceCategory } from "@/lib/api/public-media";
import { BACKDROP, bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";
import { HEADLINE } from "@/lib/typography";

/**
 * Services — homepage section. Token-driven:
 *  - Spacing: SECTION_PADDING.default, GRID_GAP.default
 *  - Color: bronzeStep() drives the responsibility-matrix bronze gradient
 *  - Backdrops: BACKDROP.evergreenPlate / bronzeWash from /lib/colors
 *  - No grain on the section root — grain is reserved for the matrix plate
 *    only, so it reads as the textural moment of the section.
 */
const Services = () => {
  const { openModal } = useQuoteModal();

  const weHandle = [
    "Site assessment and accurate quote",
    "Materials sourcing — quality first, price second",
    "Permits where required",
    "The actual build, by our crew (not subbed out)",
    "Daily cleanup and a clean site at handover",
    "Final walkthrough + warranty on our workmanship",
  ];

  const youHandle = [
    { task: "Property access on build days", note: "We coordinate the schedule with you" },
    { task: "HOA or strata approvals if applicable", note: "We'll provide drawings or specs you can submit" },
    { task: "Color and material preferences", note: "We'll show you options that fit your budget" },
    { task: "Paying invoices on agreed milestones", note: "Clear, written, no surprises" },
  ];

  return (
    <section
      id="section-services"
      className={`${SECTION_PADDING.default} bg-background relative`}
      aria-labelledby="services-heading"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1200px" }}
    >
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--secondary)) 100%)" }}
      />
      <div className="container mx-auto px-6">
        <div className={`${MAX_WIDTH.wide} mx-auto`}>
          <div className="mb-16">
            <SectionHeader
              numeral="II"
              label="WHAT WE BUILD"
              headingId="services-heading"
              heading="Six Things, Done Right."
              subheading="Residential exterior construction across Alberta."
              badge={`0${SERVICES.length} Services`}
            />
          </div>

          {/* Services grid — clickable cards open the modal pre-selected */}
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 ${GRID_GAP.default}`} role="list">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              const opacity = bronzeStep(i, SERVICES.length);
              return (
                <ScrollRevealMotion key={service.id} delay={i * 0.08} y={28}>
                  <button
                    type="button"
                    onClick={() => openModal([service.id])}
                    role="listitem"
                    aria-label={`Request a quote for ${service.title}`}
                    className="group w-full text-left flex flex-col items-stretch overflow-hidden rounded-sm transition-all duration-500 shadow-contact hover:shadow-elevated hover:bg-cedar/[0.03] hover:translate-y-[-3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 cursor-pointer min-h-[320px] border border-border/60"
                    style={{
                      borderLeftWidth: "3px",
                      borderLeftColor: `hsl(var(--cedar) / ${opacity})`,
                    }}
                  >
                    <MediaSlot
                      query={{
                        service: service.id as ServiceCategory,
                        shot_type: ["hero", "detail", "wide"],
                        kind: "image",
                        min_quality: "portfolio",
                      }}
                      sizes={MEDIA_SIZES.THIRD}
                      wrapperClassName="w-full aspect-hero relative"
                      className="transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                      fallback={
                        <div
                          className="w-full aspect-hero relative overflow-hidden"
                          style={{ background: BACKDROP.evergreenPlate }}
                        >
                          <Icon
                            className="absolute inset-0 m-auto h-12 w-12 text-cedar/40 transition-all duration-700 group-hover:text-cedar/70 group-hover:scale-110"
                            aria-hidden
                            strokeWidth={1.4}
                          />
                        </div>
                      }
                    />

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between w-full mb-3">
                        <Icon className="h-5 w-5 text-cedar/70 transition-colors duration-500 group-hover:text-cedar" aria-hidden strokeWidth={1.5} />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-2xl text-foreground mb-2 transition-colors duration-500 group-hover:text-cedar">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                      <span className="text-[10px] tracking-[0.18em] uppercase text-cedar/70 group-hover:text-cedar transition-colors duration-500 mt-4">
                        Request a Quote →
                      </span>
                    </div>
                  </button>
                </ScrollRevealMotion>
              );
            })}
          </div>

          <ScrollRevealMotion delay={0.1} className="mt-10 text-center">
            <p className="text-sm text-muted-foreground italic">
              Need something else exterior?{" "}
              <button onClick={() => openModal()} className="text-cedar hover:underline">
                Just ask
              </button>
              .
            </p>
          </ScrollRevealMotion>

          {/* Editorial breathing divider */}
          <ScrollRevealMotion delay={0.1} className="mt-24 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-cedar/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-cedar/30" />
              <div className="w-12 h-px bg-cedar/20" />
            </div>
          </ScrollRevealMotion>

          {/* Responsibility Matrix — grain reserved for these two plates only */}
          <div className="mt-16 grid md:grid-cols-2 gap-0" style={{ contain: "layout style" }}>
            <ScrollRevealMotion delay={0} y={40}>
              <div
                aria-label="What we handle"
                className="grain-texture p-10 md:p-12 border border-cedar/20 rounded-sm h-full shadow-elevated hover:shadow-thermal hover:border-cedar/35 transition-all duration-700 hover:translate-y-[-4px]"
                style={{ background: BACKDROP.bronzeWash }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="text-minimal text-cedar">WE HANDLE</h3>
                  <span className="text-[11px] tracking-[0.2em] text-cedar/50 tabular-nums">
                    {String(weHandle.length).padStart(2, "0")} ITEMS
                  </span>
                </div>
                <div className="space-y-3" role="list">
                  {weHandle.map((item, i) => (
                    <div
                      key={i}
                      role="listitem"
                      tabIndex={0}
                      className="flex items-start space-x-3 py-2.5 pl-3 rounded-sm transition-all duration-500 hover:bg-cedar/[0.05] hover:pl-5 cursor-default group/we focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      style={{ borderLeft: `2px solid hsl(var(--cedar) / ${bronzeStep(i, weHandle.length)})` }}
                    >
                      <Check
                        className="h-3.5 w-3.5 text-cedar/70 mt-0.5 flex-shrink-0 transition-colors duration-500 group-hover/we:text-cedar"
                        aria-hidden
                      />
                      <p className="text-foreground text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.15} y={40}>
              <div
                aria-label="What you handle"
                className="grain-texture p-10 md:p-12 border border-border/60 rounded-sm h-full shadow-contact hover:shadow-elevated hover:border-cedar/20 transition-all duration-500 hover:translate-y-[-2px]"
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="text-minimal text-muted-foreground">YOU HANDLE</h3>
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground/40 tabular-nums">
                    {String(youHandle.length).padStart(2, "0")} ITEMS
                  </span>
                </div>
                <div className="space-y-3" role="list">
                  {youHandle.map((item, i) => (
                    <div
                      key={i}
                      role="listitem"
                      tabIndex={0}
                      className="flex items-start space-x-3 py-2.5 pl-3 rounded-sm transition-all duration-500 hover:bg-accent/5 hover:pl-5 cursor-default group/you focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      style={{ borderLeft: "2px solid hsl(35 15% 86% / 0.5)" }}
                    >
                      <Minus
                        className="h-3.5 w-3.5 text-muted-foreground/40 mt-0.5 flex-shrink-0 transition-colors duration-500 group-hover/you:text-cedar/60"
                        aria-hidden
                      />
                      <div>
                        <p className="text-foreground text-sm transition-colors duration-500 group-hover/you:text-cedar">
                          {item.task}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-border/30">
                  <p className="text-sm text-signature text-foreground/40 italic">
                    The ratio speaks for itself — we handle the work so you can get on with your life.
                  </p>
                </div>
              </div>
            </ScrollRevealMotion>
          </div>

          {/* Section CTA */}
          <ScrollRevealMotion delay={0.15} className="mt-16 text-center">
            <CedarCTA>Request a Quote</CedarCTA>
          </ScrollRevealMotion>
        </div>
      </div>
    </section>
  );
};

export default Services;
