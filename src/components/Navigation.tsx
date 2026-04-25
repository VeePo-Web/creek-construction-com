import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useSeason from "@/hooks/useSeason";
import TemperatureTicker from "@/components/TemperatureTicker";
import NavProgressBar from "@/components/NavProgressBar";
import cedarTexture from "@/assets/cedar-texture.jpg";

interface NavigationProps {
  transparent?: boolean;
  is404?: boolean;
}

const KNOWN_ROUTES = ["/", "/signature", "/custom", "/standard", "/resources", "/plan"];

// Steam Trail: section labels for narrative progress
const SECTION_LABELS: { id: string; label: string }[] = [
  { id: "section-hero", label: "" },
  { id: "section-truth", label: "THE RITUAL" },
  { id: "section-services", label: "THE BUILD" },
  { id: "about", label: "THE STANDARD" },
  { id: "section-testimonials", label: "THE PROOF" },
  { id: "work", label: "OUR CRAFT" },
  { id: "section-vignettes", label: "AFTER FIRST HEAT" },
  { id: "section-contact", label: "YOUR PLAN" },
];

// #12 Warm Return: page-specific welcome micro-copy
const PAGE_WELCOME_COPY: Record<string, string> = {
  "/signature": "Back to the original.",
  "/custom": "Designing something new?",
  "/standard": "You know the standard.",
  "/resources": "More to explore.",
  "/plan": "Ready when you are.",
};

// #14 Stone Count: scroll milestones
const STONE_MILESTONES = [0.25, 0.5, 0.75, 1.0];

// #20 Memory Lane: page name map for journey recap
const PAGE_NAMES: Record<string, string> = {
  "/signature": "Signature 8×8",
  "/custom": "Custom Builds",
  "/standard": "Our Standard",
  "/resources": "Resources",
  "/plan": "Your Plan",
  "/about": "About",
  "/blog": "Blog",
};

const Navigation = ({ transparent = false, is404: is404Prop = false }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionPositions, setSectionPositions] = useState<number[]>([]);
  const [hamburgerHovered, setHamburgerHovered] = useState(false);
  const [currentSectionLabel, setCurrentSectionLabel] = useState("");
  const [lastPage, setLastPage] = useState<string | null>(null);
  const [cedarTilt, setCedarTilt] = useState({ x: 0, y: 0 });

  // #6 The Breath
  const [isBreathing, setIsBreathing] = useState(false);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breathRevertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #7 The Threshold
  const heroThresholdCrossed = useRef(false);
  const [showThresholdPulse, setShowThresholdPulse] = useState(false);

  // #8 The Whisper
  const [ctaHovered, setCtaHovered] = useState(false);

  // #9 The Ember Trail
  const navRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseActive, setMouseActive] = useState(false);
  const rafRef = useRef<number | null>(null);

  // #11 The Season Shift
  const [seasonShifting, setSeasonShifting] = useState(false);
  const [seasonLabel, setSeasonLabel] = useState<string | null>(null);

  // #12 The Warm Return
  const [warmReturnMsg, setWarmReturnMsg] = useState<string | null>(null);
  const warmReturnShown = useRef(false);

  // #13 The Cedar Grain
  const [scrollDirection, setScrollDirection] = useState<"down" | "up" | "idle">("idle");
  const grainIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #14, #18, #19, #22, #25, #28, #29, #33, #34, #37, #38, #39, #40, #41 — moved to NavProgressBar

  // #15 The Loyly Exhale
  const [footerDwell, setFooterDwell] = useState(false);
  const footerDwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #16 The Kiuas Heartbeat
  const [pulseSpeed, setPulseSpeed] = useState(0);
  const scrollVelocityRef = useRef(0);
  const velocitySamples = useRef<number[]>([]);
  const pulseIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #18, #19 — moved to NavProgressBar

  // #20 The Memory Lane
  const [logoTooltip, setLogoTooltip] = useState<string | null>(null);
  const logoHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionPages = useRef<Set<string>>(new Set());

  // #21 The Resonance: active link ambient hum
  const [resonanceSuppressed, setResonanceSuppressed] = useState(false);

  // #22 — moved to NavProgressBar

  // #23 The Passing: link proximity warmth cascade
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null);

  // #24 The Cooling: page exit thermal shift
  const [isCooling, setIsCooling] = useState(false);
  const [isReheating, setIsReheating] = useState(false);
  const coolingNavigate = useRef<string | null>(null);

  // #25 — moved to NavProgressBar

  // #26 The Summons: CTA magnetic pull
  const ctaButtonRef = useRef<HTMLDivElement>(null);
  const [ctaMagneticOffset, setCtaMagneticOffset] = useState({ x: 0, y: 0 });

  // #27 The Patina: visit-count surface wear
  const [patinaLevel, setPatinaLevel] = useState(0);

  // #28, #29 — moved to NavProgressBar

  // #30 The Vapour: idle cursor steam wisps (ref-based DOM for zero re-renders)
  const navIdleCursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vapourSpawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vapourContainerRef = useRef<HTMLDivElement>(null);
  const lastNavMousePos = useRef({ x: 0, y: 0 });

  // #31 The Ember Memory: CTA warmth persistence
  const [ctaCooling, setCtaCooling] = useState(false);
  const ctaCoolingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #32 The Grain Shift: theme toggle cedar grain
  const [grainShiftActive, setGrainShiftActive] = useState(false);
  const grainShiftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #33, #34, #37, #38, #39, #40, #41 — moved to NavProgressBar

  // #35 The Hearthstone: 404 warm redirect
  const [is404, setIs404] = useState(false);
  const [hearthstoneLabel, setHearthstoneLabel] = useState("");
  const [hearthstoneProgress, setHearthstoneProgress] = useState(0);
  

  // #36 The Stave: keyboard navigation warmth trail
  const [focusTrail, setFocusTrail] = useState<Array<{ index: number; timestamp: number }>>([]);

  // #42 The Sisu: scroll endurance glow
  const [sisuGlow, setSisuGlow] = useState(false);
  const sisuCooldown = useRef(false);
  const scrollBurstStart = useRef<{ time: number; progress: number } | null>(null);

  // #45 The Rekka: rapid scroll ember particles (ref-based DOM for zero re-renders)
  const rekkaContainerRef = useRef<HTMLDivElement>(null);

  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const season = useSeason();
  const isHomepage = location.pathname === "/";
  const isReturning = typeof window !== "undefined" && localStorage.getItem("bp_visited") === "true";
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  // Track last page for return visit
  useEffect(() => {
    const stored = localStorage.getItem("bp_last_page");
    if (stored) setLastPage(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("bp_last_page", location.pathname);
  }, [location.pathname]);

  // #20 Memory Lane: track session pages
  useEffect(() => {
    sessionPages.current.add(location.pathname);
  }, [location.pathname]);

  // #11 The Season Shift: detect season change on mount
  useEffect(() => {
    const storedSeason = localStorage.getItem("bp_last_season");
    if (storedSeason && storedSeason !== season) {
      const label = `${season.charAt(0).toUpperCase() + season.slice(1)} mode.`;
      if (!prefersReducedMotion) {
        setSeasonShifting(true);
        setSeasonLabel(label);
        const shiftTimer = setTimeout(() => setSeasonShifting(false), 2000);
        const labelTimer = setTimeout(() => setSeasonLabel(null), 3000);
        localStorage.setItem("bp_last_season", season);
        return () => {
          clearTimeout(shiftTimer);
          clearTimeout(labelTimer);
        };
      } else {
        setSeasonLabel(label);
        const t = setTimeout(() => setSeasonLabel(null), 1500);
        localStorage.setItem("bp_last_season", season);
        return () => clearTimeout(t);
      }
    } else if (!storedSeason) {
      localStorage.setItem("bp_last_season", season);
    }
  }, [season, prefersReducedMotion]);

  // #12 The Warm Return: page-specific welcome flash
  useEffect(() => {
    if (warmReturnShown.current) return;
    if (!isReturning || isHomepage) return;
    const path = location.pathname;
    const pagesVisitedRaw = localStorage.getItem("bp_pages_visited");
    const pagesVisited: string[] = pagesVisitedRaw ? JSON.parse(pagesVisitedRaw) : [];
    if (pagesVisited.includes(path) && PAGE_WELCOME_COPY[path]) {
      warmReturnShown.current = true;
      setWarmReturnMsg(PAGE_WELCOME_COPY[path]);
      const t = setTimeout(() => setWarmReturnMsg(null), 2000);
      return () => clearTimeout(t);
    }
  }, [location.pathname, isReturning, isHomepage]);

  // #12: Track visited pages
  useEffect(() => {
    const path = location.pathname;
    const pagesVisitedRaw = localStorage.getItem("bp_pages_visited");
    const pagesVisited: string[] = pagesVisitedRaw ? JSON.parse(pagesVisitedRaw) : [];
    if (!pagesVisited.includes(path)) {
      pagesVisited.push(path);
      localStorage.setItem("bp_pages_visited", JSON.stringify(pagesVisited));
    }
  }, [location.pathname]);

  // #14, #22 resets — handled by NavProgressBar

  // #27 The Patina: read and increment visit count on mount
  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem("bp_visit_count") || "0", 10) + 1;
      localStorage.setItem("bp_visit_count", String(count));
      if (count >= 15) setPatinaLevel(3);
      else if (count >= 7) setPatinaLevel(2);
      else if (count >= 3) setPatinaLevel(1);
      else setPatinaLevel(0);
    } catch { /* ignore */ }
  }, []);

  // #28, #29 — handled by NavProgressBar

  // #32 The Grain Shift: detect theme changes via class mutation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          setGrainShiftActive(true);
          if (grainShiftTimer.current) clearTimeout(grainShiftTimer.current);
          grainShiftTimer.current = setTimeout(() => setGrainShiftActive(false), 400);
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      if (grainShiftTimer.current) clearTimeout(grainShiftTimer.current);
    };
  }, [prefersReducedMotion]);

  // #33 Undertow — handled by NavProgressBar

  // #35 The Hearthstone: 404 atmospheric labels (no auto-redirect — WCAG 2.2.1)
  useEffect(() => {
    if (!is404Prop) { setIs404(false); return; }
    setIs404(true);
    setHearthstoneProgress(50);
    setHearthstoneLabel("LOST IN THE STEAM.");

    const t1 = setTimeout(() => {
      setHearthstoneLabel("FINDING YOUR WAY BACK...");
    }, 3000);

    const t2 = setTimeout(() => {
      setHearthstoneProgress(0);
      setHearthstoneLabel("");
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [is404Prop]);

  // #35 Hearthstone: cancel on manual nav
  useEffect(() => {
    if (is404 && !is404Prop) {
      setHearthstoneLabel("");
      setHearthstoneProgress(0);
    }
  }, [location.pathname]);

  // #36 The Stave: cleanup trail entries older than 600ms
  useEffect(() => {
    if (focusTrail.length === 0 || prefersReducedMotion) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setFocusTrail(prev => prev.filter(entry => now - entry.timestamp < 600));
    }, 100);
    return () => clearInterval(interval);
  }, [focusTrail.length, prefersReducedMotion]);

  // #37, #38, #39, #40 — handled by NavProgressBar

  // #25 Gathering — handled by NavProgressBar

  // #24 The Cooling: reheat on route change completion
  useEffect(() => {
    if (isCooling) {
      setIsCooling(false);
      if (!prefersReducedMotion) {
        setIsReheating(true);
        const t = setTimeout(() => setIsReheating(false), 500);
        return () => clearTimeout(t);
      }
    }
  }, [location.pathname]);

  // Reset threshold on route change
  useEffect(() => {
    heroThresholdCrossed.current = false;
    setShowThresholdPulse(false);
  }, [location.pathname]);

  // #15 Loyly Exhale: footer dwell timer
  useEffect(() => {
    if (footerInView && isHomepage) {
      footerDwellTimer.current = setTimeout(() => {
        setFooterDwell(true);
      }, 5000);
    } else {
      if (footerDwellTimer.current) clearTimeout(footerDwellTimer.current);
      setFooterDwell(false);
    }
    return () => {
      if (footerDwellTimer.current) clearTimeout(footerDwellTimer.current);
    };
  }, [footerInView, isHomepage]);

  // #18 First Light — handled by NavProgressBar

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (currentY > 200 && currentY > lastScrollY.current && !footerInView) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      if (currentY < 80) setHidden(false);

      if (transparent) setScrolled(currentY > 80);

      const progress = docHeight > 0 ? Math.min(currentY / docHeight, 1) : 0;
      setScrollProgress(progress);

      // #13 Cedar Grain: scroll direction
      const direction = currentY > lastScrollY.current ? "down" : currentY < lastScrollY.current ? "up" : "idle";
      setScrollDirection(direction);
      if (grainIdleTimer.current) clearTimeout(grainIdleTimer.current);
      grainIdleTimer.current = setTimeout(() => setScrollDirection("idle"), 150);

      // #16 Kiuas Heartbeat: velocity → pulse speed
      const delta = Math.abs(currentY - lastScrollY.current);
      velocitySamples.current.push(delta);
      if (velocitySamples.current.length > 5) velocitySamples.current.shift();
      const avgVelocity = velocitySamples.current.reduce((a, b) => a + b, 0) / velocitySamples.current.length;
      scrollVelocityRef.current = avgVelocity;
      if (avgVelocity > 15) setPulseSpeed(3);
      else if (avgVelocity > 8) setPulseSpeed(2);
      else if (avgVelocity > 3) setPulseSpeed(1);
      else setPulseSpeed(0);
      if (pulseIdleTimer.current) clearTimeout(pulseIdleTimer.current);
      pulseIdleTimer.current = setTimeout(() => setPulseSpeed(0), 300);

      // #42 Sisu: scroll endurance glow
      if (!sisuCooldown.current && isHomepage && isDesktop && !prefersReducedMotion) {
        if (!scrollBurstStart.current) {
          scrollBurstStart.current = { time: Date.now(), progress };
        } else {
          const elapsed = Date.now() - scrollBurstStart.current.time;
          const traveled = Math.abs(progress - scrollBurstStart.current.progress);
          if (elapsed < 3000 && traveled > 0.3) {
            setSisuGlow(true);
            sisuCooldown.current = true;
            setTimeout(() => { setSisuGlow(false); sisuCooldown.current = false; }, 2000);
            scrollBurstStart.current = null;
          } else if (elapsed >= 3000) {
            scrollBurstStart.current = null;
          }
        }
      }

      // #45 Rekka: rapid scroll ember particles (ref-based DOM)
      if (isHomepage && isDesktop && !prefersReducedMotion && avgVelocity > 20 && rekkaContainerRef.current) {
        const el = document.createElement('div');
        el.className = 'rekka-ember';
        el.setAttribute('aria-hidden', 'true');
        el.style.left = `${progress * 100}%`;
        rekkaContainerRef.current.appendChild(el);
        setTimeout(() => el.remove(), 600);
      }

      lastScrollY.current = currentY;

      // #42 Sisu: reset burst on idle (handled via idle timer below)

      // #6 The Breath: reset on scroll, start idle timer
      if (!prefersReducedMotion && isHomepage) {
        setIsBreathing(false);
        if (breathRevertTimer.current) clearTimeout(breathRevertTimer.current);
        if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
        scrollIdleTimer.current = setTimeout(() => {
          setScrollProgress(prev => {
            const sp = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
            const footer = document.getElementById('site-footer');
            const footerVis = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
            if (sp > 0.1 && sp < 0.9 && !footerVis) {
              setIsBreathing(true);
              breathRevertTimer.current = setTimeout(() => setIsBreathing(false), 2000);
            }
            return prev;
          });
          // #42 Sisu: reset burst tracking on idle
          scrollBurstStart.current = null;
        }, 3000);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.getElementById('site-footer');
    let footerObserver: IntersectionObserver | undefined;
    if (footer) {
      footerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHidden(false);
            setFooterInView(true);
          } else {
            setFooterInView(false);
          }
        },
        { threshold: 0.1 }
      );
      footerObserver.observe(footer);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      footerObserver?.disconnect();
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
      if (breathRevertTimer.current) clearTimeout(breathRevertTimer.current);
      if (grainIdleTimer.current) clearTimeout(grainIdleTimer.current);
      if (pulseIdleTimer.current) clearTimeout(pulseIdleTimer.current);
    };
  }, [transparent, isHomepage, prefersReducedMotion, isDesktop]);

  // Calculate section positions for homepage progress dots
  const calculateSections = useCallback(() => {
    if (!isHomepage) return;
    const sectionIds = SECTION_LABELS.map(s => s.id);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const positions: number[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        positions.push(Math.min(top / docHeight, 1));
      }
    });
    setSectionPositions(positions);
  }, [isHomepage]);

  useEffect(() => {
    if (!isHomepage) {
      setSectionPositions([]);
      return;
    }
    const timer = setTimeout(calculateSections, 500);
    window.addEventListener("resize", calculateSections);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateSections);
    };
  }, [isHomepage, calculateSections]);

  // Steam Trail: derive current section label from scroll progress
  useEffect(() => {
    if (!isHomepage || sectionPositions.length === 0) {
      setCurrentSectionLabel("");
      return;
    }
    let labelIdx = 0;
    for (let i = sectionPositions.length - 1; i >= 0; i--) {
      if (scrollProgress >= sectionPositions[i]) {
        labelIdx = i;
        break;
      }
    }
    setCurrentSectionLabel(SECTION_LABELS[labelIdx]?.label || "");
  }, [scrollProgress, sectionPositions, isHomepage]);

  // #7 The Threshold: detect hero section crossing
  useEffect(() => {
    if (!isHomepage || sectionPositions.length < 2 || heroThresholdCrossed.current || prefersReducedMotion) return;
    const heroBottom = sectionPositions[1];
    if (scrollProgress >= heroBottom && heroBottom > 0) {
      heroThresholdCrossed.current = true;
      setShowThresholdPulse(true);
      setTimeout(() => setShowThresholdPulse(false), 500);
    }
  }, [scrollProgress, sectionPositions, isHomepage, prefersReducedMotion]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Cedar Curtain: device orientation for parallax
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = Math.max(-5, Math.min(5, (e.gamma || 0) * 0.15));
      const y = Math.max(-5, Math.min(5, (e.beta || 0) * 0.1));
      setCedarTilt({ x, y });
    };
    try {
      if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } catch { /* no gyroscope */ }
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      setCedarTilt({ x: 0, y: 0 });
    };
  }, [isMenuOpen]);

  // #30 Vapour: clear timers helper
  const clearVapourTimers = useCallback(() => {
    if (navIdleCursorTimer.current) { clearTimeout(navIdleCursorTimer.current); navIdleCursorTimer.current = null; }
    if (vapourSpawnTimer.current) { clearTimeout(vapourSpawnTimer.current); vapourSpawnTimer.current = null; }
  }, []);

  // #9 The Ember Trail: mouse tracking on nav + #26 Summons + #30 Vapour
  const handleNavMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        setMousePos({ x, y });
        setMouseActive(true);
        lastNavMousePos.current = { x, y };

        // #26 Summons: magnetic pull on CTA
        if (ctaButtonRef.current) {
          const ctaRect = ctaButtonRef.current.getBoundingClientRect();
          const ctaCx = ctaRect.left + ctaRect.width / 2;
          const ctaCy = ctaRect.top + ctaRect.height / 2;
          const dx = clientX - ctaCx;
          const dy = clientY - ctaCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60 && dist > 0) {
            const pull = Math.min(2, (60 - dist) / 30);
            setCtaMagneticOffset({ x: (dx / dist) * pull, y: (dy / dist) * pull });
          } else {
            setCtaMagneticOffset(prev => (prev.x !== 0 || prev.y !== 0) ? { x: 0, y: 0 } : prev);
          }
        }
      }
    });

    // #30 Vapour: reset idle timer + clear existing particles (ref-based DOM)
    clearVapourTimers();
    if (vapourContainerRef.current) vapourContainerRef.current.innerHTML = '';
    navIdleCursorTimer.current = setTimeout(() => {
      // Spawn vapour wisps (max 3) -- only on homepage, desktop, non-footer, non-transparent
      const spawnWisp = (count: number) => {
        if (count >= 3 || !vapourContainerRef.current) return;
        const pos = lastNavMousePos.current;
        const offsetX = (Math.random() - 0.5) * 6;
        const el = document.createElement('div');
        el.className = 'vapour-wisp';
        el.setAttribute('aria-hidden', 'true');
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
        el.style.transform = `translateX(${offsetX}px)`;
        vapourContainerRef.current.appendChild(el);
        setTimeout(() => el.remove(), 2000);
        vapourSpawnTimer.current = setTimeout(() => spawnWisp(count + 1), 600);
      };
      spawnWisp(0);
    }, 4000);
  }, [prefersReducedMotion, clearVapourTimers]);

  const handleNavMouseLeave = useCallback(() => {
    setMouseActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // #26 Summons: reset magnetic offset
    setCtaMagneticOffset({ x: 0, y: 0 });
    // #30 Vapour: clear on leave
    clearVapourTimers();
    if (vapourContainerRef.current) vapourContainerRef.current.innerHTML = '';
  }, [clearVapourTimers]);

  // #20 Memory Lane: logo hover handlers
  const handleLogoMouseEnter = useCallback(() => {
    if (!isDesktop || prefersReducedMotion || isFooterMode || isMenuOpen) return;
    logoHoverTimer.current = setTimeout(() => {
      // Compute journey message
      const pages = sessionPages.current;
      const subpages = [...pages].filter(p => p !== "/");
      let msg: string;
      if (footerInView) {
        msg = "The full journey.";
      } else if (subpages.length === 0) {
        msg = "Exploring the ritual.";
      } else if (subpages.length === 1) {
        const name = PAGE_NAMES[subpages[0]] || subpages[0].slice(1);
        msg = `You've seen ${name}.`;
      } else {
        msg = `You've explored ${subpages.length} sections.`;
      }
      setLogoTooltip(msg);
    }, 1500);
  }, [isDesktop, prefersReducedMotion, isMenuOpen, footerInView]);

  const handleLogoMouseLeave = useCallback(() => {
    if (logoHoverTimer.current) clearTimeout(logoHoverTimer.current);
    if (logoTooltip) {
      logoFadeTimer.current = setTimeout(() => setLogoTooltip(null), 300);
    }
  }, [logoTooltip]);

  const isFooterMode = footerInView && !transparent && !isMenuOpen;
  const isTransparent = transparent && !scrolled;

  // Ritual Timer: engagement-based states (homepage only)
  const deepEngagement = isHomepage && scrollProgress > 0.6;
  const warmPhase = isHomepage && scrollProgress > 0.5;
  const ctaLabel = deepEngagement ? "START YOUR RITUAL" : "GET MY SAUNA PLAN";

  // #8 The Whisper: contextual micro-copy
  const getWhisperText = () => {
    if (isReturning) return "Welcome back. Let's finalize.";
    if (isFooterMode) return "One call. Your ritual starts.";
    if (deepEngagement) return "You've seen the work. Let's talk.";
    return "Free consultation. No commitment.";
  };

  // #9 Ember Trail: radial gradient style
  const emberStyle = (!isTransparent && !isFooterMode && mouseActive && !prefersReducedMotion)
    ? {
        background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, hsl(28 50% 52% / 0.08) 0%, transparent 60%)`,
        transition: "opacity 0.4s ease",
        opacity: 1,
      }
    : {
        background: "none",
        transition: "opacity 0.4s ease",
        opacity: 0,
      };

  // #17 The Heat Map: progressive gradient on progress bar
  const getHeatMapGradient = () => {
    if (!isHomepage) return undefined;
    // Base cedar: hsl(28, 50%, 52%)
    // Shifts: hero=base, services=+5deg warmer, testimonials=-5deg deeper+sat, contact=warmest+glow
    return `linear-gradient(to right, hsl(28 50% 52%) 0%, hsl(33 55% 54%) 30%, hsl(23 60% 48%) 65%, hsl(28 55% 55%) 100%)`;
  };

  const navLinks = [
    { to: "/signature", label: "SIGNATURE 8×8" },
    { to: "/custom", label: "CUSTOM BUILDS" },
    { to: "/standard", label: "OUR STANDARD" },
    { to: "/resources", label: "RESOURCES" },
  ];

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 350);
  };

  const handleToggleMenu = () => {
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      setIsMenuOpen(true);
    }
  };

  const menuVisible = isMenuOpen && !isClosing;

  return (
    <>
      <nav
        ref={navRef}
        data-season={season}
        onMouseMove={handleNavMouseMove}
        onMouseLeave={handleNavMouseLeave}
      style={{ contain: 'layout style' }}
      className={`fixed top-0 left-0 right-0 z-50 min-h-[60px] will-change-transform transition-all ${
          isBreathing && !prefersReducedMotion ? "duration-[2000ms]" : "duration-700"
        } ${
          seasonShifting ? "nav-season-shifting" : ""
        } ${
          hidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
        } ${
          isCooling && !prefersReducedMotion ? "nav-cooling" : ""
        } ${
          isReheating && !prefersReducedMotion ? "nav-reheating" : ""
        } ${
          isFooterMode
            ? "bg-primary border-b border-cedar/20"
            : isTransparent
              ? "bg-transparent border-b border-transparent"
              : "bg-background/80 backdrop-blur-md border-b border-border"
        }`}
      >
        {/* #15 Loyly Exhale: warm overlay */}
        {footerDwell && !prefersReducedMotion && (
          <div
            className="loyly-exhale absolute inset-0 pointer-events-none z-0"
            aria-hidden="true"
          />
        )}

        {/* #9 Ember Trail: radial glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 hidden lg:block"
          style={emberStyle}
          aria-hidden="true"
        />

        <div className={`container mx-auto px-6 flex items-center justify-between relative z-10 transition-all ${
          isBreathing && !prefersReducedMotion ? "py-5 duration-[2000ms]" : "py-4 duration-700"
        }`}>
          {/* Logo with #20 Memory Lane tooltip */}
          <div className="relative">
            <Link
              to="/"
              className={`text-minimal tracking-[0.2em] transition-all duration-300 hover:tracking-[0.3em] opacity-0 animate-[reveal_1.2s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards] ${
                isFooterMode
                  ? "text-primary-foreground"
                  : isTransparent ? "text-white" : "text-foreground"
              }`}
              onMouseEnter={handleLogoMouseEnter}
              onMouseLeave={handleLogoMouseLeave}
              style={{
                // #44 The Tethered Glow: logo warms with scroll depth
                ...(isHomepage && isDesktop && !prefersReducedMotion && scrollProgress > 0.05
                  ? { textShadow: `0 0 ${4 + scrollProgress * 8}px hsl(28 50% 52% / ${(scrollProgress * 0.12).toFixed(3)})` }
                  : {}),
              }}
            >
              B&P SAUNA
            </Link>
            {/* #20 Memory Lane: journey tooltip */}
            {logoTooltip && !prefersReducedMotion && (
              <span
                className="absolute top-full left-0 mt-1 text-[9px] tracking-[0.12em] uppercase whitespace-nowrap pointer-events-none hidden lg:block transition-opacity duration-200"
                style={{
                  color: isFooterMode ? "hsl(var(--primary-foreground) / 0.5)" : "hsl(var(--cedar) / 0.6)",
                  opacity: 1,
                }}
                aria-hidden="true"
              >
                {logoTooltip}
              </span>
            )}
          </div>

          {/* Desktop links with underline + cedar warmth hover + #21 Resonance + #23 Passing */}
          <div className={`hidden lg:flex items-center space-x-12 min-w-0 ${resonanceSuppressed ? "resonance-suppressed" : ""}`}>
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.to;
              // #23 The Passing: proximity opacity
              let proximityOpacity: number | undefined;
              if (hoveredLinkIndex !== null && !isFooterMode && !isTransparent && !prefersReducedMotion) {
                const dist = Math.abs(index - hoveredLinkIndex);
                if (dist === 0) proximityOpacity = 1;
                else if (dist === 1) proximityOpacity = 0.85;
                else if (dist === 2) proximityOpacity = 0.7;
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-minimal nav-link-underline transition-all duration-300 ${
                    isTransparent ? "nav-transparent" : ""
                  } ${isActive ? "active" : ""} ${
                    isActive && !prefersReducedMotion ? "nav-link-resonance" : ""
                  } ${
                    // #36 The Stave: keyboard warmth trail
                    focusTrail.some(t => t.index === index) ? "nav-stave" : ""
                  } ${
                    isFooterMode
                      ? isActive ? "text-primary-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
                      : isTransparent
                        ? isActive ? "text-white" : "text-white/70 hover:text-white"
                        : isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    ...(proximityOpacity !== undefined ? { opacity: proximityOpacity, transition: "opacity 0.2s ease, letter-spacing 0.3s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.3s ease" } : {}),
                  }}
                  onMouseEnter={() => {
                    setHoveredLinkIndex(index);
                    if (!isActive) setResonanceSuppressed(true);
                  }}
                  onMouseLeave={() => {
                    setHoveredLinkIndex(null);
                    setResonanceSuppressed(false);
                  }}
                  onFocus={() => {
                    // #36 The Stave: remove this index from trail on focus (it's now active)
                    setFocusTrail(prev => prev.filter(t => t.index !== index));
                  }}
                  onBlur={() => {
                    // #36 The Stave: add to trail on blur
                    if (!prefersReducedMotion && isDesktop) {
                      setFocusTrail(prev => {
                        const next = [...prev.filter(t => t.index !== index), { index, timestamp: Date.now() }];
                        return next.slice(-2); // max 2 entries
                      });
                    }
                  }}
                  onClick={(e) => {
                    // #24 The Cooling: delay navigation for thermal shift
                    if (!prefersReducedMotion && !isActive) {
                      e.preventDefault();
                      setIsCooling(true);
                      coolingNavigate.current = link.to;
                      setTimeout(() => {
                        if (coolingNavigate.current) {
                          navigate(coolingNavigate.current);
                        }
                      }, 150);
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* CTA with Ritual Timer crossfade + #8 The Whisper + #26 The Summons + #31 Ember Memory */}
            <div
              ref={ctaButtonRef}
              className="relative ml-4"
              onMouseEnter={() => {
                setCtaHovered(true);
                // #31 Ember Memory: cancel cooling on re-hover
                if (ctaCoolingTimer.current) { clearTimeout(ctaCoolingTimer.current); ctaCoolingTimer.current = null; }
                setCtaCooling(false);
              }}
              onMouseLeave={() => {
                setCtaHovered(false);
                // #31 Ember Memory: start cooling afterglow
                if (!prefersReducedMotion && isDesktop) {
                  setCtaCooling(true);
                  ctaCoolingTimer.current = setTimeout(() => setCtaCooling(false), 1500);
                }
              }}
              style={{
                transform: (isHomepage && scrollProgress > 0.8 && isDesktop && !prefersReducedMotion && (ctaMagneticOffset.x !== 0 || ctaMagneticOffset.y !== 0))
                  ? `translate(${ctaMagneticOffset.x}px, ${ctaMagneticOffset.y}px)`
                  : undefined,
                transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <Link
                to="/plan"
                className={`text-minimal bg-cedar text-cedar-foreground px-5 py-2.5 rounded-sm border hover:border-cedar/30 hover:tracking-[0.2em] hover:shadow-[inset_0_0_20px_rgba(184,126,69,0.15)] transition-all duration-300 ${
                  isTransparent ? "border-cedar-foreground/20" : "border-transparent"
                } ${location.pathname === "/plan" ? "ring-1 ring-cedar-foreground/30" : ""
                } ${ctaCooling ? "cta-ember-cooling" : ""}`}
              >
                <span className="transition-opacity duration-300">{ctaLabel}</span>
              </Link>
              {/* The Whisper: contextual micro-copy */}
              <span
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[9px] tracking-[0.1em] transition-opacity duration-200 pointer-events-none hidden lg:block ${
                  isFooterMode ? "text-primary-foreground/40" : "text-cedar/60"
                }`}
                style={{ opacity: ctaHovered ? 1 : 0 }}
                aria-hidden="true"
              >
                {getWhisperText()}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
            {/* #11 Season Shift: micro-label near ticker */}
            {seasonLabel && (
              <span
                className="text-[9px] tracking-[0.15em] uppercase text-cedar transition-opacity duration-700"
                style={{ opacity: seasonLabel ? 1 : 0 }}
                aria-hidden="true"
              >
                {seasonLabel}
              </span>
            )}
            <TemperatureTicker footerMode={isFooterMode} />
            
          </div>

          {/* Hamburger morph button — branded asymmetric */}
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden relative ${(isTransparent || isFooterMode) && !isMenuOpen ? "text-white hover:bg-white/10" : ""} ${isFooterMode && !isMenuOpen ? "text-primary-foreground hover:bg-primary-foreground/10" : ""}`}
            onClick={handleToggleMenu}
            onMouseEnter={() => setHamburgerHovered(true)}
            onMouseLeave={() => setHamburgerHovered(false)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="flex flex-col items-end justify-center w-5 h-5 gap-[5px]">
              <span
                className={`block h-px bg-current transition-all duration-300 origin-center ${
                  isMenuOpen ? "w-5 rotate-45 translate-y-[6px]" : "w-5"
                }`}
              />
              <span
                className={`block h-px transition-all duration-300 ${
                  isMenuOpen 
                    ? "w-5 opacity-0 scale-x-0 bg-current" 
                    : `${hamburgerHovered ? "w-5" : "w-3.5"} ${
                        isTransparent || isFooterMode ? "bg-current" : "bg-cedar"
                      }`
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 origin-center ${
                  isMenuOpen ? "w-5 -rotate-45 -translate-y-[6px]" : "w-5"
                }`}
              />
            </div>
          </Button>
        </div>

        <NavProgressBar
          scrollProgress={scrollProgress}
          scrollDirection={scrollDirection}
          sectionPositions={sectionPositions}
          isHomepage={isHomepage}
          isDesktop={isDesktop}
          prefersReducedMotion={prefersReducedMotion}
          isFooterMode={isFooterMode}
          isTransparent={isTransparent}
          is404={is404}
          hearthstoneProgress={hearthstoneProgress}
          hearthstoneLabel={hearthstoneLabel}
          patinaLevel={patinaLevel}
          pulseSpeed={pulseSpeed}
          warmPhase={warmPhase}
          warmReturnMsg={warmReturnMsg}
          currentSectionLabel={currentSectionLabel}
          grainShiftActive={grainShiftActive}
          showThresholdPulse={showThresholdPulse}
          footerDwell={footerDwell}
          sisuGlow={sisuGlow}
          vapourContainerRef={vapourContainerRef}
          rekkaContainerRef={rekkaContainerRef}
        />
      </nav>

      {/* Mobile: Cinematic full-screen overlay with Cedar Curtain + #43 Kiuas Door */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } ${isMenuOpen && !isClosing ? "kiuas-door-open" : ""} ${isClosing ? "kiuas-door-closing" : ""}`}
        style={{
          background: isMenuOpen
            ? "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 85%, hsl(var(--cedar) / 0.08) 100%)"
            : undefined,
          overscrollBehavior: 'contain',
          overflowY: 'auto',
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Cedar Curtain: background texture layer */}
        <div
          className="cedar-curtain-bg"
          style={{
            backgroundImage: `url(${cedarTexture})`,
            transform: `scale(1.1) translate(${cedarTilt.x}px, ${cedarTilt.y}px)`,
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col items-start justify-center min-h-screen pl-12 pr-8 relative z-10">
          {/* Spacer for nav bar clearance */}
          <div className="h-16" />

          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.to;
            const numberPrefix = String(i + 1).padStart(2, "0");
            const enterDelay = (i + 1) * 0.12;
            const exitDelay = (navLinks.length - i) * 0.06;
            const isLastVisited = isReturning && lastPage === link.to;

            return (
              <div
                key={link.to}
                className="py-3"
                style={{
                  opacity: menuVisible ? 1 : 0,
                  transform: menuVisible ? "translateX(0)" : "translateX(-20px)",
                  transition: isClosing
                    ? `opacity 0.3s ease ${exitDelay}s, transform 0.3s ease ${exitDelay}s`
                    : `opacity 0.5s ease ${enterDelay}s, transform 0.5s ease ${enterDelay}s`,
                }}
              >
                <Link
                  to={link.to}
                  className={`flex items-baseline gap-4 group transition-colors duration-300 min-h-[44px] ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleCloseMenu}
                >
                  <span className="text-minimal text-cedar">{numberPrefix}</span>
                  <span className="text-2xl text-architectural tracking-wide">
                    {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                  </span>
                </Link>
                {/* Active page cedar indicator */}
                {isActive && (
                  <div className="w-8 h-px bg-cedar mt-2 ml-10" />
                )}
                {/* Return Visit: last visited label */}
                {isLastVisited && !isActive && (
                  <span className="text-[10px] text-muted-foreground/40 ml-10 mt-1 block tracking-[0.1em] uppercase">
                    Last visited
                  </span>
                )}
              </div>
            );
          })}

          {/* Divider */}
          <div
            className="divider-line my-6"
            style={{
              opacity: menuVisible ? 1 : 0,
              transition: isClosing
                ? `opacity 0.2s ease 0.02s`
                : `opacity 0.4s ease ${(navLinks.length + 1) * 0.12}s`,
            }}
          />

          {/* CTA with Ritual Timer */}
          <Link
            to="/plan"
            className="text-minimal bg-cedar text-cedar-foreground px-8 py-4 rounded-sm hover:bg-cedar-hover transition-all duration-300 min-h-[44px] flex items-center"
            style={{
              opacity: menuVisible ? 1 : 0,
              transform: menuVisible ? "translateX(0)" : "translateX(-20px)",
              transition: isClosing
                ? `opacity 0.3s ease 0s, transform 0.3s ease 0s`
                : `opacity 0.5s ease ${(navLinks.length + 2) * 0.12}s, transform 0.5s ease ${(navLinks.length + 2) * 0.12}s`,
            }}
            onClick={handleCloseMenu}
          >
            {ctaLabel}
          </Link>

          {/* Theme toggle + Temperature ticker for mobile */}
          <div
            className="flex items-center gap-6 mt-8"
            style={{
              opacity: menuVisible ? 1 : 0,
              transition: isClosing
                ? `opacity 0.2s ease 0s`
                : `opacity 0.4s ease ${(navLinks.length + 3) * 0.12}s`,
            }}
          >
            <TemperatureTicker className="flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 cursor-default relative" />
          </div>

          {/* Brand tagline at bottom — Cedar Curtain foreground layer */}
          <p
            className="text-minimal text-base text-muted-foreground/50 mt-auto pb-12 pt-8"
            style={{
              opacity: menuVisible ? 1 : 0,
              transform: menuVisible ? "translateY(-10px)" : "translateY(0)",
              transition: isClosing
                ? `opacity 0.2s ease 0s`
                : `opacity 0.6s ease ${(navLinks.length + 4) * 0.12}s, transform 0.6s ease ${(navLinks.length + 4) * 0.12}s`,
            }}
          >
            Outdoor-only. Traditional heat.
            {/* #10 Deep Link hint */}
            <span className="block text-[9px] text-muted-foreground/30 mt-2 tracking-[0.15em]">
              Press / to quick-navigate
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Navigation;
