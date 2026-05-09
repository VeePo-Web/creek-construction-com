import { Phone } from "lucide-react";
import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import PageHero from "@/components/ui/page-hero";

/**
 * Hero — homepage opener.
 *
 * Pass 31: stripped to Fly4Me-grade calm. One photograph, eyebrow,
 * 2-line serif headline, single sentence, primary CTA + ghost call link.
 * Stat trio moved off the hero — proof now lives in the dedicated
 * sub-pages and the closer.
 */
const Hero = () => {
  return (
    <PageHero
      variant="architect-bleed"
      breadcrumb={[{ label: "Calgary · Edmonton · Alberta" }]}
      sectionLabel="Calgary · Edmonton · Alberta"
      title={["Excellence in", "the Work."]}
      subtitle="Outdoor work for Alberta homes — done by the same crew you meet."
      query={{
        shot_type: ["hero", "elevation", "wide"],
        min_quality: "reference",
        kind: "image",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <CedarCTA />
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 border border-white/30 hover:border-white hover:bg-white/[0.06] text-[11px] tracking-[0.22em] uppercase text-white/85 hover:text-white transition-colors duration-300 tabular-nums whitespace-nowrap rounded-[2px]"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          <span>Call {CONTACT.phone}</span>
        </a>
      </div>
    </PageHero>
  );
};

export default Hero;
