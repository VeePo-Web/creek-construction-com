import CedarCTA from "@/components/CedarCTA";
import { CONTACT } from "@/config/contact";
import MediaSlot from "@/components/media/MediaSlot";

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
            "radial-gradient(ellipse at 30% 20%, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 55%, hsl(150 30% 6%) 100%)",
        }}
      />
      {/* Optional silent video bleed — appears only when an approved video exists.
          Confined to the right 45% so type stays clean on the left. */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[55%] pointer-events-none opacity-30 md:opacity-40 mix-blend-screen">
        <MediaSlot
          variant="bleed"
          query={{ kind: "video", min_quality: "portfolio" }}
          height="100%"
          opacity={0.85}
          fallback={null}
        />
        {/* Soft fade from evergreen on the left edge so the video never feels pasted-in */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(150 30% 8%) 0%, hsl(150 30% 8% / 0.6) 30%, transparent 100%)",
          }}
        />
      </div>
      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, hsl(var(--background)) 100%)" }}
      />

      <div className="container mx-auto px-6 relative z-10 py-20 md:py-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-px bg-cedar/60" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-cedar/90 font-light">
              Calgary · Edmonton · Alberta
            </span>
          </div>

          <h1 className="font-serif text-evergreen-foreground leading-[1.05] mb-8" style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}>
            <span className="block">Excellence in the Work.</span>
            <span className="block text-cedar/90 italic" style={{ fontSize: "0.7em" }}>Pride in every detail.</span>
          </h1>

          <p className="text-evergreen-foreground/75 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
            Residential exterior construction across Calgary, Edmonton, and surrounding Alberta. Decks, fencing, sheds, painting, siding — built to last, finished with care. No gimmicks. Just the work, done right.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <CedarCTA>Request a Quote</CedarCTA>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-evergreen-foreground/70 hover:text-cedar transition-colors min-h-[44px] px-2"
            >
              or call {CONTACT.phone}
            </a>
          </div>

          <div className="mt-16 flex items-center gap-6 text-evergreen-foreground/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-cedar/40" />
              <span className="text-[10px] tracking-[0.25em] uppercase">Locally owned</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-px bg-cedar/40" />
              <span className="text-[10px] tracking-[0.25em] uppercase">Free estimates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
