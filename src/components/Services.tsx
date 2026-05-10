import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { HEADLINE } from "@/lib/typography";
import { useReveal } from "@/hooks/useReveal";

/**
 * Services — homepage editorial list. Pass 48: collapsed to a single
 * flat list of 16 services with one description each. Same hairline
 * rhythm and hover-cedar marker as before.
 */
const Services = () => {
  const { openModal } = useQuoteModal();
  const { ref, cls, style } = useReveal();

  return (
    <section
      id="section-services"
      className={`${SECTION_PADDING.default} bg-background min-h-[100svh] flex flex-col justify-center`}
      aria-labelledby="services-heading"
    >
      <div className="container-page">
        <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 mb-14 md:mb-20">
            <p className="eyebrow md:col-span-3">What we build</p>
            <div className="md:col-span-9">
              <h2
                id="services-heading"
                className={`${HEADLINE.section} leading-[1.02]`}
              >
                Sixteen services.
                <br />
                One crew.
              </h2>
            </div>
          </div>

          <ul role="list">
            {SERVICES.map((service, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={service.id} role="listitem" className="hairline">
                  <button
                    type="button"
                    onClick={() => openModal([service.id])}
                    aria-label={`Get my free quote — ${service.title}`}
                    className="group relative w-full text-left grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-2 items-baseline py-6 md:py-7 pl-3 md:pl-5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-2 bottom-2 w-0 bg-cedar transition-all duration-300 group-hover:w-[2px]"
                    />
                    <span className="col-span-2 md:col-span-1 eyebrow-base text-cedar/55 tabular-nums text-right md:text-left">
                      {n}
                    </span>
                    <h3 className="col-span-10 md:col-span-5 font-serif text-xl md:text-2xl text-foreground tracking-[-0.02em] leading-[1.2]">
                      <span className="link-underline group-hover:[background-size:100%_1px]">
                        {service.title}
                      </span>
                    </h3>
                    <p className="hidden md:block md:col-span-5 text-sm text-muted-foreground/85 leading-relaxed text-pretty">
                      {service.description}
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
