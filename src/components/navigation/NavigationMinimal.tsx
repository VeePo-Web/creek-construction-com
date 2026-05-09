import { Phone } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { cn } from "@/lib/utils";
import BrandMark from "@/components/navigation/BrandMark";

/**
 * NavigationMinimal — stripped chrome used on /contact only.
 *
 * The contact page is the funnel terminus: every UI element other than
 * the form is friction. We keep the brand mark for credibility and the
 * phone tel link for conversion, and remove every other exit door
 * (section rail, GlobalMenu trigger, social icons, sub-bar).
 *
 * Visually identical band to the full Navigation so vertical layout and
 * page padding behave the same way.
 */
const NavigationMinimal = () => {
  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50",
          "bg-background/95 backdrop-blur-[8px] border-b border-transparent shadow-[0_1px_0_0_rgba(0,0,0,0.04)]",
        )}
        style={{
          borderImage:
            "linear-gradient(90deg, transparent 0%, hsl(var(--cedar) / 0.22) 50%, transparent 100%) 1",
        }}
        role="banner"
      >
        <span
          aria-hidden
          className="block h-px w-full bg-gradient-to-r from-transparent via-cedar/40 to-transparent"
        />
        <div className="container mx-auto px-3 sm:px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-4">
          <BrandMark className="shrink-0" />

          <a
            href={`tel:${CONTACT.phoneTel}`}
            aria-label={`Call ${CONTACT.phone}`}
            className={cn(
              "inline-flex items-center gap-2.5 min-h-[44px] px-3 rounded-[6px]",
              "border border-cedar/30 hover:border-cedar/60 hover:bg-cedar/5",
              "transition-colors duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
            )}
          >
            <Phone className="h-4 w-4 text-cedar" aria-hidden />
            <span className="flex flex-col leading-none">
              <span className="text-[13px] md:text-sm font-medium text-foreground tracking-tight">
                {CONTACT.phone}
              </span>
              <span className="hidden sm:inline text-[9px] tracking-[0.22em] uppercase text-muted-foreground/70 mt-1">
                Call or text
              </span>
            </span>
          </a>
        </div>
      </header>
      <div aria-hidden className="h-16 md:h-20" />
    </>
  );
};

export default NavigationMinimal;
