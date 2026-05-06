import { Link } from "react-router-dom";
import { CONTACT } from "@/config/contact";
import logo from "@/assets/creek-logo-nav-md.png";

/**
 * Footer — single quiet editorial line.
 *
 * The QuoteCloserCard immediately above already carries the conversion
 * ask + trust signals. The footer's job is wayfinding + © only.
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
      className="bg-evergreen text-evergreen-foreground"
    >
      <div className="container mx-auto px-6 py-10 md:py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-serif text-base leading-none group-hover:text-cedar transition-colors">
              Creek Construction
            </span>
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-evergreen-foreground/65 hover:text-cedar transition-colors min-h-[44px] inline-flex items-center"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5 text-sm">
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="text-evergreen-foreground/65 hover:text-cedar transition-colors"
            >
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-evergreen-foreground/65 hover:text-cedar transition-colors hidden sm:inline"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-evergreen-foreground/10 text-center">
          <p className="text-xs text-evergreen-foreground/45">
            © {new Date().getFullYear()} Creek Construction · Calgary · Edmonton
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
