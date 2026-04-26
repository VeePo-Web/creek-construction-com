import { cn } from "@/lib/utils";

interface MenuTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  /** Used by aria-controls on the button — must match the menu's id. */
  controlsId: string;
  /** Light treatment over dark hero surfaces. */
  onDark?: boolean;
  className?: string;
}

/**
 * MenuTrigger — animated hamburger ↔ X button.
 *
 * 48x48px touch target (WCAG 2.5.8 + Apple HIG). The three lines morph
 * to an X via translate + rotate when `isOpen` flips. Uses the global
 * prefers-reduced-motion override in index.css to fall back instantly.
 */
const MenuTrigger = ({ isOpen, onClick, controlsId, onDark = false, className }: MenuTriggerProps) => {
  const lineColor = onDark ? "bg-evergreen-foreground" : "bg-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label={isOpen ? "Close site menu" : "Open site menu"}
      className={cn(
        "relative w-12 h-12 flex items-center justify-center rounded-sm",
        "hover:bg-cedar/10 transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
        className,
      )}
    >
      <span className="sr-only">{isOpen ? "Close" : "Open"} menu</span>
      <span aria-hidden className="relative w-5 h-4 block">
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
    </button>
  );
};

export default MenuTrigger;
