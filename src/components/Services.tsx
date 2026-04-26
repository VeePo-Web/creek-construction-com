import SectionHeader from "@/components/SectionHeader";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import type { ServiceCategory } from "@/lib/api/public-media";
import { bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";

/**
 * Services — homepage section.
 *
 * One section reveal at the container root. Per-card stagger removed —
 * the user sees the grid as one block; staggering 6 cards by 80ms each
 * just adds 6 IO subscriptions for a 480ms collective fade nobody
 * consciously registers.
 */
const Services = () => {
  const { openModal } = useQuoteModal();
  const { ref, cls, style } = useReveal();

  return (
    <section
      id="section-services"
      className={`${SECTION_PADDING.default} bg-background`}
      aria-labelledby="services-heading"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1100px" }}
    >
      <div className="container mx-auto px-6">
        <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
          <div className="mb-16">
            <SectionHeader
              variant="quiet"
              label="WHAT WE BUILD"
              headingId="services-heading"
              heading="Six things, done right."
              subheading="Residential exterior construction across Alberta."
            />
          </div>

          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 ${GRID_GAP.default}`} role="list">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              const opacity = bronzeStep(i, SERVICES.length);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => openModal([service.id])}
                  role="listitem"
                  aria-label={`Request a quote for ${service.title}`}
                  className="group w-full text-left flex flex-col items-stretch overflow-hidden rounded-sm transition-[box-shadow,background-color] duration-300 shadow-contact hover:shadow-elevated hover:bg-cedar/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 cursor-pointer min-h-[320px] border border-border/60"
                  style={{
                    borderLeftWidth: "3px",
                    borderLeftColor: `hsl(var(--cedar) / ${opacity})`,
                  }}
                >
                  <MediaSlot
                    query={{
                      service: service.id as ServiceCategory,
                      kind: "image",
                      min_quality: "reference",
                    }}
                    sizes={MEDIA_SIZES.THIRD}
                    wrapperClassName="w-full aspect-hero relative overflow-hidden"
                    className="transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                    fallbackVariant="stone"
                    fallbackIcon={Icon}
                    fallbackCaption={`${service.title} · new work coming`}
                  />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between w-full mb-3">
                      <Icon className="h-5 w-5 text-cedar/70 transition-colors duration-300 group-hover:text-cedar" aria-hidden strokeWidth={1.5} />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-foreground mb-2 transition-colors duration-300 group-hover:text-cedar">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-cedar/70 group-hover:text-cedar transition-colors duration-300 mt-4">
                      Request a Quote →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
