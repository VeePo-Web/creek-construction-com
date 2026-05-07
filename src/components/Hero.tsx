import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import PageHero from "@/components/ui/page-hero";

import StatTrio, { type StatItem } from "@/components/ui/stat-trio";

/**
 * Hero — homepage opener.
 *
 * Architect-bleed treatment (hero-only B/W override). The hero stays
 * radically minimal: one quiet photograph, eyebrow, oversized headline,
 * subtitle and the primary site CTA. Stats + trust chips live in a
 * SINGLE post-hero section (one paint root, internal hairline divider)
 * so the eye reads "hero → one trust band → content."
 */

const STATS: StatItem[] = [
  { value: 7, suffix: "+", label: "Years on tools" },
  { value: 200, suffix: "+", label: "Projects built" },
  { value: 48, suffix: "h", label: "Quote reply" },
];

/** Post-hero proof band: stats only. Trust language lives in the closer. */
const HeroProofBand = () => (
  <section
    aria-label="Creek Construction credentials"
    className="border-b border-cedar/15 bg-background"
  >
    <div className="container mx-auto px-6 py-8 md:py-10">
      <StatTrio items={STATS} variant="inline" />
    </div>
  </section>
);

const Hero = () => {
  return (
    <>
      <PageHero
        variant="architect-bleed"
        breadcrumb={[{ label: "Calgary · Edmonton · Alberta" }]}
        sectionLabel="Exterior Construction"
        title={["Excellence in", "the Work."]}
        italic="Pride in every detail."
        subtitle="Decks, fencing, sheds, painting and siding — built to last across Alberta."
        query={{
          shot_type: ["hero", "elevation", "wide"],
          min_quality: "reference",
          kind: "image",
        }}
      >
        {/* Solid cedar pill — the most important conversion button on the site
            should look primary, not secondary. Reads cleanly against the B/W plate. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <CedarCTA />
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/85 hover:text-white transition-colors min-h-[44px] px-2"
          >
            or call {CONTACT.phone}
          </a>
        </div>
      </PageHero>

      <HeroProofBand />
    </>
  );
};

export default Hero;
