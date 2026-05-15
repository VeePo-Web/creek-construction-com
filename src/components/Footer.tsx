import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { SECTION_PADDING } from "@/lib/spacing";
import logo from "@/assets/creek-logo-nav-md.png";

/**
 * Footer — calm closing band. Flat evergreen, flat hairlines.
 */
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
          </div>

          {/* mobile divider */}
          <div className="lg:hidden border-t border-evergreen-foreground/10" aria-hidden />

          {/* ── Navigate ── */}
          <div className="lg:col-span-4 lg:px-10 lg:border-l lg:border-evergreen-foreground/10">
            <p className="eyebrow mb-4 text-center lg:text-left">
              Navigate
            </p>
            <nav aria-label="Footer">
              <ul className="flex flex-col items-center lg:items-start space-y-2">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="group/link relative inline-flex items-center min-h-[44px] text-sm text-evergreen-foreground/80 hover:text-cedar transition-colors"
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

          {/* mobile divider */}
          <div className="lg:hidden border-t border-evergreen-foreground/10" aria-hidden />

          {/* ── Direct line ── */}
          <div className="lg:col-span-4 lg:pl-10 lg:border-l lg:border-evergreen-foreground/10">
            <p className="eyebrow mb-4 text-center lg:text-left">
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
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Creek Construction on Instagram — @${CONTACT.instagram}`}
                className="text-sm text-evergreen-foreground/80 hover:text-cedar transition-colors min-h-[44px] inline-flex items-center gap-2"
              >
                <Instagram className="h-4 w-4" aria-hidden />
                @{CONTACT.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* © line */}
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-evergreen-foreground/10">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-2 eyebrow opacity-55">
            <span>© Creek Construction — All rights reserved</span>
            <span>Made in Alberta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
