import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { SERVICE_GROUPS, getItemsForGroup } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";

/**
 * Services — homepage section.
 *
 * Pass 30 — Fly4Me transposition: numbered editorial rows replace the
 * 3-up tile grid. The homepage rhythm now alternates photo/typographic
 * beats (Hero photo → Services typographic → Crew photo → Featured photo
 * → Testimonials typographic → MiniFaq typographic → Closer photo). Two
 * photo grids in a row diluted focus; this section earns its keep with
 * editorial restraint.
 *
 * 12-col grid per row: 01 (1) · Title (5) · Short copy (5) · ↗ (1).
 * Whole row is the quote-modal trigger.
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
      <div className="container mx-auto max-w-[1440px] container-x">
        <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
          {/* Editorial 12-col header — eyebrow / headline / trailing CTA */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 md:gap-y-10 mb-14 md:mb-20">
            <p className="md:col-span-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              What we build
            </p>
            <div className="md:col-span-6">
              <h2
                id="services-heading"
                className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.02] tracking-[-0.035em] text-balance"
              >
                Five categories.
                <br />
                Fifteen services.
              </h2>
            </div>
            <div className="md:col-span-3 md:flex md:items-end md:justify-end">
              <button
                type="button"
                onClick={() => openModal()}
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span className="link-underline">Start a quote</span>
                <span className="link-arrow text-cedar">↗</span>
              </button>
            </div>
          </div>

          {/* Numbered rows — single faint top hairline; rows divided only at bottom */}
          <ul className="border-t border-cedar/15" role="list">
            {SERVICE_GROUPS.map((group, i) => {
              const groupItemIds = getItemsForGroup(group.id).map((s) => s.id);
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={group.id} role="listitem" className="border-b border-cedar/10">
                  <button
                    type="button"
                    onClick={() => openModal(groupItemIds)}
                    aria-label={`Get my free quote — ${group.title}`}
                    className="group w-full text-left grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-2 items-baseline py-8 md:py-10 transition-colors duration-300 hover:bg-cedar/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="col-span-2 md:col-span-1 text-[11px] uppercase tracking-[0.22em] text-cedar/55 tabular-nums text-right md:text-left">
                      {n}
                    </span>
                    <h3 className="col-span-10 md:col-span-5 font-serif text-2xl md:text-3xl text-foreground tracking-[-0.02em] leading-[1.15]">
                      <span className="link-underline group-hover:[background-size:100%_1px]">
                        {group.title}
                      </span>
                    </h3>
                    <p className="hidden md:block md:col-span-5 text-base text-muted-foreground/85 leading-relaxed text-pretty">
                      {group.description}
                    </p>
                    <span
                      aria-hidden
                      className="hidden md:flex md:col-span-1 md:items-center md:justify-end text-cedar/45 group-hover:text-cedar transition-colors"
                    >
                      <ArrowUpRight className="link-arrow h-5 w-5" strokeWidth={1.5} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
