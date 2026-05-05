import CedarCTA from "@/components/CedarCTA";

interface MidPageQuotePromptProps {
  /** Small uppercase eyebrow above the line. */
  eyebrow?: string;
  /** Serif headline — keep to one short sentence. */
  heading?: string;
  /** Pre-select these service ids when the modal opens. */
  preselectServices?: string[];
}

/**
 * MidPageQuotePrompt — the single canonical mid-page conversion bar.
 *
 * One cedar-bordered horizontal strip with eyebrow + serif headline + a
 * primary CedarCTA. Used identically inside the Services catalogue and
 * the Work gallery so the funnel "ask" never reads twice in two voices.
 */
const MidPageQuotePrompt = ({
  eyebrow = "Seen something you want?",
  heading = "Start a quote — pick the rest later.",
  preselectServices,
}: MidPageQuotePromptProps) => {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 px-6 md:px-8 py-7 rounded-sm border border-cedar/20 bg-cedar/[0.04]"
      aria-label="Mid-page quote prompt"
    >
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-1.5">
          {eyebrow}
        </p>
        <p className="font-serif text-xl md:text-2xl text-foreground leading-snug">
          {heading}
        </p>
      </div>
      <CedarCTA preselectServices={preselectServices} />
    </div>
  );
};

export default MidPageQuotePrompt;
