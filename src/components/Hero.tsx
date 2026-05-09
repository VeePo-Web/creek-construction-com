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
      sectionLabel="Exterior Construction"
      title={["Excellence in", "the Work."]}
      subtitle="Decks, fencing, sheds, painting and siding — built to last across Alberta."
      query={{
        shot_type: ["hero", "elevation", "wide"],
        min_quality: "reference",
        kind: "image",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-3">
        <CedarCTA />
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/85 hover:text-white transition-colors min-h-[44px] px-2 tabular-nums whitespace-nowrap"
        >
          or call {CONTACT.phone}
        </a>
      </div>
    </PageHero>
  );
};

export default Hero;
