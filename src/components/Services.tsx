import SectionHeader from "@/components/SectionHeader";
import { SERVICE_GROUPS, getItemsForGroup } from "@/config/services";
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
 * Renders the five service GROUPS (not the fifteen individual items).
 * The full menu lives on /services; here we keep the editorial cadence of
 * five confident tiles. Clicking a tile opens the QuoteModal with no
 * preselection — the user picks which item(s) inside that group.
 */
const Services = () => {
  const { openModal } = useQuoteModal();
  const { ref, cls, style } = useReveal();

  return (
    <section
      id="section-services"
      className={`${SECTION_PADDING.default} bg-background`}
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-5 sm:px-6">
        <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
          <div className="mb-16">
            <SectionHeader
              variant="quiet"
              label="WHAT WE BUILD"
              headingId="services-heading"
              heading="Five categories. Fifteen services."
              
            />
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${GRID_GAP.default} sm:[&>*:nth-child(5)]:col-span-2 sm:[&>*:nth-child(5)]:max-w-[calc(50%-1rem)] sm:[&>*:nth-child(5)]:mx-auto lg:[&>*:nth-child(5)]:col-span-1 lg:[&>*:nth-child(5)]:max-w-none lg:[&>*:nth-child(5)]:col-start-2 lg:[&>*:nth-child(5)]:mx-0`} role="list">
            {SERVICE_GROUPS.map((group, i) => {
              const Icon = group.icon;
              const opacity = bronzeStep(i, SERVICE_GROUPS.length);
              const groupItemIds = getItemsForGroup(group.id).map((s) => s.id);
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => openModal(groupItemIds)}
                  role="listitem"
                  aria-label={`Get my free quote — ${group.title}`}
                  className="group w-full text-left flex flex-col items-stretch overflow-hidden rounded-sm transition-[background-color] duration-300 hover:bg-cedar/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 cursor-pointer min-h-[280px] lg:min-h-[320px] border border-border/40"
                  style={{
                    borderLeftWidth: "3px",
                    borderLeftColor: `hsl(var(--cedar) / ${opacity})`,
                  }}
                >
                  <MediaSlot
                    query={{
                      service: group.mediaCategory as ServiceCategory,
                      kind: "image",
                      min_quality: "reference",
                    }}
                    sizes={MEDIA_SIZES.THIRD}
                    wrapperClassName="w-full aspect-hero relative overflow-hidden"
                    className="transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                    fallbackVariant="stone"
                    fallbackIcon={Icon}
                    fallbackCaption={`${group.title} · new work coming`}
                  />

                  <div className="p-6 flex flex-col flex-1">
                    <Icon
                      className="h-5 w-5 text-cedar/70 mb-3 transition-colors duration-300 group-hover:text-cedar"
                      aria-hidden
                      strokeWidth={1.5}
                    />
                    <h3 className="font-serif text-2xl text-foreground mb-2 transition-colors duration-300 group-hover:text-cedar">
                      {group.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {group.short}
                    </p>
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
