import { ShieldCheck, FileCheck, MapPin } from "lucide-react";

import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import PageHero from "@/components/ui/page-hero";

import TrustChips from "@/components/ui/trust-chip";
import StatTrio, { type StatItem } from "@/components/ui/stat-trio";

/**
 * Hero — homepage opener.
 *
 * Now a thin consumer of <PageHero variant="editorial-split">. The variant
 * handles all backgrounds, kinetic typography, photo card, provenance card,
 * LCP preload, and reduced-motion fallback. This file owns the *content*:
 * the headline copy, the trust chips, the dual CTA, the stats card.
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

const Hero = () => {
  return (
    <PageHero
      variant="editorial-split"
      breadcrumb={[{ label: "Calgary · Edmonton · Alberta" }]}
      sectionLabel="EXTERIOR CONSTRUCTION"
      title={["Excellence in", "the Work."]}
      italic="Pride in every detail."
      subtitle="Decks, fencing, sheds, painting and siding — built to last across Alberta. Our crew owns the work from quote to final nail."
      query={{
        shot_type: ["hero", "elevation", "wide"],
        min_quality: "hero",
        kind: "image",
      }}
      provenance={{
        eyebrow: "Built on the work",
        children: <StatTrio items={STATS} variant="inline" />,
      }}
    >
      {/* Trust rule + dual CTA — homepage chrome */}
      <TrustChips
        items={TRUST_ITEMS}
        variant="rule"
        onDark
        className="mb-10"
        ariaLabel="Trust signals"
      />

      <div className="flex flex-wrap items-center gap-6">
        <CedarCTA>Request a Quote</CedarCTA>
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-evergreen-foreground/70 hover:text-cedar transition-colors min-h-[44px] px-2"
        >
          or call {CONTACT.phone}
        </a>
      </div>
    </PageHero>
  );
};

export default Hero;
