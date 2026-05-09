import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { SECTION_PADDING } from "@/lib/spacing";
import logo from "@/assets/creek-logo-nav-md.png";

/**
 * Footer — three-zone editorial close.
 *
 * QuoteCloserCard above carries the conversion ask + trust signals.
 * The footer's role is wayfinding, identity, and a quiet last impression.
 *
 * Layout: lg+ → 12-col grid (identity 4 / navigate 4 / direct line 4),
 *         <lg → stacked, fading hairlines between zones.
 */

const FADING_RULE_H =
  "linear-gradient(90deg, hsl(var(--cedar) / 0) 0%, hsl(var(--cedar) / 0.22) 50%, hsl(var(--cedar) / 0) 100%) 1";
const FADING_RULE_V =
  "linear-gradient(180deg, hsl(var(--cedar) / 0) 0%, hsl(var(--cedar) / 0.20) 50%, hsl(var(--cedar) / 0) 100%) 1";

const Footer = () => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/work", label: "Work" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <footer
      id="site-footer"
      role="contentinfo"
      className={`relative bg-evergreen text-evergreen-foreground ${SECTION_PADDING.footer}`}
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(150 25% 18%) 0%, hsl(var(--evergreen)) 60%)",
      }}
    >
      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0">
          {/* ── Identity ── */}
          <div className="lg:col-span-4 lg:pr-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src={logo}
                alt=""
                width={40}
                height={40}
                className="h-9 w-9 lg:h-10 lg:w-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span className="font-serif text-lg leading-none group-hover:text-cedar transition-colors">
                Creek Construction
              </span>
            </Link>
            <p className="mt-5 font-serif italic text-sm text-evergreen-foreground/70 max-w-[28ch]">
              Built well, on time, on time again.
            </p>
          </div>

          {/* fading divider on mobile (above Navigate) */}
          <div
            className="lg:hidden -mx-5 sm:-mx-6 border-t border-transparent"
            style={{ borderImage: FADING_RULE_H }}
            aria-hidden
          />

          {/* ── Navigate ── */}
          <div
            className="lg:col-span-4 lg:px-10 lg:border-l lg:border-transparent"
            style={{ borderImage: FADING_RULE_V }}
          >
            <p className="text-[11px] tracking-[0.22em] uppercase text-cedar/70 mb-4 text-center lg:text-left">
              Navigate
            </p>
            <nav aria-label="Footer">
              <ul className="flex flex-col items-center lg:items-start space-y-2">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="group/link relative inline-flex items-center gap-2 min-h-[44px] text-sm text-evergreen-foreground/80 hover:text-cedar transition-colors"
                    >
                      <span
                        className="relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-cedar after:transition-all after:duration-300 group-hover/link:after:w-full"
                      >
                        {l.label}
                      </span>
                      <ArrowRight
                        className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* fading divider on mobile (above Direct line) */}
          <div
            className="lg:hidden -mx-5 sm:-mx-6 border-t border-transparent"
            style={{ borderImage: FADING_RULE_H }}
            aria-hidden
          />

          {/* ── Direct line ── */}
          <div
            className="lg:col-span-4 lg:pl-10 lg:border-l lg:border-transparent"
            style={{ borderImage: FADING_RULE_V }}
          >
            <p className="text-[11px] tracking-[0.22em] uppercase text-cedar/70 mb-4 text-center lg:text-left">
              Direct Line
            </p>
            <div className="flex flex-col items-center lg:items-start space-y-2">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="font-serif text-lg tabular-nums text-evergreen-foreground hover:text-cedar transition-colors min-h-[44px] inline-flex items-center"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sm text-evergreen-foreground/80 hover:text-cedar transition-colors min-h-[44px] inline-flex items-center"
              >
                {CONTACT.email}
              </a>
              <p className="pt-2 text-xs text-evergreen-foreground/55">
                Calgary &nbsp;·&nbsp; Edmonton &nbsp;·&nbsp; Alberta
              </p>
            </div>
          </div>
        </div>

        {/* © line */}
        <div
          className="max-w-6xl mx-auto mt-14 pt-6 border-t border-transparent"
          style={{ borderImage: FADING_RULE_H }}
        >
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-2 text-[11px] tracking-[0.18em] uppercase text-evergreen-foreground/55">
            <span className="tabular-nums text-cedar/60">// {new Date().getFullYear()}</span>
            <span className="tabular-nums">
              © Creek Construction — All rights reserved
            </span>
            <span>Made in Alberta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
