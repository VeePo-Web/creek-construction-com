import CedarCTA from "@/components/CedarCTA";
import { TRUST_SIGNALS } from "@/config/trust-signals";
import { BACKDROP } from "@/lib/colors";
import { SECTION_PADDING } from "@/lib/spacing";

interface QuoteCloserCardProps {
  /** Eyebrow over the headline. Defaults to "What's next". */
  eyebrow?: string;
  /** Big serif headline. */
  heading?: string;
  /** Supporting paragraph. */
  body?: string;
  /** Three short bullet promises. */
  bullets?: string[];
  /** Pre-select these service ids in the QuoteModal. */
  preselectServices?: string[];
  /** Wrap in its own <section> with vertical padding. Default true. */
  asSection?: boolean;
}

const DEFAULT_BULLETS = [
  "Free, no-obligation quote",
  "On-site visit at your convenience",
  "Clear scope and price in writing",
];

/**
 * QuoteCloserCard — the single canonical "ask" used across every public page.
 *
 * Cedar-bordered evergreen plate with eyebrow → headline → body → bullets →
 * primary CedarCTA → trust line. One closer, used identically on Home,
 * Services, About, Work, and Contact so the funnel ending always feels the
 * same. Lifted from the /contact page's evergreen card.
 */
const QuoteCloserCard = ({
  eyebrow = "What's next",
  heading = "Send us your project details.",
  body = "It takes 30 seconds — just your name and phone. Tell us what you're building and we'll be in touch within 24–48 hours.",
  bullets = DEFAULT_BULLETS,
  preselectServices,
  asSection = true,
}: QuoteCloserCardProps) => {
  const card = (
    <div
      className="rounded-sm overflow-hidden relative grain-texture"
      style={{
        background: BACKDROP.evergreenCard,
        borderLeft: "3px solid hsl(var(--cedar))",
      }}
    >
      <div className="relative z-10 p-10 md:p-12">
        <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-4">
          {eyebrow}
        </p>
        <h2 className="font-serif text-evergreen-foreground text-3xl md:text-4xl leading-tight mb-5">
          {heading}
        </h2>
        <p className="text-evergreen-foreground/70 leading-relaxed mb-8 max-w-prose">
          {body}
        </p>

        <ul className="space-y-2 text-sm text-evergreen-foreground/60 mb-10">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="text-cedar">·</span>
              {b}
            </li>
          ))}
        </ul>

        <CedarCTA preselectServices={preselectServices}>Get my free quote</CedarCTA>

        <div
          className="mt-8 pt-6 border-t border-evergreen-foreground/10 flex flex-wrap items-center gap-x-5 gap-y-2"
          aria-label="Trust signals"
        >
          {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-evergreen-foreground/55"
            >
              <Icon className="h-3 w-3 text-cedar/80" aria-hidden strokeWidth={1.6} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (!asSection) return card;

  return (
    <section
      id="section-closer"
      className={`${SECTION_PADDING.default} bg-background`}
      aria-label="Request a quote"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">{card}</div>
      </div>
    </section>
  );
};

export default QuoteCloserCard;
