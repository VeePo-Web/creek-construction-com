import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { SECTION_PADDING } from "@/lib/spacing";
import { TRUST_LINE } from "@/config/trust-signals";
import CedarCTA from "@/components/CedarCTA";
import logo from "@/assets/creek-logo-nav-md.png";

/**
 * Footer — calm closing band. Flat evergreen, flat hairlines.
 *
 * Structure:
 *   CTA row     — last-chance quote CTA + trust line
 *   3-col grid  — identity · navigate · direct line
 *   © line      — legal + provenance
 */
const Footer = () => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/work", label: "Work" },
    { to: "/about", label: "About" },
    { to: "/areas-we-serve", label: "Areas" },
    { to: "/contact", label: "Contact" },
  ];

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar rounded-[2px]";

  const linkInteraction = `hover:text-cedar active:opacity-70 transition-colors duration-300 ${focusRing}`;

  return (
    <footer
      id="site-footer"
      className={`relative bg-evergreen text-evergreen-foreground ${SECTION_PADDING.footer}`}
    >
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-5 md:px-8">

        {/* ── CTA row — last-chance conversion ── */}
        <div className="max-w-6xl mx-auto pb-12 mb-12 md:pb-16 md:mb-16 border-b border-evergreen-foreground/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            <p className="eyebrow text-evergreen-foreground/55 max-w-[52ch]">
              {TRUST_LINE}
            </p>
            <div className="shrink-0">
              <CedarCTA />
            </div>
          </div>
        </div>

        {/* ── 3-column grid ── */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 md:gap-6 lg:gap-0">

          {/* Identity */}
          <div className="lg:col-span-4 lg:pr-10 flex flex-col items-start text-left">
            <Link
              to="/"
              className={`inline-flex items-center gap-3 group min-h-[44px] active:opacity-70 ${focusRing}`}
            >
              <img
                src={logo}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-9 w-9 lg:h-10 lg:w-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="font-serif text-lg leading-none group-hover:text-cedar transition-colors duration-300">
                Creek Construction
              </span>
            </Link>
            <p className="mt-4 text-sm text-evergreen-foreground/60 leading-relaxed">
              {CONTACT.description}
            </p>
          </div>

          {/* mobile-only divider — hidden at md+ to keep grid items clean */}
          <div className="md:hidden border-t border-evergreen-foreground/10" aria-hidden />

          {/* Navigate */}
          <div className="lg:col-span-4 md:pl-6 lg:px-10 md:border-l md:border-evergreen-foreground/10">
            <p className="eyebrow mb-4">Navigate</p>
            <nav aria-label="Footer">
              <ul className="flex flex-col items-start space-y-2">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={`group/link relative inline-flex items-center min-h-[44px] text-sm text-evergreen-foreground/80 ${linkInteraction}`}
                    >
                      <span className="relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-cedar after:transition-all after:duration-300 group-hover/link:after:w-full">
                        {l.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* mobile-only divider */}
          <div className="md:hidden border-t border-evergreen-foreground/10" aria-hidden />

          {/* Direct Line */}
          <div className="lg:col-span-4 md:pl-6 lg:pl-10 md:border-l md:border-evergreen-foreground/10">
            <p className="eyebrow mb-4">Direct Line</p>
            <div className="flex flex-col items-start space-y-2">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className={`font-serif text-lg tabular-nums text-evergreen-foreground min-h-[44px] inline-flex items-center ${linkInteraction}`}
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className={`text-sm text-evergreen-foreground/80 min-h-[44px] inline-flex items-center ${linkInteraction}`}
              >
                {CONTACT.email}
              </a>
              {/* Instagram de-emphasised — exit door, visually subordinate to phone/email */}
              <div className="w-full pt-2 border-t border-evergreen-foreground/10" aria-hidden />
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Creek Construction on Instagram — @${CONTACT.instagram}`}
                className={`text-sm text-evergreen-foreground/55 min-h-[44px] inline-flex items-center gap-2 ${linkInteraction}`}
              >
                <Instagram className="h-4 w-4" aria-hidden />
                @{CONTACT.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* © line */}
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-evergreen-foreground/10">
          <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2 eyebrow opacity-55">
            <span>© Creek Construction — All rights reserved</span>
            <span>Made in Alberta</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
