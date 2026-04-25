import { Link, useLocation } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Instagram } from "lucide-react";
import { useCallback } from "react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import CedarCTA from "@/components/CedarCTA";
import cedarTexture from "@/assets/cedar-texture-premium.jpg";
import veepoLogo from "@/assets/veepo-logo.png";

const Footer = () => {
  const serviceAreas = ["Edmonton", "Sherwood Park", "Red Deer", "Calgary", "Cochrane", "Canmore", "Bragg Creek"];
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer id="site-footer" role="contentinfo" className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Cedar grain texture — faint background layer */}
      <img
        src={cedarTexture}
        alt=""
        role="presentation"
        aria-hidden="true"
        width="1920"
        height="1280"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
      {/* Top gradient bleed */}
      <div
        className="absolute top-0 inset-x-0 h-16 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(180deg, hsl(var(--background) / 0.08) 0%, transparent 100%)' }}
      />

      {/* Dramatic closing ritual banner */}
      <div className="relative py-20 md:py-28 overflow-hidden" role="region" aria-label="Closing call to action">
        {/* Thermal gradient sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, hsl(var(--cedar) / 0.08) 0%, transparent 70%)',
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <ScrollRevealMotion>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="w-16 h-px bg-cedar/25" />
                <div className="w-2 h-2 rounded-full bg-cedar/40" />
                <div className="w-16 h-px bg-cedar/25" />
              </div>
              <p className="text-3xl md:text-5xl font-serif italic text-primary-foreground/70 tracking-wide leading-snug mb-10" style={{ textWrap: 'balance' }}>
                Your ritual starts the day we install.
              </p>
              <CedarCTA to="/plan">
                {isHomepage ? "START YOUR RITUAL" : "GET MY SAUNA PLAN"}
              </CedarCTA>
            </div>
          </ScrollRevealMotion>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-16 md:py-20 border-t border-primary-foreground/[0.06] footer-grain-shimmer">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Back to Top — compact */}
            <ScrollRevealMotion>
              <div className="flex justify-center mb-16">
                <button
                  onClick={scrollToTop}
                  className="group flex items-center gap-3 min-h-[44px] text-primary-foreground/40 hover:text-cedar transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                  aria-label="Back to top"
                >
                  <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
                  <span className="text-[11px] tracking-[0.2em] uppercase">Back to Top</span>
                </button>
              </div>
            </ScrollRevealMotion>

            <div className="grid md:grid-cols-3 gap-16 lg:gap-20 mb-16">
              {/* Brand Column */}
              <ScrollRevealMotion delay={0.1}>
                <div>
                  <h3 className="text-minimal tracking-[0.2em] mb-6">B&P SAUNA</h3>
                  <p className="text-primary-foreground/70 leading-relaxed mb-4">
                    Outdoor-only. Traditional heat. Installed turnkey.
                  </p>
                  <a
                    href="mailto:hello@bpsauna.ca"
                    className="text-primary-foreground/50 hover:text-cedar text-sm mb-3 min-h-[44px] flex items-center transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                  >
                    hello@bpsauna.ca
                  </a>
                  <a
                    href="https://instagram.com/bpsauna"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-foreground/50 hover:text-cedar text-sm min-h-[44px] transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    <span>Follow our builds</span>
                  </a>
                </div>
              </ScrollRevealMotion>
              
              {/* Navigate */}
              <ScrollRevealMotion delay={0.2}>
                <nav aria-label="Footer navigation">
                  <h3 className="text-minimal mb-6">NAVIGATE</h3>
                  <ul className="space-y-1" role="list">
                    {[
                      { to: "/signature", label: "Signature 8×8" },
                      { to: "/custom", label: "Custom Builds" },
                      { to: "/standard", label: "Our Standard" },
                      { to: "/resources", label: "Resources" },
                      { to: "/plan", label: "Get My Sauna Plan" },
                    ].map((link, i) => (
                      <li key={link.to}>
                         <Link
                          to={link.to}
                          className="footer-link-thermal flex items-center gap-3 py-3 min-h-[44px] text-primary-foreground/70 hover:text-primary-foreground hover:bg-cedar/[0.04] hover:pl-5 transition-all duration-500 group/link relative focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
                          style={{ transitionDelay: `${i * 30}ms` }}
                        >
                          <span
                            className="w-0 group-hover/link:w-3 h-px transition-all duration-500"
                            style={{ backgroundColor: `hsl(28 50% 52% / ${0.3 + (i / 4) * 0.5})` }}
                          />
                          <span className="transition-all duration-500 group-hover/link:translate-x-1">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </ScrollRevealMotion>
              
              {/* Service Areas */}
              <ScrollRevealMotion delay={0.3}>
                <div>
                  <h3 className="text-minimal mb-6">SERVICE AREAS</h3>
                  <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Service areas">
                    {serviceAreas.map((area, i) => (
                      <span
                        key={area}
                        role="listitem"
                        tabIndex={0}
                        className="service-area-chip grain-texture border border-primary-foreground/20 hover:border-cedar/50 hover:text-primary-foreground hover:bg-cedar/[0.06] hover:shadow-elevated hover:pl-4 px-3 py-2.5 min-h-[44px] flex items-center text-primary-foreground/70 text-xs rounded-sm shadow-contact transition-all duration-500 cursor-default focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                        style={{
                          transitionDelay: `${i * 40}ms`,
                          borderLeft: `2px solid hsl(28 50% 52% / ${0.1 + (i / (serviceAreas.length - 1)) * 0.35})`,
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="text-primary-foreground/40 text-xs mt-4">
                    Alberta-based. Turnkey delivery.
                  </p>
                </div>
              </ScrollRevealMotion>
            </div>

            {/* Thermal Crescendo Divider */}
            <ScrollRevealMotion delay={0.35}>
              <div className="relative h-px mb-10">
                <div className="absolute inset-0 bg-primary-foreground/[0.06]" />
                {/* Three rising cedar accents */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 -top-[3px]">
                  {[0.15, 0.4, 0.8].map((opacity, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                      style={{ backgroundColor: `hsl(28 50% 52% / ${opacity})` }}
                    />
                  ))}
                </div>
              </div>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.4}>
              <div className="pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-primary-foreground/50 text-sm">
                  © {new Date().getFullYear()} B&P Sauna. Alberta-built cedar saunas.
                </p>
                <span className="text-[9px] tracking-[0.25em] text-primary-foreground/20 uppercase">Est. Alberta · Crafted with Cedar & Intention</span>
              </div>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.45}>
              <div className="flex justify-center mt-12 pt-8">
                <a
                  href="https://veepo.ca/case-studies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/veepo flex flex-col items-center gap-4 max-w-xl w-full px-10 py-8 rounded-lg bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.06] transition-all duration-700 min-h-[44px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-primary relative overflow-hidden"
                  aria-label="Website powered by VeePo.ca — visit case studies"
                >
                  {/* Dual brand-color hover gradient — orange bottom-left, green bottom-right */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/veepo:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse 60% 70% at 20% 90%, rgba(255,140,50,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 90%, rgba(80,200,120,0.035) 0%, transparent 60%)',
                    }}
                  />
                  {/* Bottom-edge gradient line: VeePo orange → green */}
                  <div
                    className="absolute bottom-0 inset-x-0 h-[2px] rounded-b-lg opacity-30 group-hover/veepo:opacity-70 transition-opacity duration-700"
                    style={{ background: 'linear-gradient(90deg, #FF8C32, #50C878)' }}
                  />

                  {/* Micro-label with brand-color hover reveals */}
                  <span className="text-[11px] tracking-[0.25em] uppercase text-primary-foreground/40 relative z-10">
                    This Website Is{' '}
                    <span className="transition-colors duration-700 group-hover/veepo:text-[#FF8C32]">Locally</span>{' '}
                    <span className="transition-colors duration-700 group-hover/veepo:text-[#50C878]">Powered</span>{' '}
                    By
                  </span>
                  {/* Logo — TODO: replace veepo-logo.png (~1.4MB) with an optimized version */}
                  <img
                    src={veepoLogo}
                    alt="VeePo.ca"
                    height="56"
                    className="h-14 w-auto relative z-10 transition-all duration-700 group-hover/veepo:brightness-200 group-hover/veepo:scale-[1.05] group-hover/veepo:will-change-transform"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                  {/* Expanding gradient line: orange → green */}
                  <div
                    className="w-0 group-hover/veepo:w-20 h-px transition-all duration-700 relative z-10"
                    style={{ background: 'linear-gradient(90deg, #FF8C32, #50C878)' }}
                  />
                  {/* Tagline with brand-color hover reveals + arrow */}
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/25 transition-colors duration-700">
                      Where{' '}
                      <span className="transition-colors duration-700 group-hover/veepo:text-[#FF8C32]">Vision</span>{' '}
                      Meets{' '}
                      <span className="transition-colors duration-700 group-hover/veepo:text-[#50C878]">Precision</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary-foreground/0 group-hover/veepo:text-[#50C878] transition-all duration-700 group-hover/veepo:translate-x-0.5" aria-hidden="true" />
                  </div>
                </a>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
