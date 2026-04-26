import { useMemo } from "react";
import { ShieldCheck, FileCheck, MapPin } from "lucide-react";

import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { useFirstApprovedMedia } from "@/hooks/useApprovedMedia";

import BronzeRule from "@/components/ui/bronze-rule";
import TrustChips from "@/components/ui/trust-chip";
import StatTrio, { type StatItem } from "@/components/ui/stat-trio";
import { BACKDROP } from "@/lib/colors";
import { BODY } from "@/lib/typography";

/**
 * Hero — homepage opener.
 *
 * ADAPTIVE LAYOUT:
 *  - When approved hero media exists → two-column layout (FlexServices style)
 *    with photo card + floating stat card overlapping the bottom-left corner.
 *  - When no media is approved → single-column type-led layout. The headline
 *    spans wider, the lead measure widens, the stat row sits inline. We never
 *    show a 600px-tall empty plate.
 *
 * Either way the bones are the same: deep evergreen radial backdrop, bronze
 * provenance rule, headline, lead, trust signals, primary CTA + tel link.
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
  // Look ahead: do we actually have a hero photo to anchor a two-column layout?
  // While loading we render the single-column variant — it's stable and never
  // shows the empty plate. When media arrives, we swap to two-column.
  const { item: heroMedia, loading } = useFirstApprovedMedia({
    shot_type: ["hero", "elevation", "wide"],
    min_quality: "hero",
    kind: "image",
  });
  const hasMedia = !loading && Boolean(heroMedia);

  // Single-column hero gets a wider headline measure and bigger type.
  const headlineCss = useMemo(
    () => ({
      fontSize: hasMedia
        ? "clamp(2.5rem, 5.5vw, 4.75rem)"
        : "clamp(2.75rem, 6.5vw, 6rem)",
    }),
    [hasMedia],
  );

  return (
    <section
      id="section-hero"
      className="relative min-h-[88vh] md:min-h-screen flex items-center overflow-hidden"
      aria-label="Creek Construction — Excellence in the Work"
    >
      {/* Layered evergreen background — tokenized */}
      <div className="absolute inset-0 bg-evergreen" />
      <div className="absolute inset-0 opacity-90" style={{ background: BACKDROP.evergreenRadial }} />
      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, hsl(var(--secondary)) 100%)" }}
      />

      <div className="container mx-auto px-6 relative z-10 py-20 md:py-28 lg:py-32">
        <div
          className={
            hasMedia
              ? "grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              : "max-w-5xl"
          }
        >
          {/* ─── Left column (or sole column) ─── */}
          <div className={hasMedia ? "lg:col-span-7 max-w-2xl" : ""}>
            <BronzeRule
              label="Calgary · Edmonton · Alberta"
              variant="onDark"
              width="default"
              className="mb-6 md:mb-8"
            />

            <h1
              className="font-serif text-evergreen-foreground leading-[1.05] mb-6 md:mb-8 text-balance"
              style={headlineCss}
            >
              <span className="block">Excellence in the Work.</span>
              <span className="block text-cedar/90 italic mt-2" style={{ fontSize: "0.62em" }}>
                Pride in every detail.
              </span>
            </h1>

            <p
              className={`${BODY.lead} text-evergreen-foreground/75 ${hasMedia ? "max-w-xl" : "max-w-2xl"} mb-10`}
            >
              Decks, fencing, sheds, painting and siding — built to last across
              Alberta. Our crew owns the work from quote to final nail.
            </p>

            {/* Editorial trust rule — comma-separated, hairlines between */}
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

            {/* When there's no photo, surface the stat trio inline so the hero
                still has the "real numbers" anchor that builds trust. */}
            {!hasMedia && (
              <div className="mt-14 pt-8 border-t border-evergreen-foreground/15 max-w-2xl">
                <BronzeRule label="Built on the work" variant="onDark" width="short" className="mb-4" />
                <div className="grid grid-cols-3 gap-6">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-serif text-3xl md:text-4xl text-evergreen-foreground leading-none tabular-nums">
                        {stat.value}{stat.suffix ?? ""}
                      </p>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-evergreen-foreground/55 mt-3 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right column — photo card + floating stat card ─── */}
          {hasMedia && (
            <div className="lg:col-span-5 relative">
              <div className="relative">
                <div
                  className="relative rounded-[8px] overflow-hidden shadow-float"
                  style={{ border: "1px solid hsl(var(--cedar) / 0.15)" }}
                >
                  <MediaSlot
                    query={{
                      shot_type: ["hero", "elevation", "wide"],
                      min_quality: "hero",
                      kind: "image",
                    }}
                    priority
                    sizes={MEDIA_SIZES.PORTRAIT_HALF}
                    wrapperClassName="aspect-editorial w-full"
                    fallback={null /* handled by hasMedia guard above */}
                  />

                  {/* Vignette so floating stat card stays legible */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(0deg, hsl(150 30% 6% / 0.55) 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Floating stat card */}
                <div
                  className="mt-6 lg:mt-0 lg:absolute lg:left-[-24px] lg:bottom-[-32px] lg:max-w-[340px]"
                  aria-label="Creek Construction key numbers"
                >
                  <div
                    className="rounded-[8px] px-6 py-5 shadow-float backdrop-blur-md"
                    style={{
                      background: "hsl(var(--surface-card) / 0.97)",
                      border: "1px solid hsl(var(--surface-card-border))",
                    }}
                  >
                    <BronzeRule label="Built on the work" variant="accent" width="short" className="mb-4" />
                    <StatTrio items={STATS} variant="inline" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
