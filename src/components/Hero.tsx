import { Phone } from "lucide-react";
import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import PageHero from "@/components/ui/page-hero";
import heroArchitectColor from "@/assets/hero-architect-color.jpg";
import { TRUST_LINE } from "@/config/trust-signals";

/**
 * Hero — homepage opener.
 *
 * Pass 44: full-color architect-bleed treatment. Uses a curated AI-rendered
 * cedar deck at golden hour with negative space on the left for typography.
 * Grayscale dropped sitewide on this variant.
 */
const Hero = () => {
  return (
    <PageHero
      variant="architect-bleed"
      title={["Excellence in", "the Work."]}
      subtitle="Outdoor work for Alberta homes — done by the same crew you meet."
      query={{
        shot_type: ["hero", "elevation", "wide"],
        min_quality: "reference",
        kind: "image",
      }}
      imageSrc={heroArchitectColor}
      imageAlt="Cedar deck on a modern Alberta home at golden hour, prairie horizon beyond."
      inColor
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <CedarCTA className="w-full sm:w-auto justify-center" />
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 border border-white/40 hover:border-white hover:bg-white/[0.08] active:bg-white/[0.14] active:scale-[0.98] active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 cta-label text-white/90 hover:text-white transition-colors duration-300 tabular-nums whitespace-nowrap rounded-[2px]"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          <span>Call {CONTACT.phone}</span>
        </a>
      </div>
      <p
        className="text-[10px] tracking-[0.18em] uppercase text-white/35 mt-1"
        style={{ fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)" }}
      >
        {TRUST_LINE}
      </p>
    </PageHero>
  );
};

export default Hero;
