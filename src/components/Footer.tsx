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
      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6 py-10 md:py-12">
        <div
          className="max-w-6xl mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 lg:gap-8 pt-8"
          style={{
            borderTop: "1px solid transparent",
            borderImage:
              "linear-gradient(90deg, hsl(var(--cedar) / 0) 0%, hsl(var(--cedar) / 0.35) 50%, hsl(var(--cedar) / 0) 100%) 1",
          }}
        >
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-serif text-base leading-none group-hover:text-cedar transition-colors">
              Creek Construction
            </span>
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center xl:justify-start gap-x-5 lg:gap-x-7 xl:gap-x-8 gap-y-2 text-sm">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-evergreen-foreground/80 hover:text-cedar transition-colors min-h-[44px] inline-flex items-center"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm">
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="text-evergreen-foreground/80 hover:text-cedar transition-colors tabular-nums"
            >
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-evergreen-foreground/80 hover:text-cedar transition-colors"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-evergreen-foreground/10 text-center">
          <p className="text-xs text-evergreen-foreground/55">
            © {new Date().getFullYear()} Creek Construction · Calgary · Edmonton
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
