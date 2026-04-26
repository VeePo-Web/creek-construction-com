/**
 * Creek Construction — Style Guide
 *
 * Live, copy-to-clipboard reference rendering every token from src/lib/*.
 * Lazy-loaded route at /style-guide. Hidden from public nav and indexing.
 *
 * Pattern adapted from RoyalMechanical.com /style-guide; scaled to Creek's
 * smaller token surface (5 brand colors, 2 fonts, 4 shadows).
 */

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BRAND,
  SURFACE,
  TEXT,
  BORDER,
  BUTTON,
  SHADOW,
  DIVIDER,
  BRONZE_OPACITY,
  CONTRAST,
  bronzeStep,
} from "@/lib/colors";
import {
  HEADLINE,
  EYEBROW,
  BODY,
  QUOTE,
  STAT,
  UI,
  TYPOGRAPHY_RULES,
  TEXT_WIDTH,
} from "@/lib/typography";
import {
  SECTION_PADDING,
  CONTAINER_PADDING,
  MAX_WIDTH,
  CONTENT_GAP,
  GRID_GAP,
  TOUCH_TARGET,
  SPACING_RULES,
} from "@/lib/spacing";
import {
  EASING,
  DURATION,
  HOVER,
  FOCUS,
  REDUCED_MOTION,
  DELAY_SEQUENCE,
  MOTION_RULES,
} from "@/lib/motion";
import {
  BRAND_SPINE,
  VOICE,
  VALUE_PROP,
  VERBAL_IDENTITY,
  VISUAL_DIRECTION,
  NON_NEGOTIABLES,
  DEALBREAKERS,
  PERFORMANCE_BUDGETS,
  ACCESSIBILITY,
  GOVERNANCE,
} from "@/lib/brand-identity";

// ─────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex items-center justify-center w-7 h-7 rounded-sm hover:bg-cedar/[0.06] transition-colors text-muted-foreground hover:text-cedar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-1"
      aria-label={copied ? "Copied" : `Copy ${text}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-cedar" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

const SectionAnchor = ({
  id,
  numeral,
  eyebrow,
  title,
  description,
}: {
  id: string;
  numeral: string;
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <header id={id} className="mb-16 scroll-mt-24">
    <div className="flex items-center gap-4 mb-6">
      <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">
        {numeral}
      </span>
      <div className="w-8 h-px bg-cedar/20" />
      <span className="text-[10px] tracking-[0.25em] text-cedar uppercase font-medium">
        {eyebrow}
      </span>
    </div>
    <h2 className="font-serif text-foreground text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-balance mb-4">
      {title}
    </h2>
    <p className="font-sans text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
      {description}
    </p>
  </header>
);

const TokenRow = ({
  name,
  value,
  description,
}: {
  name: string;
  value: string;
  description?: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-border/40">
    <div className="min-w-0 flex-1">
      <div className="text-sm font-medium text-foreground">{name}</div>
      {description && (
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      )}
    </div>
    <code className="text-[11px] text-muted-foreground bg-secondary/60 px-2 py-1 rounded-sm font-mono shrink-0 max-w-[60%] overflow-x-auto whitespace-nowrap">
      {value}
    </code>
    <CopyButton text={value} />
  </div>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`border border-border/60 rounded-sm bg-background p-6 ${className}`}
  >
    {children}
  </div>
);

const Subhead = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-serif text-foreground text-2xl leading-tight mt-12 mb-6 first:mt-0">
    {children}
  </h3>
);

// ─────────────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "brand", numeral: "I", label: "Brand" },
  { id: "color", numeral: "II", label: "Color" },
  { id: "type", numeral: "III", label: "Type" },
  { id: "spacing", numeral: "IV", label: "Spacing" },
  { id: "motion", numeral: "V", label: "Motion" },
  { id: "components", numeral: "VI", label: "Components" },
  { id: "performance", numeral: "VII", label: "Performance" },
  { id: "governance", numeral: "VIII", label: "Governance" },
] as const;

const LeftRail = () => (
  <nav
    aria-label="Style guide sections"
    className="lg:sticky lg:top-24 lg:self-start"
  >
    <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 mb-4">
      Contents
    </div>
    <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-2 px-2 pb-2 lg:pb-0">
      {SECTIONS.map((s) => (
        <li key={s.id} className="shrink-0">
          <a
            href={`#${s.id}`}
            className="group flex items-center gap-3 py-2 px-3 -mx-3 rounded-sm hover:bg-cedar/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
          >
            <span className="text-[10px] tracking-[0.2em] text-cedar/40 group-hover:text-cedar tabular-nums w-6">
              {s.numeral}
            </span>
            <span className="text-[12px] tracking-[0.12em] uppercase text-muted-foreground group-hover:text-foreground">
              {s.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

// ─────────────────────────────────────────────────────────────────────
// I. BRAND
// ─────────────────────────────────────────────────────────────────────

const BrandSection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="brand"
      numeral="I"
      eyebrow="Brand Identity"
      title="The editorial brain."
      description="Strategy, voice, and the non-negotiables that govern every design and copy decision. Every contributor reads this before shipping."
    />

    <Tabs defaultValue="spine" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary/40 p-1 rounded-sm mb-10">
        {["Spine", "Voice", "Value", "Visual", "Guardrails"].map((t) => (
          <TabsTrigger
            key={t.toLowerCase()}
            value={t.toLowerCase()}
            className="text-[11px] tracking-[0.18em] uppercase data-[state=active]:bg-background data-[state=active]:text-cedar data-[state=active]:shadow-sm rounded-sm px-4 py-2"
          >
            {t}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="spine" className="space-y-8">
        <Card>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-2">
                Tagline
              </div>
              <p className="font-serif text-3xl text-foreground leading-tight">
                {BRAND_SPINE.tagline}
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  Purpose
                </div>
                <p className="text-foreground/80 leading-relaxed">{BRAND_SPINE.purpose}</p>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  Promise
                </div>
                <p className="text-foreground/80 leading-relaxed">{BRAND_SPINE.promise}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <Subhead>Personality</Subhead>
            <div className="flex flex-wrap gap-2">
              {BRAND_SPINE.personality.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 border border-cedar/40 text-cedar text-[11px] tracking-[0.18em] uppercase rounded-sm"
                >
                  {p}
                </span>
              ))}
            </div>
            <Subhead>Audience</Subhead>
            <p className="text-muted-foreground leading-relaxed">{BRAND_SPINE.audience}</p>
          </Card>
          <Card>
            <Subhead>Not For</Subhead>
            <ul className="space-y-3">
              {BRAND_SPINE.notFor.map((item) => (
                <li key={item} className="flex gap-3 text-muted-foreground">
                  <span className="text-cedar/60 mt-1.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="voice" className="space-y-8">
        <Card>
          <Subhead>Attributes</Subhead>
          <ul className="space-y-2">
            {VOICE.attributes.map((a) => (
              <li key={a} className="text-foreground/80">
                {a}
              </li>
            ))}
          </ul>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-cedar/30">
            <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">
              ✓ Phrases we say
            </div>
            <ul className="space-y-3">
              {VOICE.do.map((p) => (
                <li key={p} className="font-serif italic text-foreground/85 text-lg leading-snug">
                  &ldquo;{p}&rdquo;
                </li>
              ))}
            </ul>
          </Card>
          <Card className="border-foreground/15">
            <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              ✕ Phrases we never say
            </div>
            <ul className="space-y-3">
              {VOICE.dont.map((p) => (
                <li
                  key={p}
                  className="text-muted-foreground leading-snug line-through decoration-foreground/20"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="value" className="space-y-8">
        <Card>
          <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">
            Primary value
          </div>
          <p className="font-serif text-2xl md:text-3xl text-foreground leading-snug text-balance">
            {VALUE_PROP.primary}
          </p>
        </Card>
        <div className="grid md:grid-cols-3 gap-6">
          {VALUE_PROP.pillars.map((p, i) => (
            <Card key={p.title}>
              <div
                className="text-[10px] tracking-[0.25em] uppercase mb-3 tabular-nums"
                style={{ color: `hsl(var(--cedar) / ${bronzeStep(i, VALUE_PROP.pillars.length)})` }}
              >
                {String(i + 1).padStart(2, "0")} · Pillar
              </div>
              <h4 className="font-serif text-xl text-foreground mb-3">{p.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.proof}</p>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="visual" className="space-y-8">
        <Card>
          <Subhead>Philosophy</Subhead>
          <p className="font-serif italic text-xl text-foreground/80 leading-snug">
            &ldquo;{VISUAL_DIRECTION.philosophy}&rdquo;
          </p>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          {VISUAL_DIRECTION.principles.map((p) => (
            <Card key={p.name}>
              <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-2">Principle</div>
              <h4 className="font-serif text-xl text-foreground mb-2">{p.name}</h4>
              <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            </Card>
          ))}
        </div>
        <Card>
          <Subhead>Photography rules</Subhead>
          <ul className="space-y-3">
            {VISUAL_DIRECTION.photographyRules.map((r) => (
              <li key={r} className="flex gap-3 text-muted-foreground">
                <span className="text-cedar/60 mt-1.5">—</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>

      <TabsContent value="guardrails" className="space-y-8">
        <Card>
          <Subhead>Non-negotiables</Subhead>
          <ul className="space-y-5">
            {NON_NEGOTIABLES.map((n) => (
              <li key={n.rule} className="border-l-2 border-cedar/40 pl-4">
                <div className="text-foreground font-medium mb-1">{n.rule}</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-cedar/70">Why · </span>
                  {n.why}
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="bg-secondary/40">
          <Subhead>Dealbreakers</Subhead>
          <ul className="space-y-5">
            {DEALBREAKERS.map((d) => (
              <li key={d.pattern} className="border-l-2 border-foreground/20 pl-4">
                <div className="text-foreground/90 mb-1">
                  <span className="text-foreground/40 mr-2">✕</span>
                  {d.pattern}
                </div>
                <div className="text-sm text-muted-foreground pl-6">{d.why}</div>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>
    </Tabs>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// II. COLOR
// ─────────────────────────────────────────────────────────────────────

const Swatch = ({ entry }: { entry: (typeof BRAND)[keyof typeof BRAND] }) => (
  <Card className="overflow-hidden p-0">
    <div
      className="h-40 w-full"
      style={{ background: `hsl(${entry.hsl})` }}
      aria-label={`${entry.name} color preview`}
    />
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif text-xl text-foreground">{entry.name}</h4>
        <CopyButton text={entry.hex} />
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground/60 tracking-[0.15em] uppercase w-12">Hex</span>
          <code className="font-mono text-foreground/80">{entry.hex}</code>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground/60 tracking-[0.15em] uppercase w-12">HSL</span>
          <code className="font-mono text-foreground/80">{entry.hsl}</code>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground/60 tracking-[0.15em] uppercase w-12">Var</span>
          <code className="font-mono text-foreground/80">var({entry.var})</code>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
        {entry.usage}
      </p>
    </div>
  </Card>
);

const ColorSection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="color"
      numeral="II"
      eyebrow="Color"
      title="Five colors. Opacity is the variation tool."
      description="No rainbow. Warm undertones throughout — never pure white, never pure black. Bronze is the only accent and it's reserved for moments that earn attention."
    />

    <Subhead>Brand palette</Subhead>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {Object.values(BRAND).map((c) => (
        <Swatch key={c.name} entry={c} />
      ))}
    </div>

    <Subhead>Bronze opacity scale</Subhead>
    <Card className="mb-12">
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
        The legacy &ldquo;thermal crescendo&rdquo; pattern. Use ascending opacities for ordered lists
        where intensity should build (service cards 1→6, contact steps 1→4). Use{" "}
        <code className="font-mono text-xs bg-secondary/60 px-1.5 py-0.5 rounded-sm">
          bronzeStep(i, total)
        </code>{" "}
        to compute it.
      </p>
      <div className="flex h-16 rounded-sm overflow-hidden border border-border/40">
        {Object.entries(BRONZE_OPACITY).map(([name, value]) => (
          <div
            key={name}
            className="flex-1 flex flex-col items-center justify-center text-[10px] tracking-[0.15em] uppercase"
            style={{
              background: `hsl(28 55% 45% / ${value})`,
              color: value > 0.5 ? "hsl(38 30% 97%)" : "hsl(150 15% 10%)",
            }}
          >
            <span>{name}</span>
            <span className="opacity-70 tabular-nums">{value}</span>
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Surfaces</Subhead>
    <Card className="mb-12">
      {Object.entries(SURFACE).map(([name, value]) => (
        <TokenRow key={name} name={`SURFACE.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Buttons</Subhead>
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">Primary</div>
        <button
          className={`${BUTTON.primary.base} ${BUTTON.primary.hover} ${BUTTON.primary.focus} ${BUTTON.primary.transition}`}
        >
          Get a free quote
        </button>
      </Card>
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">Secondary</div>
        <button
          className={`${BUTTON.secondary.base} ${BUTTON.secondary.hover} ${BUTTON.secondary.focus} ${BUTTON.secondary.transition}`}
        >
          See our work
        </button>
      </Card>
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">Ghost</div>
        <button
          className={`${BUTTON.ghost.base} ${BUTTON.ghost.hover} ${BUTTON.ghost.focus} ${BUTTON.ghost.transition}`}
        >
          Learn more
        </button>
      </Card>
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">Link</div>
        <button
          className={`${BUTTON.link.base} ${BUTTON.link.hover} ${BUTTON.link.focus} ${BUTTON.link.transition}`}
        >
          Read more →
        </button>
      </Card>
    </div>

    <Subhead>Dividers</Subhead>
    <Card className="mb-12">
      <div className="space-y-8">
        {Object.entries(DIVIDER).map(([name, value]) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-2 text-xs">
              <code className="font-mono text-foreground/80">DIVIDER.{name}</code>
              <CopyButton text={value} />
            </div>
            <div className={value} />
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Borders</Subhead>
    <Card className="mb-12">
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(BORDER).map(([name, value]) => (
          <div key={name} className={`${value} rounded-sm p-4 bg-background`}>
            <div className="text-xs font-mono text-muted-foreground">BORDER.{name}</div>
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Shadows</Subhead>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {Object.entries(SHADOW).map(([name, value]) => (
        <div key={name} className={`${value} bg-background rounded-sm p-6 border border-border/40`}>
          <div className="text-xs font-mono text-muted-foreground mb-2">SHADOW.{name}</div>
          <div className="text-[11px] text-muted-foreground/60">{value}</div>
        </div>
      ))}
    </div>

    <Subhead>Text on surfaces</Subhead>
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">On Light</div>
        {Object.entries(TEXT.onLight).map(([name, value]) => (
          <div key={name} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
            <span className={`${value}`}>The quick brown fox</span>
            <code className="text-[11px] font-mono text-muted-foreground">{name}</code>
          </div>
        ))}
      </Card>
      <Card className="bg-evergreen">
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">On Dark</div>
        {Object.entries(TEXT.onDark).map(([name, value]) => (
          <div
            key={name}
            className="flex items-center justify-between py-2 border-b border-evergreen-foreground/15 last:border-0"
          >
            <span className={`${value}`}>The quick brown fox</span>
            <code className="text-[11px] font-mono text-evergreen-foreground/60">{name}</code>
          </div>
        ))}
      </Card>
    </div>

    <Subhead>Contrast audit</Subhead>
    <Card>
      <div className="space-y-3">
        {Object.entries(CONTRAST).map(([key, c]) => (
          <div key={key} className="flex items-center gap-4 py-2 border-b border-border/40 last:border-0">
            <div className={`${c.bg} ${c.fg} px-4 py-3 rounded-sm flex-1 text-sm`}>
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-foreground tabular-nums">{c.ratio.toFixed(1)}:1</div>
              <div
                className={`text-[10px] tracking-[0.18em] uppercase font-medium ${
                  c.level === "AAA" ? "text-cedar" : "text-muted-foreground"
                }`}
              >
                {c.level}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// III. TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────

const TypeSpecimen = ({
  label,
  className,
  example,
}: {
  label: string;
  className: string;
  example: string;
}) => (
  <div className="py-6 border-b border-border/40 last:border-0">
    <div className="flex items-center justify-between mb-3">
      <code className="text-[11px] tracking-[0.15em] uppercase text-cedar/80 font-medium">{label}</code>
      <CopyButton text={className} />
    </div>
    <div className={className}>{example}</div>
    <code className="block mt-3 text-[10px] font-mono text-muted-foreground/70 leading-snug">
      {className}
    </code>
  </div>
);

const TypographySection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="type"
      numeral="III"
      eyebrow="Typography"
      title="Two families. Editorial restraint."
      description="DM Serif Display for the brand's voice. DM Sans for everything else. Curly quotes, balanced wraps, never bold body."
    />

    <div className="grid lg:grid-cols-2 gap-6 mb-12">
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-3">Serif</div>
        <div className="font-serif text-5xl text-foreground leading-none mb-3">DM Serif Display</div>
        <div className="font-serif text-foreground/80 text-lg leading-snug">
          Headlines, quotes, stats. The brand&rsquo;s signature voice.
        </div>
      </Card>
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-3">Sans</div>
        <div className="font-sans text-5xl text-foreground leading-none mb-3 font-light">DM Sans</div>
        <div className="font-sans text-muted-foreground text-base leading-relaxed">
          Body, UI, labels. The everyday workhorse.
        </div>
      </Card>
    </div>

    <Subhead>Headlines</Subhead>
    <Card className="mb-12">
      <TypeSpecimen label="HEADLINE.hero" className={HEADLINE.hero} example="Excellence in the work." />
      <TypeSpecimen label="HEADLINE.display" className={HEADLINE.display} example="Built to outlast Alberta winters." />
      <TypeSpecimen label="HEADLINE.section" className={HEADLINE.section} example="What we build." />
      <TypeSpecimen label="HEADLINE.sub" className={HEADLINE.sub} example="Decks & pergolas" />
      <TypeSpecimen label="HEADLINE.card" className={HEADLINE.card} example="Cedar deck, Edmonton" />
    </Card>

    <Subhead>Eyebrows</Subhead>
    <Card className="mb-12">
      <TypeSpecimen label="EYEBROW.default" className={EYEBROW.default} example="The Work" />
      <TypeSpecimen label="EYEBROW.accent" className={EYEBROW.accent} example="Featured Project" />
    </Card>

    <Subhead>Body</Subhead>
    <Card className="mb-12">
      <TypeSpecimen
        label="BODY.lead"
        className={BODY.lead}
        example="Every deck we build starts with an on-site visit and a written quote."
      />
      <TypeSpecimen
        label="BODY.default"
        className={BODY.default}
        example="We use pressure-treated 6×6 posts on bell-bottom footings, set below the frost line. The substructure is what makes a deck last twenty years instead of seven."
      />
      <TypeSpecimen
        label="BODY.small"
        className={BODY.small}
        example="Materials sourced locally where available."
      />
      <TypeSpecimen label="BODY.caption" className={BODY.caption} example="Photo: J. Carter, Sept 2024" />
    </Card>

    <Subhead>Quotes</Subhead>
    <Card className="mb-12">
      <TypeSpecimen
        label="QUOTE.testimonial"
        className={QUOTE.testimonial}
        example="They showed up when they said they would and left the yard cleaner than they found it."
      />
      <TypeSpecimen label="QUOTE.attribution" className={QUOTE.attribution} example="Marcus L. — Sherwood Park" />
    </Card>

    <Subhead>Stats</Subhead>
    <Card className="mb-12">
      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <div className={STAT.hero}>07+</div>
          <div className={STAT.label}>Years in business</div>
        </div>
        <div>
          <div className={STAT.hero}>240+</div>
          <div className={STAT.label}>Projects completed</div>
        </div>
        <div>
          <div className={STAT.hero}>$5M</div>
          <div className={STAT.label}>Liability coverage</div>
        </div>
      </div>
    </Card>

    <Subhead>UI</Subhead>
    <Card className="mb-12">
      <TypeSpecimen label="UI.button" className={UI.button} example="Get a free quote" />
      <TypeSpecimen label="UI.label" className={UI.label} example="Property type" />
      <TypeSpecimen label="UI.navLink" className={UI.navLink} example="Services" />
    </Card>

    <Subhead>Text width</Subhead>
    <Card className="mb-12 space-y-4">
      {Object.entries(TEXT_WIDTH).map(([name, value]) => (
        <div key={name}>
          <div className="text-xs font-mono text-muted-foreground mb-2">TEXT_WIDTH.{name} — {value}</div>
          <div className={`${value} h-3 bg-cedar/30 rounded-sm`} />
        </div>
      ))}
    </Card>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-cedar/30">
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">✓ Do</div>
        <ul className="space-y-3">
          {TYPOGRAPHY_RULES.do.map((r) => (
            <li key={r} className="text-foreground/80 leading-snug">
              {r}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">✕ Don&rsquo;t</div>
        <ul className="space-y-3">
          {TYPOGRAPHY_RULES.dont.map((r) => (
            <li key={r} className="text-muted-foreground leading-snug">
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// IV. SPACING
// ─────────────────────────────────────────────────────────────────────

const SpacingSection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="spacing"
      numeral="IV"
      eyebrow="Spacing"
      title="The breathing rule."
      description="Built on an 8px grid. Generous section padding (96–128px) is the default. Compressed sections feel cheap."
    />

    <Subhead>Section padding</Subhead>
    <Card className="mb-12">
      {Object.entries(SECTION_PADDING).map(([name, value]) => (
        <TokenRow key={name} name={`SECTION_PADDING.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Container padding</Subhead>
    <Card className="mb-12">
      {Object.entries(CONTAINER_PADDING).map(([name, value]) => (
        <TokenRow key={name} name={`CONTAINER_PADDING.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Max widths</Subhead>
    <Card className="mb-12 space-y-4">
      {Object.entries(MAX_WIDTH).map(([name, value]) => (
        <div key={name}>
          <div className="flex items-center justify-between text-xs mb-2">
            <code className="font-mono text-foreground/80">MAX_WIDTH.{name}</code>
            <CopyButton text={value} />
          </div>
          <div className={`${value} h-2 bg-cedar/30 rounded-sm`} />
        </div>
      ))}
    </Card>

    <Subhead>Content gap</Subhead>
    <Card className="mb-12">
      {Object.entries(CONTENT_GAP).map(([name, value]) => (
        <TokenRow key={name} name={`CONTENT_GAP.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Grid gap</Subhead>
    <Card className="mb-12">
      {Object.entries(GRID_GAP).map(([name, value]) => (
        <TokenRow key={name} name={`GRID_GAP.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Touch targets</Subhead>
    <Card className="mb-12">
      <p className="text-sm text-muted-foreground mb-6">
        WCAG 2.5.8 — every interactive element must meet 44×44px minimum on mobile.
      </p>
      <div className="flex items-end gap-6">
        {Object.entries(TOUCH_TARGET).map(([name, value]) => {
          const size = name === "min" ? 44 : name === "comfort" ? 48 : 56;
          return (
            <div key={name} className="text-center">
              <div
                className="bg-cedar/20 border border-cedar/40 rounded-sm flex items-center justify-center"
                style={{ width: size, height: size }}
              >
                <span className="text-[10px] tabular-nums text-cedar font-medium">{size}px</span>
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-2">{name}</div>
            </div>
          );
        })}
      </div>
    </Card>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-cedar/30">
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">✓ Do</div>
        <ul className="space-y-3">
          {SPACING_RULES.do.map((r) => (
            <li key={r} className="text-foreground/80 leading-snug">
              {r}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">✕ Don&rsquo;t</div>
        <ul className="space-y-3">
          {SPACING_RULES.dont.map((r) => (
            <li key={r} className="text-muted-foreground leading-snug">
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// V. MOTION
// ─────────────────────────────────────────────────────────────────────

const EasingDemo = ({ name, curve }: { name: string; curve: string }) => {
  const [active, setActive] = useState(false);
  return (
    <div
      className="group relative overflow-hidden border border-border/40 rounded-sm p-4 bg-background hover:border-cedar/40 cursor-pointer"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <code className="text-xs font-mono text-foreground">EASING.{name}</code>
        <CopyButton text={curve} />
      </div>
      <div className="relative h-1 bg-secondary/60 rounded-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cedar"
          style={{
            left: active ? "calc(100% - 12px)" : "0px",
            transition: `left 700ms ${curve}`,
          }}
        />
      </div>
      <code className="block mt-3 text-[10px] font-mono text-muted-foreground/70">{curve}</code>
    </div>
  );
};

const MotionSection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="motion"
      numeral="V"
      eyebrow="Motion"
      title="Breathing easing."
      description="Organic and unhurried. Never spring-bouncy, never linear. The default curve decelerates like an exhale. All non-essential motion respects prefers-reduced-motion."
    />

    <Subhead>Easing — hover to play</Subhead>
    <div className="grid sm:grid-cols-2 gap-4 mb-12">
      {Object.entries(EASING).map(([name, curve]) => (
        <EasingDemo key={name} name={name} curve={curve} />
      ))}
    </div>

    <Subhead>Duration</Subhead>
    <Card className="mb-12">
      {Object.entries(DURATION).map(([name, value]) => (
        <TokenRow key={name} name={`DURATION.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Hover patterns</Subhead>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
      {Object.entries(HOVER).map(([name, value]) => (
        <Card key={name} className={`${value} cursor-pointer`}>
          <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-2">HOVER.{name}</div>
          <div className="text-foreground font-medium">Hover me</div>
          <code className="block mt-3 text-[10px] font-mono text-muted-foreground/60 leading-snug">
            {value}
          </code>
        </Card>
      ))}
    </div>

    <Subhead>Focus rings</Subhead>
    <Card className="mb-12">
      <p className="text-sm text-muted-foreground mb-6">Tab to each button to see the visible focus ring.</p>
      <div className="flex flex-wrap gap-4">
        <button className={`px-6 py-3 bg-background border border-border rounded-sm text-sm ${FOCUS.ring}`}>
          FOCUS.ring
        </button>
        <input
          type="text"
          placeholder="FOCUS.ringInset"
          className={`px-4 py-3 bg-background border border-border rounded-sm text-sm ${FOCUS.ringInset}`}
        />
      </div>
    </Card>
    <Card className="mb-12 bg-evergreen">
      <button
        className={`px-6 py-3 bg-cedar text-cedar-foreground rounded-sm text-sm tracking-[0.15em] uppercase ${FOCUS.ringOnDark}`}
      >
        FOCUS.ringOnDark
      </button>
    </Card>

    <Subhead>Stagger delays</Subhead>
    <Card className="mb-12">
      {Object.entries(DELAY_SEQUENCE).map(([name, value]) => (
        <TokenRow key={name} name={`DELAY_SEQUENCE.${name}`} value={`${value}s`} />
      ))}
    </Card>

    <Subhead>Reduced motion utilities</Subhead>
    <Card className="mb-12">
      {Object.entries(REDUCED_MOTION).map(([name, value]) => (
        <TokenRow key={name} name={`REDUCED_MOTION.${name}`} value={value} />
      ))}
    </Card>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-cedar/30">
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">✓ Do</div>
        <ul className="space-y-3">
          {MOTION_RULES.do.map((r) => (
            <li key={r} className="text-foreground/80 leading-snug">
              {r}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">✕ Don&rsquo;t</div>
        <ul className="space-y-3">
          {MOTION_RULES.dont.map((r) => (
            <li key={r} className="text-muted-foreground leading-snug">
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// VI. COMPONENTS
// ─────────────────────────────────────────────────────────────────────

const AspectRatios = [
  { name: "aspect-hero", ratio: "16 / 9", usage: "Hero photography" },
  { name: "aspect-bleed", ratio: "21 / 9", usage: "Editorial full-bleed" },
  { name: "aspect-editorial", ratio: "4 / 5", usage: "Portrait editorial" },
  { name: "aspect-portrait", ratio: "3 / 4", usage: "Project portraits" },
  { name: "aspect-detail", ratio: "4 / 3", usage: "Detail shots" },
  { name: "aspect-square", ratio: "1 / 1", usage: "Grid tiles" },
  { name: "aspect-cinema", ratio: "2.39 / 1", usage: "Cinema bleed" },
];

const ComponentsSection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="components"
      numeral="VI"
      eyebrow="Components"
      title="The shipped library."
      description="Live previews of the components used across the site. Import from @/components/* — never re-implement."
    />

    <Subhead>Aspect ratios</Subhead>
    <Card className="mb-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AspectRatios.map((a) => (
          <div key={a.name}>
            <div
              className="bg-cedar/15 border border-cedar/30 rounded-sm flex items-center justify-center mb-3"
              style={{ aspectRatio: a.ratio }}
            >
              <code className="text-xs font-mono text-cedar">{a.ratio}</code>
            </div>
            <div className="flex items-center justify-between text-xs">
              <code className="font-mono text-foreground/80">{a.name}</code>
              <CopyButton text={a.name} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{a.usage}</div>
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Form inputs</Subhead>
    <Card className="mb-12 space-y-4">
      <div>
        <label className={`${UI.label} block mb-2`}>Name</label>
        <input
          type="text"
          placeholder="Your name"
          className={`w-full px-4 py-3 bg-background border border-border rounded-sm ${UI.input} ${FOCUS.ringInset}`}
        />
      </div>
      <div>
        <label className={`${UI.label} block mb-2`}>Project type</label>
        <select className={`w-full px-4 py-3 bg-background border border-border rounded-sm ${UI.input} ${FOCUS.ringInset}`}>
          <option>Deck</option>
          <option>Fence</option>
          <option>Shed</option>
        </select>
      </div>
    </Card>

    <Subhead>Card surfaces</Subhead>
    <div className="grid sm:grid-cols-3 gap-6 mb-12">
      <div className="bg-background border border-border rounded-sm p-6">
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-2">Default</div>
        <div className="text-foreground">bg-background</div>
      </div>
      <div className="bg-secondary rounded-sm p-6">
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-2">Section</div>
        <div className="text-foreground">bg-secondary</div>
      </div>
      <div className="bg-evergreen text-evergreen-foreground rounded-sm p-6">
        <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-2">Dark</div>
        <div>bg-evergreen</div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// VII. PERFORMANCE
// ─────────────────────────────────────────────────────────────────────

const PerformanceSection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="performance"
      numeral="VII"
      eyebrow="Performance"
      title="Budgets we measure against."
      description="Performance is a feature. These are the thresholds we hold the homepage to on mobile, simulated 4G."
    />

    <Card className="mb-12">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[10px] tracking-[0.25em] uppercase text-muted-foreground py-3 pr-4">
                Metric
              </th>
              <th className="text-left text-[10px] tracking-[0.25em] uppercase text-cedar py-3 pr-4">
                Target
              </th>
              <th className="text-left text-[10px] tracking-[0.25em] uppercase text-muted-foreground py-3">
                Critical
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(PERFORMANCE_BUDGETS).map(([name, b]) => (
              <tr key={name} className="border-b border-border/40">
                <td className="py-3 pr-4 font-mono text-sm text-foreground">{name.toUpperCase()}</td>
                <td className="py-3 pr-4 font-mono text-sm text-cedar tabular-nums">{b.target}</td>
                <td className="py-3 font-mono text-sm text-muted-foreground tabular-nums">{b.critical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    <Subhead>Accessibility minimums</Subhead>
    <Card>
      <ul className="space-y-4">
        {Object.entries(ACCESSIBILITY).map(([key, value]) => (
          <li key={key} className="border-l-2 border-cedar/40 pl-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-1">{key}</div>
            <div className="text-foreground/80 text-sm leading-relaxed">{value}</div>
          </li>
        ))}
      </ul>
    </Card>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// VIII. GOVERNANCE
// ─────────────────────────────────────────────────────────────────────

const GovernanceSection = () => (
  <section className="mb-32">
    <SectionAnchor
      id="governance"
      numeral="VIII"
      eyebrow="Governance"
      title="How this system evolves."
      description="The design system lives in code. Memory entries describe principles; src/lib/* is the source of truth."
    />

    <Card className="mb-8">
      <Subhead>Ownership</Subhead>
      <p className="text-foreground/80 leading-relaxed">{GOVERNANCE.ownership}</p>
    </Card>

    <Card className="mb-8">
      <Subhead>Before adding a token</Subhead>
      <ol className="space-y-3 list-decimal list-inside marker:text-cedar/60">
        {GOVERNANCE.beforeAddingAToken.map((item) => (
          <li key={item} className="text-foreground/80 leading-relaxed">
            {item}
          </li>
        ))}
      </ol>
    </Card>

    <Card className="mb-8">
      <Subhead>Deprecation</Subhead>
      <p className="text-foreground/80 leading-relaxed">{GOVERNANCE.deprecation}</p>
    </Card>

    <Card>
      <Subhead>Contributor checklist</Subhead>
      <ul className="space-y-3">
        {GOVERNANCE.contributorChecklist.map((item) => (
          <li key={item} className="flex gap-3 text-foreground/80">
            <span className="text-cedar mt-0.5">☐</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  </section>
);

// ─────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────

const StyleGuide = () => (
  <main className="min-h-screen bg-background">
    <Helmet>
      <title>Style Guide · Creek Construction</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>

    {/* Hero */}
    <section className="border-b border-border/60">
      <div className="container mx-auto px-6 md:px-10 max-w-7xl pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[11px] tracking-[0.25em] uppercase text-cedar">v1.0</span>
          <div className="w-12 h-px bg-cedar/30" />
          <span className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            April 2026
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight text-balance mb-6 max-w-3xl">
          Creek Construction Style Guide
        </h1>
        <p className="font-serif italic text-xl md:text-2xl text-foreground/60 leading-snug max-w-2xl text-balance">
          &ldquo;{BRAND_SPINE.purpose}&rdquo;
        </p>
      </div>
    </section>

    {/* Body */}
    <div className="container mx-auto px-6 md:px-10 max-w-7xl py-16 md:py-24">
      <div className="grid lg:grid-cols-[200px_1fr] gap-12 lg:gap-20">
        <LeftRail />
        <div className="min-w-0">
          <BrandSection />
          <ColorSection />
          <TypographySection />
          <SpacingSection />
          <MotionSection />
          <ComponentsSection />
          <PerformanceSection />
          <GovernanceSection />
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="border-t border-border/60">
      <div className="container mx-auto px-6 md:px-10 max-w-7xl py-8 text-[11px] tracking-[0.18em] uppercase text-muted-foreground/60 flex justify-between">
        <span>Creek Construction · Style Guide</span>
        <span>Source: src/lib/*.ts</span>
      </div>
    </footer>
  </main>
);

export default StyleGuide;
