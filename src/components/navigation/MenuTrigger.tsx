import { cn } from "@/lib/utils";

interface MenuTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  /** Used by aria-controls on the button — must match the menu's id. */
  controlsId: string;
  /** Light treatment over dark hero surfaces. */
  onDark?: boolean;
  /** When true, render the "MENU" label beside the lines (md+). */
  withLabel?: boolean;
  className?: string;
}

/**
 * MenuTrigger — animated hamburger ↔ X button.
 *
 * 48x48px touch target (WCAG 2.5.8 + Apple HIG). The three lines morph
 * to an X via translate + rotate when `isOpen` flips. A faint cedar
 * border + optional "MENU" label give Tier-2 entry a distinct affordance
 * so users don't confuse it with section anchors.
 *
 * Uses the global prefers-reduced-motion override in index.css to fall
 * back instantly.
 */
const MenuTrigger = ({
  isOpen,
  onClick,
  controlsId,
  onDark = false,
  withLabel = false,
  className,
}: MenuTriggerProps) => {
  const lineColor = onDark ? "bg-evergreen-foreground" : "bg-foreground";
  const labelColor = onDark
    ? "text-evergreen-foreground/85"
    : "text-foreground/75";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label={isOpen ? "Close site menu" : "Open site menu"}
      className={cn(
        "relative flex items-center justify-center gap-2.5 rounded-[2px]",
        "border border-cedar/12 hover:border-cedar/40 hover:bg-cedar/5",
        "transition-[background-color,border-color] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
        // When labelled, give it pill proportions; otherwise stay square 48x48.
        withLabel ? "h-12 pl-3 pr-3.5" : "w-12 h-12",
        className,
      )}
    >
      <span aria-hidden className="relative w-5 h-4 block shrink-0">
        <span
          className={cn(
            "absolute left-0 right-0 h-px transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]",
            lineColor,
            isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
          )}
        />
        <span
          className={cn(
            "absolute left-0 right-0 h-px top-1/2 -translate-y-1/2 transition-opacity duration-200",
            lineColor,
            isOpen ? "opacity-0" : "opacity-100",
          )}
        />
        <span
          className={cn(
            "absolute left-0 right-0 h-px transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]",
            lineColor,
            isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
          )}
        />
      </span>

      {withLabel && (
        <span
          className={cn(
            "eyebrow-base",
            labelColor,
          )}
        >
          {isOpen ? "Close" : "Menu"}
        </span>
      )}

      <span className="sr-only">{isOpen ? "Close" : "Open"} menu</span>
    </button>
  );
};

export default MenuTrigger;
