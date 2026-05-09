import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import BronzeRule from "@/components/ui/bronze-rule";

type NavItem = {
  label: string;
  /** Path to navigate to. When omitted, `action` runs instead. */
  path?: string;
  /** Synthetic action (e.g. open modal). */
  action?: "quote";
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Work", path: "/work" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Get a Quote", action: "quote" },
];

/**
 * QuickNav — "/" command palette.
 *
 * Routes match the real five-route IA (Home / Services / Work / About /
 * Contact) plus a synthetic "Get a Quote" action that opens the QuoteModal
 * directly instead of navigating.
 */
const QuickNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { openModal } = useQuoteModal();

  const filtered = query
    ? NAV_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      )
    : NAV_ITEMS;

  // Listen for "/" keydown
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;
      if (e.key === "/") {
        e.preventDefault();
        setIsOpen(true);
        setQuery("");
        setActiveIndex(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Two-frame mount → enables CSS opacity transition from 0 → 1.
  useEffect(() => {
    if (!isOpen) {
      setMounted(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const go = useCallback(
    (item: NavItem) => {
      close();
      if (item.action === "quote") {
        // Defer modal open one frame so close animation can start.
        window.requestAnimationFrame(() => openModal([]));
        return;
      }
      if (item.path) navigate(item.path);
    },
    [navigate, close, openModal],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      go(filtered[activeIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-200 motion-reduce:transition-none ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={close}
    >
      <div className="absolute inset-0 bg-foreground/15" />

      <div
        className={`fixed top-0 left-0 right-0 bg-background/97 border-b border-transparent p-4 shadow-architectural transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          mounted ? "translate-y-0" : "-translate-y-4"
        }`}
        style={{
          borderImage:
            "linear-gradient(90deg, transparent 0%, hsl(var(--cedar) / 0.20) 50%, transparent 100%) 1",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Quick navigation"
      >
        <div className="container mx-auto max-w-lg">
          <div className="flex items-center gap-3 mb-3">
            <BronzeRule label="Navigate" width="short" variant="accent" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground/40 ml-auto">
              ESC to close
            </span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Where to?"
            className="w-full bg-transparent border-b border-border text-foreground text-sm font-medium tracking-[0.1em] py-2 px-1 outline-none placeholder:text-muted-foreground/50 focus:border-cedar/40 transition-colors duration-300"
            aria-label="Quick navigation search"
            role="combobox"
            aria-expanded="true"
            aria-controls="quicknav-list"
            aria-activedescendant={
              filtered[activeIndex] ? `quicknav-option-${activeIndex}` : undefined
            }
          />
          <ul id="quicknav-list" className="mt-3 space-y-1" role="listbox">
            {filtered.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={item.label}
                  id={`quicknav-option-${i}`}
                  role="option"
                  aria-selected={isActive}
                  className={`flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-sm cursor-pointer text-sm tracking-[0.1em] transition-[background-color,box-shadow] duration-200 ${
                    isActive
                      ? "bg-cedar/[0.06] text-foreground shadow-[inset_0_-2px_0_hsl(var(--cedar))]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => go(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <span className="uppercase text-[11px] font-medium">{item.label}</span>
                  <span className="text-[9px] text-muted-foreground/40 tabular-nums">
                    {isActive ? "press ↵" : item.path ?? "modal"}
                  </span>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-[11px] text-muted-foreground/50 tracking-[0.1em]">
                No matches
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuickNav;
