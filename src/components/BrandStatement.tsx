import { useReveal } from "@/hooks/useReveal";
import { SECTION_PADDING } from "@/lib/spacing";
import { HEADLINE } from "@/lib/typography";

/**
 * BrandStatement — Fly4Me-style centered editorial wall-text plate.
 *
 * Sits between Hero and Services. Hairline above and below frames the
 * statement as a quoted plate rather than a section. Three discrete
 * thoughts joined by middle dots — Apple-typeset.
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
          className={`max-w-3xl mx-auto text-center ${cls}`}
          style={style}
        >
          <hr className="hairline border-0 mt-10 md:mt-14" aria-hidden />
          <p className="eyebrow mt-10 md:mt-14 mb-8 md:mb-10">Est. 2019 · Alberta</p>
          <p className={`${HEADLINE.section} leading-[1.1] mx-auto max-w-[46ch]`}>
            How we work shows up in the work itself
            <span className="text-cedar/40"> · </span>
            we don’t subcontract the build
            <span className="text-cedar/40"> · </span>
            we’d rather do fewer projects exceptionally well.
          </p>
          <hr className="hairline border-0 mt-10 md:mt-14" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
