import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { CONTACT } from "@/config/contact";
import logo from "@/assets/creek-logo-nav-sm.png";
import { cn } from "@/lib/utils";
import { BUTTON } from "@/lib/colors";

interface NavigationProps {
  /** Currently unused — kept for API compatibility with legacy pages. */
  transparent?: boolean;
  is404?: boolean;
}

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Our Work", path: "/work" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const navLinkClass = "text-[11px] tracking-[0.2em] uppercase transition-colors min-h-[44px] flex items-center";

const Navigation = ({ transparent: _transparent }: NavigationProps) => {
  const [open, setOpen] = useState(false);
  const { openModal } = useQuoteModal();
  const location = useLocation();

  // Compact bronze CTA (smaller than the hero CedarCTA — same tokens).
  const navCta = cn(
    BUTTON.primary.base,
    "px-5 py-2.5 text-[10px] gap-2",
    BUTTON.primary.hover,
    BUTTON.primary.focus,
    BUTTON.primary.transition,
  );

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur border-b border-border/40">
      <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 min-h-[44px]" aria-label="Creek Construction — home">
          <img src={logo} alt="" width={44} height={44} className="h-10 w-10 md:h-12 md:w-12 object-contain" />
          <div className="hidden sm:block">
            <p className="font-serif text-base md:text-lg leading-none text-evergreen">Creek Construction</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">Calgary · Edmonton</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(navLinkClass, active ? "text-cedar" : "text-foreground/70 hover:text-cedar")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-cedar transition-colors min-h-[44px] px-2"
            aria-label={`Call ${CONTACT.phone}`}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden /> {CONTACT.phone}
          </a>
          <button
            type="button"
            onClick={() => openModal()}
            className={cn(navCta, "hidden sm:inline-flex")}
          >
            Request a Quote
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/40 bg-background">
          <nav className="container mx-auto px-6 py-4 flex flex-col" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-3 text-sm tracking-[0.15em] uppercase border-b border-border/30 last:border-0",
                  location.pathname === item.path ? "text-cedar" : "text-foreground/80",
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openModal();
              }}
              className={cn(navCta, "mt-4 justify-center")}
            >
              Request a Quote
            </button>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="mt-3 inline-flex items-center justify-center gap-2 text-sm text-foreground/70 hover:text-cedar transition-colors min-h-[44px]"
            >
              <Phone className="h-4 w-4" aria-hidden /> {CONTACT.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
