/**
 * Creek Construction — Style Guide v4
 *
 * The editorial brain, rendered. Live, copy-to-clipboard reference for
 * every token in src/lib/*.ts. Lazy-loaded at /style-guide.
 * Hidden from public nav and search indexing.
 *
 * Architecture notes (read before editing):
 * 1. Every visual primitive lives at the top of this file. NEVER hand-roll
 *    a bordered surface, eyebrow label, or token row inline. Use the
 *    primitives. They exist so future contributors cannot drift the
 *    surface.
 * 2. Every section uses <GuideSection>. The section numeral, scroll-margin,
 *    and bottom rhythm are owned there.
 * 3. Token rows route through <TokenCard>. Do/don't pairs route through
 *    <DoDontGrid>. Lists route through <RuleList>.
 * 4. Only Section VI (Components in situ) may import from
 *    @/components/ui/* — every other section is a TOKEN reference, not a
 *    component demo.
 * 5. Anti-drift rules are documented in STYLE_GUIDE.md. Read them before
 *    adding a new section.
 *
 * Cross-references:
 * - Tokens: src/lib/{colors,typography,spacing,motion,brand-identity}.ts
 * - Governance doc: STYLE_GUIDE.md
 * - Memory: mem://design/token-architecture.md
 */

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BRAND,
  BACKDROP,
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
  BODY,
  QUOTE,
  STAT,
  UI,
  LINE_HEIGHT,
  LETTER_SPACING,
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
  GRID_8PX,
  SPACING_RULES,
} from "@/lib/spacing";
import {
  EASING,
  DURATION,
  HOVER,
  FOCUS,
  REDUCED_MOTION,
  DELAY_SEQUENCE,
  KEYFRAME,
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
// VI. Components-in-situ imports (only this section may pull from @/components/*).
import BronzeRule from "@/components/ui/bronze-rule";
import StatTrio from "@/components/ui/stat-trio";
import TrustChips from "@/components/ui/trust-chip";
import BrandMark from "@/components/navigation/BrandMark";
import CedarCTA from "@/components/CedarCTA";
import { Award, ShieldCheck, Hammer } from "lucide-react";

// ═════════════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — the consistency contract.
// Every visible surface on this page MUST route through one of these.
// ═════════════════════════════════════════════════════════════════════

/**
 * Eyebrow label. Locks the 30+ instances of
 *   text-[10px] uppercase tracking-[0.25em] text-cedar
 * that drift across the page if hand-rolled.
 */
const EyebrowLabel = ({
  children,
  tone = "accent",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "accent" | "muted" | "onDark";
  className?: string;
}) => {
  const toneClass =
    tone === "accent"
      ? "text-cedar"
      : tone === "muted"
      ? "text-muted-foreground/70"
      : "text-cedar/80";
  return (
    <div
      className={`text-[10px] tracking-[0.25em] uppercase font-medium ${toneClass} ${className}`}
    >
      {children}
    </div>
  );
};

/** Copy-to-clipboard chip used by every token row. */
const CopyButton = ({ text, label }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-sm hover:bg-cedar/[0.06] transition-colors text-muted-foreground hover:text-cedar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-1"
      aria-label={copied ? "Copied to clipboard" : `Copy ${label ?? text}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-cedar" aria-hidden />
      ) : (
        <Copy className="w-3.5 h-3.5" aria-hidden />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
};

/** Single canonical mono code chip. Locks color and padding. */
const Mono = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <code
    className={`font-mono text-[11px] text-foreground/80 bg-secondary/50 px-2 py-1 rounded-sm ${className}`}
  >
    {children}
  </code>
);

/** Card surface — the single bordered container for the page. */
const Card = ({
  children,
  className = "",
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  /** "default" — hairline border. "dark" — evergreen surface. "accent" — cedar/30 left border. */
  tone?: "default" | "dark" | "accent";
}) => {
  const toneClass =
    tone === "dark"
      ? "border border-evergreen-foreground/10 bg-evergreen text-evergreen-foreground"
      : tone === "accent"
      ? "border border-border/60 bg-background border-l-2 border-l-cedar/40"
      : "border border-border/60 bg-background";
  return (
    <div className={`${toneClass} rounded-sm p-6 ${className}`}>{children}</div>
  );
};

/** Subhead inside a section. Adds a leading hairline so subsections separate cleanly. */
const Subhead = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-16 first:mt-0 mb-6">
    <div className="h-px w-8 bg-cedar/30 mb-3" aria-hidden />
    <h3 className="font-serif text-foreground text-2xl leading-tight">{children}</h3>
  </div>
);

/**
 * Token row — the canonical row used by every Color / Spacing / Motion table.
 * Renders title + optional description + value chip + copy button.
 */
const TokenRow = ({
  name,
  value,
  description,
}: {
  name: string;
  value: string;
  description?: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-border/40 last:border-0">
    <div className="min-w-0 flex-1">
      <div className="text-sm font-medium text-foreground">{name}</div>
      {description && (
        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</div>
      )}
    </div>
    <div className="shrink-0 max-w-[55%] overflow-x-auto">
      <Mono className="block whitespace-nowrap">{value}</Mono>
    </div>
    <CopyButton text={value} label={name} />
  </div>
);

/**
 * TokenCard — for token displays that need their own preview block (gradients,
 * shadows, swatches). Always renders header → preview → value chip.
 */
const TokenCard = ({
  title,
  value,
  preview,
  description,
}: {
  title: string;
  value: string;
  preview?: React.ReactNode;
  description?: string;
}) => (
  <Card className="space-y-3 p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</div>
        )}
      </div>
      <CopyButton text={value} label={title} />
    </div>
    {preview && <div>{preview}</div>}
    <Mono className="block overflow-x-auto whitespace-nowrap">{value}</Mono>
  </Card>
);

/** Two-column do/don't card stack used at the close of Type, Spacing, Motion. */
const DoDontGrid = ({
  doItems,
  dontItems,
}: {
  doItems: readonly string[];
  dontItems: readonly string[];
}) => (
  <div className="grid md:grid-cols-2 gap-6">
    <Card tone="accent">
      <EyebrowLabel className="mb-4">✓ Do</EyebrowLabel>
      <ul className="space-y-3">
        {doItems.map((r) => (
          <li key={r} className="text-foreground/80 leading-snug text-sm">
            {r}
          </li>
        ))}
      </ul>
    </Card>
    <Card>
      <EyebrowLabel tone="muted" className="mb-4">
        ✕ Don&rsquo;t
      </EyebrowLabel>
      <ul className="space-y-3">
        {dontItems.map((r) => (
          <li
            key={r}
            className="text-muted-foreground leading-snug text-sm"
          >
            {r}
          </li>
        ))}
      </ul>
    </Card>
  </div>
);

/**
 * Rule list — the canonical pattern for non-negotiables, photography rules,
 * "ways we sound" lists. Two variants control bullet color.
 */
const RuleList = ({
  items,
  variant = "accent",
}: {
  items: readonly string[];
  variant?: "accent" | "mute";
}) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li
        key={item}
        className={`flex gap-3 leading-relaxed ${
          variant === "accent" ? "text-foreground/85" : "text-muted-foreground"
        }`}
      >
        <span
          aria-hidden
          className={`mt-1.5 ${
            variant === "accent" ? "text-cedar/70" : "text-muted-foreground/40"
          }`}
        >
          —
        </span>
        <span className="text-sm">{item}</span>
      </li>
    ))}
  </ul>
);

/** Section header — locks the I — Eyebrow / Title / Description block. */
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
  <header id={id} className="mb-14 scroll-mt-28">
    <div className="flex items-center gap-4 mb-6">
      <span className="text-[11px] tracking-[0.2em] text-cedar/50 font-light tabular-nums">
        {numeral}
      </span>
      <div className="w-8 h-px bg-cedar/25" aria-hidden />
      <EyebrowLabel>{eyebrow}</EyebrowLabel>
    </div>
    <h2 className="font-serif text-foreground text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-balance mb-4">
      {title}
    </h2>
    <p className="font-sans text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
      {description}
    </p>
  </header>
);

/** Top-level section wrapper. Owns bottom margin so all sections breathe equally. */
const GuideSection = ({
  id,
  numeral,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  numeral: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="mb-32">
    <SectionAnchor
      id={id}
      numeral={numeral}
      eyebrow={eyebrow}
      title={title}
      description={description}
    />
    {children}
  </section>
);

// ═════════════════════════════════════════════════════════════════════
// SECTION INDEX — drives the rail and the header strip.
// ═════════════════════════════════════════════════════════════════════

const SECTIONS = [
  { id: "brand", numeral: "I", label: "Brand" },
  { id: "verbal", numeral: "II", label: "Verbal" },
  { id: "color", numeral: "III", label: "Color" },
  { id: "type", numeral: "IV", label: "Type" },
  { id: "spacing", numeral: "V", label: "Spacing" },
  { id: "motion", numeral: "VI", label: "Motion" },
  { id: "components", numeral: "VII", label: "Components" },
  { id: "imagery", numeral: "VIII", label: "Imagery" },
  { id: "logo", numeral: "IX", label: "Logo" },
  { id: "performance", numeral: "X", label: "Performance" },
  { id: "governance", numeral: "XI", label: "Governance" },
] as const;

const LeftRail = () => (
  <nav
    aria-label="Style guide sections"
    className="lg:sticky lg:top-28 lg:self-start"
  >
    <EyebrowLabel tone="muted" className="mb-4">
      Contents
    </EyebrowLabel>
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

// ═════════════════════════════════════════════════════════════════════
// I. BRAND
// ═════════════════════════════════════════════════════════════════════

const BrandSection = () => (
  <GuideSection
    id="brand"
    numeral="I"
    eyebrow="Brand Identity"
    title="The editorial brain."
    description="Strategy, voice, value proposition, and the non-negotiables that govern every design and copy decision. Every contributor reads this before shipping."
  >
    <Tabs defaultValue="spine" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary/40 p-1 rounded-sm mb-10">
        {[
          { v: "spine", l: "Spine" },
          { v: "voice", l: "Voice" },
          { v: "value", l: "Value" },
          { v: "visual", l: "Visual" },
          { v: "color-usage", l: "Color Usage" },
          { v: "guardrails", l: "Guardrails" },
        ].map((t) => (
          <TabsTrigger
            key={t.v}
            value={t.v}
            className="text-[11px] tracking-[0.18em] uppercase data-[state=active]:bg-background data-[state=active]:text-cedar data-[state=active]:shadow-sm rounded-sm px-4 py-2"
          >
            {t.l}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="spine" className="space-y-6">
        <Card>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <EyebrowLabel className="mb-2">Tagline</EyebrowLabel>
              <p className="font-serif text-3xl text-foreground leading-tight text-balance">
                {BRAND_SPINE.tagline}
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <EyebrowLabel tone="muted" className="mb-2">
                  Purpose
                </EyebrowLabel>
                <p className="text-foreground/80 leading-relaxed">
                  {BRAND_SPINE.purpose}
                </p>
              </div>
              <div>
                <EyebrowLabel tone="muted" className="mb-2">
                  Promise
                </EyebrowLabel>
                <p className="text-foreground/80 leading-relaxed">
                  {BRAND_SPINE.promise}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <EyebrowLabel className="mb-4">Personality</EyebrowLabel>
            <div className="flex flex-wrap gap-2 mb-8">
              {BRAND_SPINE.personality.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 border border-cedar/40 text-cedar text-[11px] tracking-[0.18em] uppercase rounded-sm"
                >
                  {p}
                </span>
              ))}
            </div>
            <EyebrowLabel className="mb-3">Audience</EyebrowLabel>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {BRAND_SPINE.audience}
            </p>
          </Card>
          <Card>
            <EyebrowLabel className="mb-4">Not For</EyebrowLabel>
            <RuleList items={BRAND_SPINE.notFor} variant="mute" />
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="voice" className="space-y-6">
        <Card>
          <EyebrowLabel className="mb-4">Voice attributes</EyebrowLabel>
          <RuleList items={VOICE.attributes} />
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          <Card tone="accent">
            <EyebrowLabel className="mb-4">✓ Phrases we say</EyebrowLabel>
            <ul className="space-y-3">
              {VOICE.do.map((p) => (
                <li
                  key={p}
                  className="font-serif italic text-foreground/85 text-lg leading-snug"
                >
                  &ldquo;{p}&rdquo;
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <EyebrowLabel tone="muted" className="mb-4">
              ✕ Phrases we never say
            </EyebrowLabel>
            <ul className="space-y-3">
              {VOICE.dont.map((p) => (
                <li
                  key={p}
                  className="text-muted-foreground leading-snug text-sm line-through decoration-foreground/20"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="value" className="space-y-6">
        <Card>
          <EyebrowLabel className="mb-4">Primary value</EyebrowLabel>
          <p className="font-serif text-2xl md:text-3xl text-foreground leading-snug text-balance">
            {VALUE_PROP.primary}
          </p>
        </Card>
        <div className="grid md:grid-cols-3 gap-6">
          {VALUE_PROP.pillars.map((p, i) => (
            <Card key={p.title}>
              <div
                className="text-[10px] tracking-[0.25em] uppercase mb-3 tabular-nums"
                style={{
                  color: `hsl(var(--cedar) / ${bronzeStep(i, VALUE_PROP.pillars.length)})`,
                }}
              >
                {String(i + 1).padStart(2, "0")} · Pillar
              </div>
              <h4 className="font-serif text-xl text-foreground mb-3 leading-snug">
                {p.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {p.proof}
              </p>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="visual" className="space-y-6">
        <Card>
          <EyebrowLabel className="mb-3">Philosophy</EyebrowLabel>
          <p className="font-serif italic text-xl text-foreground/80 leading-snug text-balance">
            &ldquo;{VISUAL_DIRECTION.philosophy}&rdquo;
          </p>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          {VISUAL_DIRECTION.principles.map((p) => (
            <Card key={p.name}>
              <EyebrowLabel className="mb-2">Principle</EyebrowLabel>
              <h4 className="font-serif text-xl text-foreground mb-2 leading-snug">
                {p.name}
              </h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {p.description}
              </p>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="color-usage" className="space-y-6">
        <Card>
          <EyebrowLabel className="mb-3">When to reach for which color</EyebrowLabel>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The palette is five colors total. Each one carries a job. If you
            find yourself reaching for a color the brand doesn&rsquo;t own,
            you&rsquo;re solving the wrong problem.
          </p>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(VISUAL_DIRECTION.colorUsage).map(([key, usage]) => {
            const swatch =
              key === "evergreen"
                ? "hsl(150 25% 16%)"
                : key === "bronze"
                ? "hsl(28 55% 45%)"
                : key === "cream"
                ? "hsl(38 30% 97%)"
                : "hsl(38 20% 93%)";
            return (
              <Card key={key}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-6 h-6 rounded-sm border border-border/60"
                    style={{ background: swatch }}
                    aria-hidden
                  />
                  <h4 className="font-serif text-xl text-foreground capitalize">
                    {key}
                  </h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {usage}
                </p>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="guardrails" className="space-y-6">
        <Card>
          <Subhead>Non-negotiables</Subhead>
          <ul className="space-y-5">
            {NON_NEGOTIABLES.map((n) => (
              <li key={n.rule} className="border-l-2 border-cedar/40 pl-4">
                <div className="text-foreground font-medium mb-1 leading-snug">
                  {n.rule}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
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
                <div className="text-foreground/90 mb-1 leading-snug">
                  <span className="text-foreground/40 mr-2">✕</span>
                  {d.pattern}
                </div>
                <div className="text-sm text-muted-foreground pl-6 leading-relaxed">
                  {d.why}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>
    </Tabs>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// II. VERBAL IDENTITY
// ═════════════════════════════════════════════════════════════════════

const VerbalSection = () => (
  <GuideSection
    id="verbal"
    numeral="II"
    eyebrow="Verbal Identity"
    title="Sweat the small details."
    description="Capitalization, punctuation, and the canonical strings every contributor copies. Drift here is what makes a brand feel cheap."
  >
    <Subhead>Brand name capitalization</Subhead>
    <Card className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-cedar font-bold text-xs tracking-[0.18em]">
          ✓ DO
        </span>
        <p className="font-serif text-2xl text-foreground">
          {VERBAL_IDENTITY.capitalization.correct}
        </p>
      </div>
      <div className="border-t border-border/40 pt-4">
        <EyebrowLabel tone="muted" className="mb-3">
          ✕ Never
        </EyebrowLabel>
        <div className="flex flex-wrap gap-2">
          {VERBAL_IDENTITY.capitalization.wrong.map((w) => (
            <span
              key={w}
              className="px-3 py-1.5 border border-foreground/15 text-muted-foreground text-sm rounded-sm line-through decoration-foreground/30"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground/80 mt-4 italic leading-relaxed">
        {VERBAL_IDENTITY.capitalization.note}
      </p>
    </Card>

    <Subhead>Service capitalization</Subhead>
    <Card className="mb-6">
      <EyebrowLabel className="mb-4">Headline / list form</EyebrowLabel>
      <div className="flex flex-wrap gap-2 mb-4">
        {VERBAL_IDENTITY.services.correct.map((s) => (
          <span
            key={s}
            className="px-3 py-1.5 bg-secondary/60 text-foreground text-sm rounded-sm"
          >
            {s}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground italic leading-relaxed">
        {VERBAL_IDENTITY.services.note}
      </p>
    </Card>

    <Subhead>Punctuation</Subhead>
    <Card className="mb-6">
      <ol className="space-y-3 list-decimal list-inside marker:text-cedar/60">
        {VERBAL_IDENTITY.punctuation.map((rule) => (
          <li
            key={rule}
            className="text-foreground/85 text-sm leading-relaxed pl-2"
          >
            {rule}
          </li>
        ))}
      </ol>
    </Card>

    <Subhead>Canonical contact strings</Subhead>
    <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
      Copy these exactly. Never re-type a phone number, email, or service area
      in a component. Drift here turns into typos in production.
    </p>
    <div className="grid md:grid-cols-3 gap-6">
      <TokenCard
        title="Phone"
        value={VERBAL_IDENTITY.phone}
        description="Primary public number. Format with parentheses + dashes."
      />
      <TokenCard
        title="Email"
        value={VERBAL_IDENTITY.email}
        description="Primary inbox. Capital C in Creekproconstruction."
      />
      <TokenCard
        title="Service area"
        value={VERBAL_IDENTITY.serviceArea}
        description="Always cite both cities. Never abbreviate Alberta."
      />
    </div>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// III. COLOR
// ═════════════════════════════════════════════════════════════════════

const Swatch = ({ entry }: { entry: (typeof BRAND)[keyof typeof BRAND] }) => (
  <Card className="overflow-hidden p-0">
    <div
      className="h-40 w-full"
      style={{ background: `hsl(${entry.hsl})` }}
      aria-label={`${entry.name} preview`}
    />
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif text-xl text-foreground">{entry.name}</h4>
        <CopyButton text={entry.hex} label={entry.name} />
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground/60 tracking-[0.15em] uppercase w-12">
            Hex
          </span>
          <code className="font-mono text-foreground/80">{entry.hex}</code>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground/60 tracking-[0.15em] uppercase w-12">
            HSL
          </span>
          <code className="font-mono text-foreground/80">{entry.hsl}</code>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground/60 tracking-[0.15em] uppercase w-12">
            Var
          </span>
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
  <GuideSection
    id="color"
    numeral="III"
    eyebrow="Color"
    title="Five colors. Opacity is the variation tool."
    description="No rainbow. Warm undertones throughout — never pure white, never pure black. Bronze is the only accent and it's reserved for moments that earn attention."
  >
    <Subhead>Brand palette</Subhead>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.values(BRAND).map((c) => (
        <Swatch key={c.name} entry={c} />
      ))}
    </div>

    <Subhead>Bronze opacity scale</Subhead>
    <Card>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
        The legacy &ldquo;thermal crescendo&rdquo; pattern. Use ascending
        opacities for ordered lists where intensity should build (service cards
        1→6, contact steps 1→4). Use{" "}
        <Mono>bronzeStep(i, total)</Mono> to compute it.
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

    <Subhead>Backdrops &amp; gradients</Subhead>
    <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
      Composed CSS gradients used as section, hero, and fallback backgrounds.
      Use as <Mono>style=&#123;&#123; background: BACKDROP.x &#125;&#125;</Mono>.
    </p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(BACKDROP).map(([name, value]) => (
        <TokenCard
          key={name}
          title={`BACKDROP.${name}`}
          value={value}
          preview={
            <div
              className="h-24 rounded-sm border border-border/40"
              style={{ background: value }}
              aria-label={`${name} preview`}
            />
          }
        />
      ))}
    </div>

    <Subhead>Surfaces</Subhead>
    <Card>
      {Object.entries(SURFACE).map(([name, value]) => (
        <TokenRow key={name} name={`SURFACE.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Buttons</Subhead>
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <EyebrowLabel className="mb-4">Primary</EyebrowLabel>
        <button
          className={`${BUTTON.primary.base} ${BUTTON.primary.hover} ${BUTTON.primary.focus} ${BUTTON.primary.transition}`}
        >
          Get a free quote
        </button>
      </Card>
      <Card>
        <EyebrowLabel className="mb-4">Secondary</EyebrowLabel>
        <button
          className={`${BUTTON.secondary.base} ${BUTTON.secondary.hover} ${BUTTON.secondary.focus} ${BUTTON.secondary.transition}`}
        >
          See our work
        </button>
      </Card>
      <Card>
        <EyebrowLabel className="mb-4">Ghost</EyebrowLabel>
        <button
          className={`${BUTTON.ghost.base} ${BUTTON.ghost.hover} ${BUTTON.ghost.focus} ${BUTTON.ghost.transition}`}
        >
          Learn more
        </button>
      </Card>
      <Card>
        <EyebrowLabel className="mb-4">Link</EyebrowLabel>
        <button
          className={`${BUTTON.link.base} ${BUTTON.link.hover} ${BUTTON.link.focus} ${BUTTON.link.transition}`}
        >
          Read more →
        </button>
      </Card>
    </div>

    <Subhead>Dividers</Subhead>
    <Card>
      <div className="space-y-8">
        {Object.entries(DIVIDER).map(([name, value]) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-2 text-xs">
              <code className="font-mono text-foreground/80">DIVIDER.{name}</code>
              <CopyButton text={value} label={`DIVIDER.${name}`} />
            </div>
            <div className={value} />
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Borders</Subhead>
    <Card>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(BORDER).map(([name, value]) => (
          <div key={name} className={`${value} rounded-sm p-4 bg-background`}>
            <div className="text-xs font-mono text-muted-foreground">
              BORDER.{name}
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Shadows</Subhead>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(SHADOW).map(([name, value]) => (
        <div
          key={name}
          className={`${value} bg-background rounded-sm p-6 border border-border/40`}
        >
          <div className="text-xs font-mono text-muted-foreground mb-2">
            SHADOW.{name}
          </div>
          <div className="text-[11px] text-muted-foreground/60">{value}</div>
        </div>
      ))}
    </div>

    <Subhead>Text on surfaces</Subhead>
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <EyebrowLabel className="mb-4">On Light</EyebrowLabel>
        {Object.entries(TEXT.onLight).map(([name, value]) => (
          <div
            key={name}
            className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
          >
            <span className={value}>The quick brown fox</span>
            <code className="text-[11px] font-mono text-muted-foreground">
              {name}
            </code>
          </div>
        ))}
      </Card>
      <Card tone="dark">
        <EyebrowLabel tone="onDark" className="mb-4">
          On Dark
        </EyebrowLabel>
        {Object.entries(TEXT.onDark).map(([name, value]) => (
          <div
            key={name}
            className="flex items-center justify-between py-2 border-b border-evergreen-foreground/15 last:border-0"
          >
            <span className={value}>The quick brown fox</span>
            <code className="text-[11px] font-mono text-evergreen-foreground/60">
              {name}
            </code>
          </div>
        ))}
      </Card>
    </div>

    <Subhead>Contrast audit</Subhead>
    <Card>
      <div className="space-y-3">
        {Object.entries(CONTRAST).map(([key, c]) => (
          <div
            key={key}
            className="flex items-center gap-4 py-2 border-b border-border/40 last:border-0"
          >
            <div
              className={`${c.bg} ${c.fg} px-4 py-3 rounded-sm flex-1 text-sm`}
            >
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-foreground tabular-nums">
                {c.ratio.toFixed(1)}:1
              </div>
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
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// IV. TYPOGRAPHY
// ═════════════════════════════════════════════════════════════════════

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
      <code className="text-[11px] tracking-[0.15em] uppercase text-cedar/80 font-medium">
        {label}
      </code>
      <CopyButton text={className} label={label} />
    </div>
    <div className={className}>{example}</div>
    <code className="block mt-3 text-[10px] font-mono text-muted-foreground/70 leading-snug">
      {className}
    </code>
  </div>
);

const TypographySection = () => (
  <GuideSection
    id="type"
    numeral="IV"
    eyebrow="Typography"
    title="Two families. Editorial restraint."
    description="DM Serif Display for the brand's voice. DM Sans for everything else. Curly quotes, balanced wraps, never bold body."
  >
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <EyebrowLabel className="mb-3">Serif</EyebrowLabel>
        <div className="font-serif text-5xl text-foreground leading-none mb-3">
          DM Serif Display
        </div>
        <div className="font-serif text-foreground/80 text-lg leading-snug">
          Headlines, quotes, stats. The brand&rsquo;s signature voice.
        </div>
      </Card>
      <Card>
        <EyebrowLabel className="mb-3">Sans</EyebrowLabel>
        <div className="font-sans text-5xl text-foreground leading-none mb-3 font-light">
          DM Sans
        </div>
        <div className="font-sans text-muted-foreground text-base leading-relaxed">
          Body, UI, labels. The everyday workhorse.
        </div>
      </Card>
    </div>

    <Subhead>Headlines</Subhead>
    <Card>
      <TypeSpecimen
        label="HEADLINE.hero"
        className={HEADLINE.hero}
        example="Excellence in the work."
      />
      <TypeSpecimen
        label="HEADLINE.display"
        className={HEADLINE.display}
        example="Built to outlast Alberta winters."
      />
      <TypeSpecimen
        label="HEADLINE.section"
        className={HEADLINE.section}
        example="What we build."
      />
      <TypeSpecimen
        label="HEADLINE.sub"
        className={HEADLINE.sub}
        example="Decks &amp; pergolas"
      />
      <TypeSpecimen
        label="HEADLINE.card"
        className={HEADLINE.card}
        example="Cedar deck, Edmonton"
      />
    </Card>

    <Subhead>Eyebrows (CSS utilities — see src/index.css)</Subhead>
    <Card>
      <TypeSpecimen label=".eyebrow" className="eyebrow" example="The Work" />
      <TypeSpecimen label=".eyebrow-base + text-cedar" className="eyebrow-base text-cedar" example="Featured Project" />
      <TypeSpecimen label=".cta-label + text-cedar" className="cta-label text-cedar" example="Get my free quote" />
    </Card>

    <Subhead>Body</Subhead>
    <Card>
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
      <TypeSpecimen
        label="BODY.caption"
        className={BODY.caption}
        example="Photo: J. Carter, Sept 2024"
      />
    </Card>

    <Subhead>Quotes</Subhead>
    <Card>
      <TypeSpecimen
        label="QUOTE.testimonial"
        className={QUOTE.testimonial}
        example="They showed up when they said they would and left the yard cleaner than they found it."
      />
      <TypeSpecimen
        label="QUOTE.attribution"
        className={QUOTE.attribution}
        example="Marcus L. — Sherwood Park"
      />
    </Card>

    <Subhead>Stats</Subhead>
    <Card>
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
    <Card>
      <TypeSpecimen label="UI.button" className={UI.button} example="Get a free quote" />
      <TypeSpecimen label="UI.label" className={UI.label} example="Property type" />
      <TypeSpecimen label="UI.navLink" className={UI.navLink} example="Services" />
    </Card>

    <Subhead>Line height</Subhead>
    <Card>
      {Object.entries(LINE_HEIGHT).map(([name, value]) => (
        <TokenRow key={name} name={`LINE_HEIGHT.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Letter spacing</Subhead>
    <Card>
      {Object.entries(LETTER_SPACING).map(([name, value]) => (
        <TokenRow key={name} name={`LETTER_SPACING.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Text width</Subhead>
    <Card className="space-y-4">
      {Object.entries(TEXT_WIDTH).map(([name, value]) => (
        <div key={name}>
          <div className="text-xs font-mono text-muted-foreground mb-2">
            TEXT_WIDTH.{name} — {value}
          </div>
          <div className={`${value} h-3 bg-cedar/30 rounded-sm`} />
        </div>
      ))}
    </Card>

    <div className="mt-12">
      <DoDontGrid doItems={TYPOGRAPHY_RULES.do} dontItems={TYPOGRAPHY_RULES.dont} />
    </div>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// V. SPACING
// ═════════════════════════════════════════════════════════════════════

const SpacingSection = () => (
  <GuideSection
    id="spacing"
    numeral="V"
    eyebrow="Spacing"
    title="The breathing rule."
    description="Built on an 8px grid. Generous section padding (96–128px) is the default. Compressed sections feel cheap."
  >
    <Subhead>Section padding</Subhead>
    <Card>
      {Object.entries(SECTION_PADDING).map(([name, value]) => (
        <TokenRow key={name} name={`SECTION_PADDING.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Container padding</Subhead>
    <Card>
      {Object.entries(CONTAINER_PADDING).map(([name, value]) => (
        <TokenRow key={name} name={`CONTAINER_PADDING.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Max widths</Subhead>
    <Card className="space-y-4">
      {Object.entries(MAX_WIDTH).map(([name, value]) => (
        <div key={name}>
          <div className="flex items-center justify-between text-xs mb-2">
            <code className="font-mono text-foreground/80">MAX_WIDTH.{name}</code>
            <CopyButton text={value} label={`MAX_WIDTH.${name}`} />
          </div>
          <div className={`${value} h-2 bg-cedar/30 rounded-sm`} />
        </div>
      ))}
    </Card>

    <Subhead>Content gap</Subhead>
    <Card>
      {Object.entries(CONTENT_GAP).map(([name, value]) => (
        <TokenRow key={name} name={`CONTENT_GAP.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Grid gap</Subhead>
    <Card>
      {Object.entries(GRID_GAP).map(([name, value]) => (
        <TokenRow key={name} name={`GRID_GAP.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>The 8px grid</Subhead>
    <Card>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
        Reference values for inline styles where a token doesn&rsquo;t exist.
        Visual ladder showing each step on the grid:
      </p>
      <div className="space-y-3">
        {Object.entries(GRID_8PX).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <div className="w-16 text-xs font-mono text-muted-foreground">
              {name}
            </div>
            <div
              className="h-3 bg-cedar/40 rounded-sm"
              style={{ width: value }}
              aria-hidden
            />
            <div className="text-xs font-mono text-foreground/70 tabular-nums">
              {value}
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Touch targets</Subhead>
    <Card>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        WCAG 2.5.8 — every interactive element must meet 44×44px minimum on
        mobile.
      </p>
      <div className="flex items-end gap-6">
        {Object.entries(TOUCH_TARGET).map(([name]) => {
          const size = name === "min" ? 44 : name === "comfort" ? 48 : 56;
          return (
            <div key={name} className="text-center">
              <div
                className="bg-cedar/20 border border-cedar/40 rounded-sm flex items-center justify-center"
                style={{ width: size, height: size }}
              >
                <span className="text-[10px] tabular-nums text-cedar font-medium">
                  {size}px
                </span>
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-2">
                {name}
              </div>
            </div>
          );
        })}
      </div>
    </Card>

    <div className="mt-12">
      <DoDontGrid doItems={SPACING_RULES.do} dontItems={SPACING_RULES.dont} />
    </div>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// VI. MOTION
// ═════════════════════════════════════════════════════════════════════

const EasingDemo = ({ name, curve }: { name: string; curve: string }) => {
  const [active, setActive] = useState(false);
  return (
    <div
      className="group relative overflow-hidden border border-border/60 rounded-sm p-4 bg-background hover:border-cedar/40 cursor-pointer"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <code className="text-xs font-mono text-foreground">EASING.{name}</code>
        <CopyButton text={curve} label={`EASING.${name}`} />
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
      <code className="block mt-3 text-[10px] font-mono text-muted-foreground/70">
        {curve}
      </code>
    </div>
  );
};

const MotionSection = () => (
  <GuideSection
    id="motion"
    numeral="VI"
    eyebrow="Motion"
    title="Breathing easing."
    description="Organic and unhurried. Never spring-bouncy, never linear. The default curve decelerates like an exhale. All non-essential motion respects prefers-reduced-motion."
  >
    <Subhead>Easing — hover to play</Subhead>
    <div className="grid sm:grid-cols-2 gap-4">
      {Object.entries(EASING).map(([name, curve]) => (
        <EasingDemo key={name} name={name} curve={curve} />
      ))}
    </div>

    <Subhead>Duration</Subhead>
    <Card>
      {Object.entries(DURATION).map(([name, value]) => (
        <TokenRow key={name} name={`DURATION.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Hover patterns</Subhead>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(HOVER).map(([name, value]) => (
        <Card key={name} className={`${value} cursor-pointer`}>
          <EyebrowLabel className="mb-2">HOVER.{name}</EyebrowLabel>
          <div className="text-foreground font-medium">Hover me</div>
          <code className="block mt-3 text-[10px] font-mono text-muted-foreground/60 leading-snug">
            {value}
          </code>
        </Card>
      ))}
    </div>

    <Subhead>Focus rings</Subhead>
    <Card>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Tab to each control to see the visible focus ring.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          className={`px-6 py-3 bg-background border border-border rounded-sm text-sm ${FOCUS.ring}`}
        >
          FOCUS.ring
        </button>
        <input
          type="text"
          placeholder="FOCUS.ringInset"
          className={`px-4 py-3 bg-background border border-border rounded-sm text-sm ${FOCUS.ringInset}`}
        />
      </div>
    </Card>
    <Card tone="dark" className="mt-6">
      <button
        className={`px-6 py-3 bg-cedar text-cedar-foreground rounded-sm text-sm tracking-[0.15em] uppercase ${FOCUS.ringOnDark}`}
      >
        FOCUS.ringOnDark
      </button>
    </Card>

    <Subhead>Stagger delays</Subhead>
    <Card>
      {Object.entries(DELAY_SEQUENCE).map(([name, value]) => (
        <TokenRow key={name} name={`DELAY_SEQUENCE.${name}`} value={`${value}s`} />
      ))}
    </Card>

    <Subhead>Reduced motion utilities</Subhead>
    <Card>
      {Object.entries(REDUCED_MOTION).map(([name, value]) => (
        <TokenRow key={name} name={`REDUCED_MOTION.${name}`} value={value} />
      ))}
    </Card>

    <Subhead>Registered keyframes</Subhead>
    <Card>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Tailwind animation utilities registered in <Mono>tailwind.config.ts</Mono>.
      </p>
      {Object.entries(KEYFRAME).map(([name, value]) => (
        <TokenRow key={name} name={`KEYFRAME.${name}`} value={value} />
      ))}
    </Card>

    <div className="mt-12">
      <DoDontGrid doItems={MOTION_RULES.do} dontItems={MOTION_RULES.dont} />
    </div>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// VII. COMPONENTS — the only section allowed to import from @/components/*
// ═════════════════════════════════════════════════════════════════════

const ASPECT_RATIOS = [
  { name: "aspect-hero", ratio: "16 / 9", usage: "Hero photography" },
  { name: "aspect-bleed", ratio: "21 / 9", usage: "Editorial full-bleed" },
  { name: "aspect-editorial", ratio: "4 / 5", usage: "Portrait editorial" },
  { name: "aspect-portrait", ratio: "3 / 4", usage: "Project portraits" },
  { name: "aspect-detail", ratio: "4 / 3", usage: "Detail shots" },
  { name: "aspect-square", ratio: "1 / 1", usage: "Grid tiles" },
  { name: "aspect-cinema", ratio: "2.39 / 1", usage: "Cinema bleed" },
] as const;

const TRUST_DEMO = [
  { icon: ShieldCheck, label: "WCB Covered" },
  { icon: Award, label: "$5M Liability" },
  { icon: Hammer, label: "Same crew" },
];

const ComponentsSection = () => (
  <GuideSection
    id="components"
    numeral="VII"
    eyebrow="Components"
    title="The shipped library."
    description="Live previews of the components used across the site. Import from @/components/* — never re-implement."
  >
    <Subhead>Components in situ</Subhead>
    <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
      The shared primitives that compose every page. If you need one of these
      patterns, import the component — don&rsquo;t rebuild it.
    </p>

    <Card className="mb-6">
      <EyebrowLabel className="mb-4">BronzeRule — editorial divider</EyebrowLabel>
      <BronzeRule numeral="01" label="The Approach" />
    </Card>

    <Card className="mb-6">
      <EyebrowLabel className="mb-4">TrustChips — signal row</EyebrowLabel>
      <TrustChips items={TRUST_DEMO} variant="rule" />
      <div className="mt-6">
        <TrustChips items={TRUST_DEMO} variant="badge" />
      </div>
    </Card>

    <Card className="mb-6">
      <EyebrowLabel className="mb-4">StatTrio — card variant</EyebrowLabel>
      <StatTrio
        items={[
          { value: 7, suffix: "+", label: "Years in business", static: true },
          { value: 240, suffix: "+", label: "Projects completed", static: true },
          { value: 5, prefix: "$", suffix: "M", label: "Liability coverage", static: true },
        ]}
        variant="card"
      />
    </Card>

    <Card className="mb-6">
      <EyebrowLabel className="mb-4">CedarCTA — primary &amp; secondary</EyebrowLabel>
      <div className="flex flex-wrap items-center gap-6">
        <CedarCTA to="#">Get my free quote</CedarCTA>
        <CedarCTA to="#" variant="secondary">
          See our work
        </CedarCTA>
      </div>
    </Card>

    <Subhead>Aspect ratios</Subhead>
    <Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASPECT_RATIOS.map((a) => (
          <div key={a.name}>
            <div
              className="bg-cedar/15 border border-cedar/30 rounded-sm flex items-center justify-center mb-3"
              style={{ aspectRatio: a.ratio }}
            >
              <code className="text-xs font-mono text-cedar">{a.ratio}</code>
            </div>
            <div className="flex items-center justify-between text-xs">
              <code className="font-mono text-foreground/80">{a.name}</code>
              <CopyButton text={a.name} label={a.name} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{a.usage}</div>
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Form inputs</Subhead>
    <Card className="space-y-4">
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
        <select
          className={`w-full px-4 py-3 bg-background border border-border rounded-sm ${UI.input} ${FOCUS.ringInset}`}
        >
          <option>Deck</option>
          <option>Fence</option>
          <option>Shed</option>
        </select>
      </div>
    </Card>

    <Subhead>Card surfaces</Subhead>
    <div className="grid sm:grid-cols-3 gap-6">
      <div className="bg-background border border-border rounded-sm p-6">
        <EyebrowLabel className="mb-2">Default</EyebrowLabel>
        <div className="text-foreground">bg-background</div>
      </div>
      <div className="bg-secondary rounded-sm p-6">
        <EyebrowLabel className="mb-2">Section</EyebrowLabel>
        <div className="text-foreground">bg-secondary</div>
      </div>
      <div className="bg-evergreen text-evergreen-foreground rounded-sm p-6">
        <EyebrowLabel tone="onDark" className="mb-2">
          Dark
        </EyebrowLabel>
        <div>bg-evergreen</div>
      </div>
    </div>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// VIII. IMAGERY & MEDIA
// ═════════════════════════════════════════════════════════════════════

const ImagerySection = () => (
  <GuideSection
    id="imagery"
    numeral="VIII"
    eyebrow="Imagery"
    title="Real photography. Tasteful fallback."
    description="The work is the hero. Everything visual on the site funnels through the MediaSlot → EditorialPicture pipeline so we never paint a stock photo or a missing-image hole into the surface."
  >
    <Subhead>Photography rules</Subhead>
    <Card className="mb-6">
      <RuleList items={VISUAL_DIRECTION.photographyRules} />
    </Card>

    <Subhead>Provenance contract</Subhead>
    <Card className="mb-6">
      <p className="text-foreground/85 leading-relaxed text-sm mb-4">
        Every photograph on the site goes through the approval pipeline:{" "}
        <Mono>useApprovedMedia</Mono> queries the cloud library,{" "}
        <Mono>EditorialPicture</Mono> renders responsive sources with LQIP
        blur-up, and <Mono>EditorialBleedSection</Mono> handles full-bleed
        compositions. Only approved media — with location, year, and crew lead
        in metadata — is allowed in production.
      </p>
      <p className="text-muted-foreground leading-relaxed text-sm">
        See <Mono>MEDIA_PLAYBOOK.md</Mono> for the full pipeline. See{" "}
        <Mono>mem://features/editorial-media-system</Mono> for the
        architecture overview.
      </p>
    </Card>

    <Subhead>Aspect ratio ladder</Subhead>
    <Card className="mb-6">
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Every editorial slot maps to one of these. Compose
        <Mono>aspect-*</Mono> on the wrapper, never on the image itself.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASPECT_RATIOS.map((a) => (
          <div key={a.name}>
            <div
              className="bg-cedar/15 border border-cedar/30 rounded-sm flex items-center justify-center mb-3"
              style={{ aspectRatio: a.ratio }}
            >
              <code className="text-xs font-mono text-cedar">{a.ratio}</code>
            </div>
            <div className="text-xs font-mono text-foreground/80">{a.name}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{a.usage}</div>
          </div>
        ))}
      </div>
    </Card>

    <Subhead>Fallback gradients</Subhead>
    <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
      When a media slot has no approved photograph, the surface paints one of
      these warm gradients instead of a missing-image hole. <Mono>stonePlate</Mono>
      is the default; reach for the others only with intent.
    </p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {(["stonePlate", "cedarPlate", "evergreenCard", "bronzeWash"] as const).map(
        (k) => (
          <TokenCard
            key={k}
            title={`BACKDROP.${k}`}
            value={BACKDROP[k]}
            preview={
              <div
                className="aspect-editorial rounded-sm border border-border/40"
                style={{ background: BACKDROP[k] }}
                aria-label={`${k} preview`}
              />
            }
          />
        ),
      )}
    </div>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// IX. LOGO & MARKS
// ═════════════════════════════════════════════════════════════════════

const LogoSection = () => (
  <GuideSection
    id="logo"
    numeral="IX"
    eyebrow="Logo"
    title="One mark. Two contexts."
    description="The Creek Construction wordmark + monogram. Always rendered through BrandMark — never re-typeset from the wordmark alone."
  >
    <Subhead>BrandMark in context</Subhead>
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      <Card>
        <EyebrowLabel className="mb-6">On light</EyebrowLabel>
        <BrandMark />
      </Card>
      <Card tone="dark">
        <EyebrowLabel tone="onDark" className="mb-6">
          On dark
        </EyebrowLabel>
        <BrandMark onDark />
      </Card>
    </div>

    <Subhead>Asset paths</Subhead>
    <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
      Canonical files in the project. Import the navigation logo via the
      asset alias; never hard-link to the public folder.
    </p>
    <div className="grid md:grid-cols-2 gap-6">
      <TokenCard
        title="Navigation logo (small)"
        value="@/assets/creek-logo-nav-sm.png"
        description="44×44 retina-ready medallion used by BrandMark."
      />
      <TokenCard
        title="Master mark"
        value="@/assets/creek-construction-master.png"
        description="Highest-resolution wordmark. Use only in print exports."
      />
      <TokenCard
        title="Apple touch icon"
        value="/apple-touch-icon.png"
        description="Public-folder asset. Already wired in index.html."
      />
      <TokenCard
        title="Open Graph card"
        value="/og-image.jpg"
        description="1200×630 social share image. Used by JSON-LD."
      />
    </div>

    <Subhead>Logo guardrails</Subhead>
    <DoDontGrid
      doItems={[
        "Always render the logo through the BrandMark component.",
        "Maintain a clear-space margin equal to the height of the medallion on every side.",
        "Use the on-dark variant on any surface darker than secondary.",
        "Keep the medallion at least 32px high. Below that, use the favicon family.",
      ]}
      dontItems={[
        "Don't re-color the logo — it's evergreen on light, cream on dark, full stop.",
        "Don't rotate, skew, or stretch the logo.",
        "Don't add drop shadows, glows, or strokes.",
        "Don't typeset “Creek Construction” yourself in DM Serif. The medallion is part of the mark.",
      ]}
    />
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// X. PERFORMANCE
// ═════════════════════════════════════════════════════════════════════

/**
 * Last measured on the live preview, mobile viewport (390×844), simulated 4G,
 * cold cache. UPDATE THIS OBJECT after every performance pass.
 */
const LAST_MEASURED: Record<string, { value: string; status: "pass" | "warn" | "fail" }> = {
  lcp: { value: "—", status: "warn" },
  cls: { value: "<0.05", status: "pass" },
  inp: { value: "—", status: "warn" },
  jsBudget: { value: "~280 KB", status: "warn" },
  cssBudget: { value: "~6 KB", status: "pass" },
  lighthouse: { value: "—", status: "warn" },
};

const PERF_MEASURED_AT =
  "2026-04-26 · post Style-Guide v4 · /, mobile 390×844";

const PerfBadge = ({
  status,
  value,
}: {
  status: "pass" | "warn" | "fail";
  value: string;
}) => {
  const styles = {
    pass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    warn: "text-amber-700 bg-amber-50 border-amber-200",
    fail: "text-red-700 bg-red-50 border-red-200",
  }[status];
  return (
    <span
      className={`inline-block font-mono text-sm tabular-nums px-2 py-0.5 rounded-sm border ${styles}`}
    >
      {value}
    </span>
  );
};

const PerformanceSection = () => (
  <GuideSection
    id="performance"
    numeral="X"
    eyebrow="Performance"
    title="Budgets we measure against."
    description="Performance is a feature. These are the thresholds we hold the homepage to on mobile, simulated 4G."
  >
    <Card className="mb-4">
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
              <th className="text-left text-[10px] tracking-[0.25em] uppercase text-muted-foreground py-3 pr-4">
                Critical
              </th>
              <th className="text-left text-[10px] tracking-[0.25em] uppercase text-foreground py-3">
                Last measured
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(PERFORMANCE_BUDGETS).map(([name, b]) => {
              const m = LAST_MEASURED[name];
              return (
                <tr key={name} className="border-b border-border/40">
                  <td className="py-3 pr-4 font-mono text-sm text-foreground">
                    {name.toUpperCase()}
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-cedar tabular-nums">
                    {b.target}
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-muted-foreground tabular-nums">
                    {b.critical}
                  </td>
                  <td className="py-3">
                    {m ? (
                      <PerfBadge status={m.status} value={m.value} />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-12">
      {PERF_MEASURED_AT}
    </p>

    <Subhead>Accessibility minimums</Subhead>
    <Card>
      <ul className="space-y-4">
        {Object.entries(ACCESSIBILITY).map(([key, value]) => (
          <li key={key} className="border-l-2 border-cedar/40 pl-4">
            <EyebrowLabel className="mb-1">{key}</EyebrowLabel>
            <div className="text-foreground/80 text-sm leading-relaxed">
              {value}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// XI. GOVERNANCE
// ═════════════════════════════════════════════════════════════════════

const GovernanceSection = () => (
  <GuideSection
    id="governance"
    numeral="XI"
    eyebrow="Governance"
    title="How this system evolves."
    description="The design system lives in code. Memory entries describe principles; src/lib/* is the source of truth."
  >
    <Card className="mb-6">
      <Subhead>Ownership</Subhead>
      <p className="text-foreground/80 leading-relaxed">
        {GOVERNANCE.ownership}
      </p>
    </Card>

    <Card className="mb-6">
      <Subhead>Before adding a token</Subhead>
      <ol className="space-y-3 list-decimal list-inside marker:text-cedar/60">
        {GOVERNANCE.beforeAddingAToken.map((item) => (
          <li key={item} className="text-foreground/80 leading-relaxed pl-2">
            {item}
          </li>
        ))}
      </ol>
    </Card>

    <Card className="mb-6">
      <Subhead>Deprecation</Subhead>
      <p className="text-foreground/80 leading-relaxed">
        {GOVERNANCE.deprecation}
      </p>
    </Card>

    <Card className="mb-6">
      <Subhead>Contributor checklist</Subhead>
      <ul className="space-y-3">
        {GOVERNANCE.contributorChecklist.map((item) => (
          <li key={item} className="flex gap-3 text-foreground/80">
            <span className="text-cedar mt-0.5" aria-hidden>
              ☐
            </span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </Card>

    <Card tone="accent">
      <Subhead>This page is alive</Subhead>
      <p className="text-foreground/80 leading-relaxed text-sm">
        Every swatch, token, and rule on this page is rendered from{" "}
        <Mono>src/lib/*.ts</Mono> at request time. Edit a token there and this
        page updates without anyone touching the JSX. That is the contract.
      </p>
    </Card>
  </GuideSection>
);

// ═════════════════════════════════════════════════════════════════════
// PAGE — header + rail + body + footer
// ═════════════════════════════════════════════════════════════════════

const HeaderStrip = () => (
  <section className="border-b border-border/60 bg-background">
    <div className="container mx-auto px-6 md:px-10 max-w-7xl pt-24 pb-14 md:pt-32 md:pb-20">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 text-[11px] tracking-[0.22em] uppercase">
        <span className="text-cedar">Creek Construction</span>
        <span className="text-cedar/30">·</span>
        <span className="text-muted-foreground">Brand &amp; Design System</span>
        <span className="text-cedar/30">·</span>
        <span className="text-muted-foreground">v1.0</span>
        <span className="text-cedar/30">·</span>
        <span className="text-muted-foreground">April 2026</span>
      </div>
      <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight text-balance mb-6 max-w-3xl">
        The editorial brain.
      </h1>
      <p className="font-serif italic text-xl md:text-2xl text-foreground/65 leading-snug max-w-2xl text-balance mb-10">
        &ldquo;{BRAND_SPINE.purpose}&rdquo;
      </p>

      {/* Index strip — one-glance map of the document. */}
      <div className="border-t border-border/40 pt-6">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] tracking-[0.2em] uppercase">
          {SECTIONS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="hidden sm:inline-block w-px h-3 bg-border" />
              )}
              <a
                href={`#${s.id}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-cedar transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 rounded-sm"
              >
                <span className="text-cedar/50 tabular-nums">{s.numeral}</span>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const StyleGuide = () => {
  useDocumentTitle(
    "Style Guide",
    "Creek Construction internal design system reference.",
  );

  // Inject noindex meta — this page is internal only.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <HeaderStrip />

      <div className="container mx-auto px-6 md:px-10 max-w-7xl py-16 md:py-24">
        <div className="grid lg:grid-cols-[200px_1fr] gap-12 lg:gap-20">
          <LeftRail />
          <div className="min-w-0">
            <BrandSection />
            <VerbalSection />
            <ColorSection />
            <TypographySection />
            <SpacingSection />
            <MotionSection />
            <ComponentsSection />
            <ImagerySection />
            <LogoSection />
            <PerformanceSection />
            <GovernanceSection />
          </div>
        </div>
      </div>

      <footer className="border-t border-border/60">
        <div className="container mx-auto px-6 md:px-10 max-w-7xl py-10 flex flex-col sm:flex-row gap-3 justify-between text-[11px] tracking-[0.18em] uppercase text-muted-foreground/70">
          <span>Creek Construction · Style Guide v1.0 · April 2026</span>
          <span>
            Built from <span className="font-mono normal-case tracking-normal text-foreground/60">src/lib/*</span> — change tokens there to update this page.
          </span>
        </div>
      </footer>
    </main>
  );
};

export default StyleGuide;
