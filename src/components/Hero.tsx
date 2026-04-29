import { ShieldCheck, FileCheck, MapPin } from "lucide-react";

import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import PageHero from "@/components/ui/page-hero";

import TrustChips from "@/components/ui/trust-chip";
import StatTrio, { type StatItem } from "@/components/ui/stat-trio";

/**
 * Hero — homepage opener.
 *
 * Architect-bleed treatment (hero-only B/W override). The hero itself stays
 * radically minimal: one quiet photograph, a small uppercase eyebrow, one
 * oversized lighter serif headline, a hairline-divided subtitle + CTA,
 * and a bottom-right caption rail. Stats and trust chips have been lifted
 * out of the hero into sibling strips on the cream page background so the
 * hero reads as a single architectural plate.
 */

const STATS: StatItem[] = [
  { value: 7, suffix: "+", label: "Years on tools" },
  { value: 200, suffix: "+", label: "Projects built" },
  { value: 48, suffix: "h", label: "Quote turnaround" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "WCB covered" },
  { icon: FileCheck, label: "Fully insured" },
  { icon: MapPin, label: "Locally owned" },
];

const HeroStatsStrip = () => (
  <section
    aria-label="Creek Construction by the numbers"
    className="border-b border-cedar/15 bg-background"
  >
    <div className="container mx-auto px-6 py-8 md:py-10">
      <StatTrio items={STATS} variant="inline" />
    </div>
  </section>
);

const HeroTrustStrip = () => (
  <section aria-label="Trust signals" className="bg-background">
    <div className="container mx-auto px-6 py-6 md:py-7">
      <TrustChips items={TRUST_ITEMS} variant="rule" ariaLabel="Trust signals" />
    </div>
  </section>
);

const Hero = () => {
  return (
    <>
      <PageHero
        variant="architect-bleed"
        breadcrumb={[{ label: "Calgary · Edmonton · Alberta" }]}
        sectionLabel="Exterior Construction · Calgary · Edmonton"
        title={["Excellence in", "the Work."]}
        italic="Pride in every detail."
        subtitle="Decks, fencing, sheds, painting and siding — built to last across Alberta. Our crew owns the work from quote to final nail."
        query={{
          shot_type: ["hero", "elevation", "wide"],
          min_quality: "reference",
          kind: "image",
        }}
      >
        {/* Architect-grade CTA row — restrained, white-outline primary */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <CedarCTA className="!bg-transparent !text-white !border !border-white/70 hover:!bg-white/10">
            Request a Quote
          </CedarCTA>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors min-h-[44px] px-2"
          >
            or call {CONTACT.phone}
          </a>
        </div>
      </PageHero>

      <HeroStatsStrip />
      <HeroTrustStrip />
    </>
  );
};

export default Hero;
