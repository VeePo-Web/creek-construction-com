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
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 px-6 md:px-8 py-7 border-l-[3px] border-cedar/40 bg-cedar/[0.03] rounded-r-[2px]"
      aria-label="Mid-page quote prompt"
    >
      <div className="max-w-[28ch]">
        <p className="eyebrow mb-1.5">
          {eyebrow}
        </p>
        <p className="font-serif text-2xl md:text-3xl text-foreground leading-snug text-balance">
          {heading}
        </p>
      </div>
      <div className="mt-2 sm:mt-0 shrink-0">
        <CedarCTA preselectServices={preselectServices} />
      </div>
    </div>
  );
};

export default MidPageQuotePrompt;
