import { useReveal } from "@/hooks/useReveal";
import { SECTION_PADDING } from "@/lib/spacing";

/**
 * BrandStatement — Fly4Me-style oversize editorial pull-quote.
 *
 * Sits between Hero and Services on the homepage. Single sentence,
 * massive serif, no garnish. Establishes voice before the catalogue.
 *
 * Layout: 3-col eyebrow / 9-col statement on md+, stacked on mobile.
 */
const BrandStatement = () => {
  const { ref, cls, style } = useReveal();

  return (
    <section
      aria-label="Creek Construction philosophy"
      className={`${SECTION_PADDING.calm} bg-background`}
    >
      <div className="container mx-auto max-w-[1440px] container-x">
        <div
          ref={ref}
          className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 ${cls}`}
          style={style}
        >
          <p className="md:col-span-3 text-[11px] uppercase tracking-[0.22em] text-cedar/65">
            Est. 2019 · Alberta
          </p>
          <p className="md:col-span-9 font-serif text-[clamp(1.875rem,4.2vw,3.5rem)] text-foreground/90 leading-[1.05] tracking-[-0.035em] text-balance">
            How we work shows up in the work itself. We don’t subcontract the build,
            we don’t surprise on price, and we’d rather do fewer projects exceptionally
            well.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
