import { ShieldCheck, Award, Star, MapPin, FileCheck } from "lucide-react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";

/**
 * TrustStrip — slim full-width band sitting directly beneath the hero.
 *
 * Five typographic marks, monochrome cedar-on-cream. No external logos —
 * every claim is something Creek can stand behind in writing.
 *
 * This is *not* an "awards" section in the architecture-firm sense. It's
 * the construction-industry equivalent: WCB / insurance / reviews / local
 * ownership / free estimates. Trust signals, plainly stated.
 */
const items = [
  { icon: ShieldCheck, label: "WCB Covered" },
  { icon: FileCheck, label: "Fully Insured" },
  { icon: Star, label: "Google · 5.0★" },
  { icon: MapPin, label: "Locally Owned" },
  { icon: Award, label: "Free Estimates" },
];

const TrustStrip = () => {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative bg-secondary border-y border-border/60"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 200px" }}
    >
      <div className="container mx-auto px-6 py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          <ScrollRevealMotion>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-cedar/30" />
              <h2
                id="trust-heading"
                className="text-[10px] tracking-[0.3em] uppercase text-cedar/80 font-light"
              >
                Trusted across Alberta
              </h2>
              <div className="w-8 h-px bg-cedar/30" />
            </div>
          </ScrollRevealMotion>

          <ul
            className="grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-2 md:gap-x-6 items-center justify-items-center"
            role="list"
            aria-label="Trust signals"
          >
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollRevealMotion key={item.label} delay={i * 0.06}>
                  <li className="flex items-center gap-3 px-3 py-2 rounded-sm transition-colors duration-500 hover:bg-cedar/[0.04] cursor-default">
                    <Icon
                      className="h-4 w-4 text-cedar/70"
                      aria-hidden
                      strokeWidth={1.5}
                    />
                    <span className="text-[11px] md:text-[12px] tracking-[0.18em] uppercase text-foreground/70 font-light whitespace-nowrap">
                      {item.label}
                    </span>
                  </li>
                </ScrollRevealMotion>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
