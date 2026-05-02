import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { CONTACT } from "@/config/contact";
import logo from "@/assets/creek-logo-nav-md.png";
import { SECTION_PADDING } from "@/lib/spacing";
import { EYEBROW } from "@/lib/typography";
import { TEXT } from "@/lib/colors";
import CedarCTA from "@/components/CedarCTA";

const Footer = () => {
  return (
    <footer
      id="site-footer"
      role="contentinfo"
      className="bg-evergreen text-evergreen-foreground relative"
    >
      <div className={`container mx-auto px-6 ${SECTION_PADDING.footer}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
              <div>
                <p className="font-serif text-lg leading-none">Creek Construction</p>
                <p className={EYEBROW.onDark + " mt-1"}>Calgary · Edmonton</p>
              </div>
            </div>
            <p className={`text-sm ${TEXT.onDark.secondary} leading-relaxed mb-6 max-w-xs`}>
              Excellence in the work. Residential exterior construction across Alberta — built right, the first time.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className={`flex items-center gap-2 ${TEXT.onDark.secondary} hover:text-cedar transition-colors min-h-[44px]`}
              >
                <Phone className="h-3.5 w-3.5" aria-hidden /> {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className={`flex items-center gap-2 ${TEXT.onDark.secondary} hover:text-cedar transition-colors min-h-[44px] break-all`}
              >
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{CONTACT.email}</span>
              </a>
            </div>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <h3 className={EYEBROW.onDark + " mb-5"}>Navigate</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/work", label: "Our Work" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`${TEXT.onDark.secondary} hover:text-cedar transition-colors min-h-[44px] flex items-center`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Service Areas */}
          <div>
            <h3 className={EYEBROW.onDark + " mb-5"}>Service Areas</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {CONTACT.cities.map((city) => (
                <span
                  key={city}
                  className={`text-xs ${TEXT.onDark.secondary} border border-evergreen-foreground/15 rounded-sm px-3 py-1.5`}
                >
                  {city}
                </span>
              ))}
            </div>
            <p className={`text-xs ${TEXT.onDark.tertiary} mt-4`}>Locally owned. Alberta-based.</p>
          </div>
        </div>

        {/* Tertiary Quote CTA — the final ask before the user leaves */}
        <div className="mt-12 pt-8 border-t border-evergreen-foreground/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 max-w-7xl mx-auto">
          <p className={`${TEXT.onDark.secondary} text-sm font-serif italic`}>
            Free quote in 30 seconds. No obligation.
          </p>
          <CedarCTA />
        </div>

        <div className="mt-12 pt-8 border-t border-evergreen-foreground/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
          <p className={`${TEXT.onDark.tertiary} text-xs`}>
            © {new Date().getFullYear()} Creek Construction. All rights reserved.
          </p>
          <span className="text-[9px] tracking-[0.25em] text-evergreen-foreground/30 uppercase">
            Excellence in the Work · Pride in Every Detail
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
