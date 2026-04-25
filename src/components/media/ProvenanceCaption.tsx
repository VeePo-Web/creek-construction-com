interface ProvenanceCaptionProps {
  /** Roman numeral or section index (e.g. "I", "II"). */
  numeral?: string;
  /** Location string ("Bridgeland · Calgary"). */
  location?: string;
  /** Year of the work shown. */
  year?: number;
  /** Optional descriptor (e.g. "Cedar privacy fence"). */
  subject?: string;
  /** Visual weight — 'subtle' for inline captions, 'standard' for section markers. */
  variant?: "subtle" | "standard";
  className?: string;
}

/**
 * ProvenanceCaption — the editorial line under a media block.
 *
 * "I · Bridgeland · 2025 · Cedar privacy fence"
 *
 * Used to give photographs the editorial grammar of a portfolio — never
 * marketing copy, just the four facts.
 */
const ProvenanceCaption = ({
  numeral,
  location,
  year,
  subject,
  variant = "standard",
  className = "",
}: ProvenanceCaptionProps) => {
  const parts = [
    numeral,
    location,
    year ? String(year) : null,
    subject,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  const sizeClass =
    variant === "subtle"
      ? "text-[9px] tracking-[0.22em]"
      : "text-[10px] tracking-[0.2em]";

  return (
    <div
      className={`flex items-center gap-3 ${sizeClass} uppercase text-muted-foreground/70 ${className}`}
      aria-hidden="true"
    >
      {numeral && (
        <span className="text-cedar/60 tabular-nums font-light">
          {numeral}
        </span>
      )}
      {numeral && parts.length > 1 && (
        <div className="w-6 h-px bg-cedar/30" />
      )}
      {parts.slice(numeral ? 1 : 0).map((p, i, arr) => (
        <span key={i} className="flex items-center gap-3">
          <span>{p}</span>
          {i < arr.length - 1 && <span className="text-cedar/30">·</span>}
        </span>
      ))}
    </div>
  );
};

export default ProvenanceCaption;
