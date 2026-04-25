import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { ShieldCheck, FileCheck, MapPin } from "lucide-react";

/**
 * Hero — homepage opener. FlexServices-inspired layout:
 *   - Left column: eyebrow → headline → sub → trust chips → CTAs
 *   - Right column: a rounded photo card + a floating stat card overlapping
 *     its bottom-left corner.
 *
 * The right photo card pulls a hero-quality shot from approved cloud media.
 * If nothing is approved yet, the evergreen gradient fills the card —
 * still beautiful, never broken.
 *
 * Stats in the floating card are placeholder until confirmed by Creek.
 * Look for the `STAT_PLACEHOLDERS` comment to update them.
 */

// STAT_PLACEHOLDERS — replace with confirmed numbers when available.
const STATS = [
  { value: "07+", label: "Years on tools" },
  { value: "200+", label: "Projects built" },
  { value: "48h", label: "Quote turnaround" },
];

const TRUST_CHIPS = [
  { icon: ShieldCheck, label: "WCB covered" },
  { icon: FileCheck, label: "Fully insured" },
  { icon: MapPin, label: "Locally owned" },
];

const Hero = () => {
  return (
    <section
      id="section-hero"
      className="relative min-h-[88vh] md:min-h-screen flex items-center overflow-hidden"
      aria-label="Creek Construction — Excellence in the Work"
    >
      {/* Layered evergreen background — no photo, just rich gradient + grain */}
      <div className="absolute inset-0 bg-evergreen" />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse at 25% 25%, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 60%, hsl(150 30% 6%) 100%)",
        }}
      />
      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, hsl(var(--secondary)) 100%)" }}
      />

      <div className="container mx-auto px-6 relative z-10 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left column — type */}
          <div className="lg:col-span-7 max-w-2xl">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-10 h-px bg-cedar/60" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-cedar/90 font-light">
                Calgary · Edmonton · Alberta
              </span>
            </div>

            <h1
              className="font-serif text-evergreen-foreground leading-[1.05] mb-6 md:mb-8"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)" }}
            >
              <span className="block">Excellence in the Work.</span>
              <span
                className="block text-cedar/90 italic mt-2"
                style={{ fontSize: "0.62em" }}
              >
                Pride in every detail.
              </span>
            </h1>

            <p className="text-evergreen-foreground/75 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              Decks, fencing, sheds, painting and siding — built to last across
              Alberta. Our crew owns the work from quote to final nail.
            </p>

            {/* Trust chips — small, unobtrusive, monochrome cedar */}
            <div className="flex flex-wrap gap-2 mb-10" role="list" aria-label="Trust signals">
              {TRUST_CHIPS.map((chip) => {
                const Icon = chip.icon;
                return (
                  <span
                    key={chip.label}
                    role="listitem"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-cedar/25 bg-evergreen-foreground/[0.03] backdrop-blur-sm"
                  >
                    <Icon
                      className="h-3 w-3 text-cedar/80"
                      aria-hidden
                      strokeWidth={1.6}
                    />
                    <span className="text-[10px] tracking-[0.18em] uppercase text-evergreen-foreground/70 font-light">
                      {chip.label}
                    </span>
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <CedarCTA>Request a Quote</CedarCTA>
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-evergreen-foreground/70 hover:text-cedar transition-colors min-h-[44px] px-2"
              >
                or call {CONTACT.phone}
              </a>
            </div>
          </div>

          {/* Right column — photo card + floating stat card */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* The photo card itself — rounded, shadowed, floats over the gradient */}
              <div
                className="relative rounded-[8px] overflow-hidden shadow-float"
                style={{
                  border: "1px solid hsl(var(--cedar) / 0.15)",
                }}
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
                  fallback={
                    // Cinematic evergreen-on-cedar fallback when no hero image is approved
                    <div
                      className="aspect-editorial w-full relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(150 25% 18%) 0%, hsl(150 30% 8%) 100%)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse at 70% 30%, hsl(28 55% 45% / 0.18) 0%, transparent 60%)",
                        }}
                      />
                      <div className="absolute inset-0 grain-overlay opacity-50 pointer-events-none" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-cedar/70 mb-3">
                          On the boards
                        </p>
                        <p className="font-serif text-2xl text-evergreen-foreground/80 leading-tight">
                          Project photography{" "}
                          <span className="italic text-cedar/80">coming soon.</span>
                        </p>
                      </div>
                    </div>
                  }
                />

                {/* Subtle bottom vignette so a floating stat card stays legible over photos */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(0deg, hsl(150 30% 6% / 0.55) 0%, transparent 100%)",
                  }}
                />
              </div>

              {/* Floating stat card — overlaps the bottom-left of the photo on desktop */}
              <div
                className="mt-6 lg:mt-0 lg:absolute lg:left-[-24px] lg:bottom-[-32px] lg:max-w-[320px]"
                aria-label="Creek Construction key numbers"
              >
                <div
                  className="rounded-[8px] px-6 py-5 shadow-float backdrop-blur-md"
                  style={{
                    background: "hsl(var(--surface-card) / 0.97)",
                    border: "1px solid hsl(var(--surface-card-border))",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-px bg-cedar/40" />
                    <span className="text-[9px] tracking-[0.3em] uppercase text-cedar/80 font-light">
                      Built on the work
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {STATS.map((stat) => (
                      <div key={stat.label}>
                        <p className="font-serif text-2xl md:text-[1.75rem] text-foreground leading-none tabular-nums">
                          {stat.value}
                        </p>
                        <p className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground/70 mt-2 leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
