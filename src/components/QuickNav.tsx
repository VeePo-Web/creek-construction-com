import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Signature 8×8", path: "/signature" },
  { label: "Custom Builds", path: "/custom" },
  { label: "Our Standard", path: "/standard" },
  { label: "Resources", path: "/resources" },
  { label: "Get My Sauna Plan", path: "/plan" },
];

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const QuickNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query
    ? NAV_ITEMS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : NAV_ITEMS;

  // Listen for "/" keydown
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
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

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
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

  const go = useCallback((path: string) => {
    navigate(path);
    close();
  }, [navigate, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      go(filtered[activeIndex].path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-cedar/20 p-4 shadow-architectural"
            initial={{ y: prefersReducedMotion ? 0 : -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: prefersReducedMotion ? 0 : -16, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
          >
            <div className="container mx-auto max-w-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] tracking-[0.3em] text-cedar/40 uppercase">Navigate</span>
                <div className="w-6 h-px bg-cedar/15" />
                <span className="text-[9px] tracking-[0.2em] text-muted-foreground/30 ml-auto">ESC to close</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Where to?"
                className="w-full bg-transparent border-b border-border text-foreground text-sm font-medium tracking-[0.1em] py-2 px-1 outline-none placeholder:text-muted-foreground/50 focus:border-cedar/40 transition-colors duration-300"
                aria-label="Quick navigation search"
                role="combobox"
                aria-expanded="true"
                aria-controls="quicknav-list"
                aria-activedescendant={filtered[activeIndex] ? `quicknav-option-${activeIndex}` : undefined}
              />
              <ul id="quicknav-list" className="mt-3 space-y-1" role="listbox">
                {filtered.map((item, i) => (
                  <li
                    key={item.path}
                    id={`quicknav-option-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-sm cursor-pointer text-sm tracking-[0.1em] transition-all duration-200 ${
                      i === activeIndex
                        ? "bg-cedar/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => go(item.path)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <span className="uppercase text-[11px] font-medium">{item.label}</span>
                    <span className="text-[9px] text-muted-foreground/40 tabular-nums">{item.path}</span>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-[11px] text-muted-foreground/50 tracking-[0.1em]">
                    No matches
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickNav;
