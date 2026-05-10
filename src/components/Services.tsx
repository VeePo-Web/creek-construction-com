import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICE_GROUPS, getItemsForGroup } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { HEADLINE } from "@/lib/typography";
import { useReveal } from "@/hooks/useReveal";

/**
 * Services — homepage editorial rows. Pass 33: tightened rhythm,
 * removed duplicate "Start a quote" header CTA in favor of an end-of-list
 * footnote, added a left-edge cedar marker that animates in on hover
 * (no row-height shift), uniform .hairline dividers throughout.
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
          {/* Calm editorial header — single eyebrow + headline, no trailing CTA */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 mb-14 md:mb-20">
            <p className="eyebrow md:col-span-3">What we build</p>
            <div className="md:col-span-9">
              <h2
                id="services-heading"
                className={`${HEADLINE.section} leading-[1.02]`}
              >
                Five categories.
                <br />
                Fifteen services.
              </h2>
            </div>
          </div>

          {/* Numbered rows — top hairline; rows divided by .hairline */}
          <ul role="list">
            {SERVICE_GROUPS.map((group, i) => {
              const groupItemIds = getItemsForGroup(group.id).map((s) => s.id);
              const n = String(i + 1).padStart(2, "0");
              const isFirst = i === 0;
              return (
                <li key={group.id} role="listitem" className={isFirst ? "hairline" : "hairline"}>
                  <button
                    type="button"
                    onClick={() => openModal(groupItemIds)}
                    aria-label={`Get my free quote — ${group.title}`}
                    className="group relative w-full text-left grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-2 items-baseline py-7 md:py-9 pl-3 md:pl-5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {/* Apple-style left index marker — 0 → 2px on hover */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-2 bottom-2 w-0 bg-cedar transition-all duration-300 group-hover:w-[2px]"
                    />
                    <span className="col-span-2 md:col-span-1 eyebrow-base text-cedar/55 tabular-nums text-right md:text-left">
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
            {/* End-of-list footnote — Apple-grade calm closer */}
            <li className="hairline">
              <Link
                to="/contact"
                className="group flex items-center justify-between py-6 md:py-7 pl-3 md:pl-5 eyebrow opacity-70 hover:opacity-100 transition-opacity"
              >
                <span>Don’t see what you need? Ask anyway.</span>
                <ArrowUpRight className="h-4 w-4 group-hover:text-cedar transition-colors" strokeWidth={1.5} aria-hidden />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;

