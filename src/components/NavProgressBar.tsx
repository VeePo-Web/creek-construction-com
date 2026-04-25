import { memo, useEffect, useRef, useState } from "react";

// Section labels for narrative progress
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

const STONE_MILESTONES = [0.25, 0.5, 0.75, 1.0];

interface NavProgressBarProps {
  scrollProgress: number;
  scrollDirection: "down" | "up" | "idle";
  sectionPositions: number[];
  isHomepage: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  isFooterMode: boolean;
  isTransparent: boolean;
  is404: boolean;
  hearthstoneProgress: number;
  hearthstoneLabel: string;
  patinaLevel: number;
  pulseSpeed: number;
  warmPhase: boolean;
  warmReturnMsg: string | null;
  currentSectionLabel: string;
  grainShiftActive: boolean;
  showThresholdPulse: boolean;
  footerDwell: boolean;
  sisuGlow: boolean;
  vapourContainerRef: React.RefObject<HTMLDivElement>;
  rekkaContainerRef: React.RefObject<HTMLDivElement>;
}

const getHeatMapGradient = () =>
  `linear-gradient(to right, hsl(28 50% 52%) 0%, hsl(33 55% 54%) 30%, hsl(23 60% 48%) 65%, hsl(28 55% 55%) 100%)`;

const NavProgressBar = memo(({
  scrollProgress,
  scrollDirection,
  sectionPositions,
  isHomepage,
  isDesktop,
  prefersReducedMotion,
  isFooterMode,
  isTransparent,
  is404,
  hearthstoneProgress,
  hearthstoneLabel,
  patinaLevel,
  pulseSpeed,
  warmPhase,
  warmReturnMsg,
  currentSectionLabel,
  grainShiftActive,
  showThresholdPulse,
  footerDwell,
  sisuGlow,
  vapourContainerRef,
  rekkaContainerRef,
}: NavProgressBarProps) => {
  // #14 Stone Count
  const [collectedStones, setCollectedStones] = useState<Set<number>>(new Set());
  const [stonesComplete, setStonesComplete] = useState(false);

  // #18 First Light
  const [showFirstLight, setShowFirstLight] = useState(false);

  // #19 Smoke Signal
  const [smokeGhost, setSmokeGhost] = useState<number | null>(null);
  const wasScrolledRef = useRef(false);
  const lastProgressRef = useRef(0);

  // #22 Tideline
  const highWaterMark = useRef(0);
  const [highWaterMarkDisplay, setHighWaterMarkDisplay] = useState(0);

  // #25 Gathering
  const [avgDepth, setAvgDepth] = useState<number | null>(null);

  // #28 Communion
  const [passedDots, setPassedDots] = useState<Set<number>>(new Set());
  const [communionFlash, setCommunionFlash] = useState(false);

  // #29 Inscription
  const [inscriptionEarned, setInscriptionEarned] = useState(() => {
    try { return localStorage.getItem("bp_inscription_earned") === "true"; } catch { return false; }
  });
  const [inscriptionVisible, setInscriptionVisible] = useState(false);

  // #33 Undertow
  const [echoWidth, setEchoWidth] = useState(0);
  const [showEcho, setShowEcho] = useState(false);
  const echoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peakProgress = useRef(0);

  // #34 Anchor
  const [hoveredDotIndex, setHoveredDotIndex] = useState<number | null>(null);

  // #37 Kondenssi
  const condensationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [condensationDroplets, setCondensationDroplets] = useState<Array<{ x: number; id: number }>>([]);
  const condensationIdRef = useRef(0);

  // #38 Threshold Bell
  const [bellFlashIndex, setBellFlashIndex] = useState<number | null>(null);
  const prevSectionIndexRef = useRef<number>(0);

  // #39 Muisti
  const [muistiStars, setMuistiStars] = useState<Array<{ pos: number; size: number; opacity: number }>>([]);

  // #40 Löyly Count
  const [loylyCount, setLoylyCount] = useState(0);
  const loylyCountedThisSession = useRef(false);

  // #41 Kindling
  const [kindlingSpark, setKindlingSpark] = useState(false);
  const kindlingFired = useRef(false);

  // --- Effects ---

  // Reset on route change
  useEffect(() => {
    setCollectedStones(new Set());
    setStonesComplete(false);
    highWaterMark.current = 0;
    setHighWaterMarkDisplay(0);
    setPassedDots(new Set());
    setCommunionFlash(false);
    peakProgress.current = 0;
    setShowEcho(false);
    setEchoWidth(0);
    loylyCountedThisSession.current = false;
  }, [isHomepage]);

  // #18 First Light
  useEffect(() => {
    if (prefersReducedMotion) return;
    const hasPlayed = localStorage.getItem("bp_first_light");
    if (!hasPlayed) {
      setShowFirstLight(true);
      const t = setTimeout(() => { setShowFirstLight(false); localStorage.setItem("bp_first_light", "true"); }, 2000);
      return () => clearTimeout(t);
    }
  }, [prefersReducedMotion]);

  // #22 Tideline
  useEffect(() => {
    if (isHomepage && scrollProgress > highWaterMark.current) {
      highWaterMark.current = scrollProgress;
      setHighWaterMarkDisplay(scrollProgress);
    }
  }, [scrollProgress, isHomepage]);

  // #14 Stone Count
  useEffect(() => {
    if (!isHomepage || prefersReducedMotion) return;
    setCollectedStones(prev => {
      let changed = false;
      const next = new Set(prev);
      for (const m of STONE_MILESTONES) {
        if (scrollProgress >= m && !prev.has(m)) { next.add(m); changed = true; }
      }
      if (changed && next.size === 4 && prev.size < 4) {
        setStonesComplete(true);
        setTimeout(() => setStonesComplete(false), 500);
      }
      return changed ? next : prev;
    });
  }, [scrollProgress, isHomepage, prefersReducedMotion]);

  // #19 Smoke Signal
  useEffect(() => {
    if (!isHomepage || prefersReducedMotion) return;
    if (scrollProgress > 0.2) wasScrolledRef.current = true;
    if (scrollProgress === 0 && wasScrolledRef.current && lastProgressRef.current > 0) {
      setSmokeGhost(lastProgressRef.current);
      wasScrolledRef.current = false;
      setTimeout(() => setSmokeGhost(null), 300);
    }
    lastProgressRef.current = scrollProgress;
  }, [scrollProgress, isHomepage, prefersReducedMotion]);

  // #25 Gathering
  useEffect(() => {
    if (!isHomepage) { setAvgDepth(null); return; }
    try {
      const raw = localStorage.getItem("bp_depth_history");
      const history: number[] = raw ? JSON.parse(raw) : [];
      if (history.length >= 3) setAvgDepth(history.reduce((a, b) => a + b, 0) / history.length);
    } catch { /* ignore */ }
    return () => {
      if (highWaterMark.current > 0) {
        try {
          const raw = localStorage.getItem("bp_depth_history");
          const history: number[] = raw ? JSON.parse(raw) : [];
          history.push(highWaterMark.current);
          if (history.length > 10) history.shift();
          localStorage.setItem("bp_depth_history", JSON.stringify(history));
        } catch { /* ignore */ }
      }
    };
  }, [isHomepage]);

  // #28 Communion
  useEffect(() => {
    if (!isHomepage || prefersReducedMotion || sectionPositions.length === 0) return;
    setPassedDots(prev => {
      const next = new Set(prev);
      let changed = false;
      sectionPositions.forEach((pos, i) => {
        if (scrollProgress >= pos && !prev.has(i)) { next.add(i); changed = true; }
      });
      if (changed && next.size === sectionPositions.length && prev.size < sectionPositions.length) {
        setCommunionFlash(true);
        setTimeout(() => setCommunionFlash(false), 600);
      }
      return changed ? next : prev;
    });
  }, [scrollProgress, sectionPositions, isHomepage, prefersReducedMotion]);

  // #29 Inscription
  useEffect(() => { if (inscriptionEarned) setInscriptionVisible(true); }, [inscriptionEarned]);
  useEffect(() => {
    if (isHomepage && scrollProgress >= 0.99 && !inscriptionEarned) {
      setInscriptionEarned(true);
      setInscriptionVisible(true);
      try { localStorage.setItem("bp_inscription_earned", "true"); } catch { /* ignore */ }
    }
  }, [scrollProgress, isHomepage, inscriptionEarned]);

  // #33 Undertow
  useEffect(() => {
    if (!isHomepage || prefersReducedMotion || !isDesktop) return;
    if (scrollProgress > peakProgress.current) peakProgress.current = scrollProgress;
    if (scrollDirection === "up" && scrollProgress < peakProgress.current) {
      setEchoWidth(Math.min(scrollProgress + 0.05, peakProgress.current));
      setShowEcho(true);
      if (echoTimer.current) clearTimeout(echoTimer.current);
      echoTimer.current = setTimeout(() => setShowEcho(false), 200);
    }
  }, [scrollProgress, scrollDirection, isHomepage, prefersReducedMotion, isDesktop]);

  // #38 Threshold Bell
  useEffect(() => {
    if (!isHomepage || prefersReducedMotion || !isDesktop || sectionPositions.length === 0) return;
    let currentIdx = 0;
    for (let i = sectionPositions.length - 1; i >= 0; i--) {
      if (scrollProgress >= sectionPositions[i]) { currentIdx = i; break; }
    }
    if (currentIdx !== prevSectionIndexRef.current) {
      setBellFlashIndex(currentIdx);
      setTimeout(() => setBellFlashIndex(null), 300);
      prevSectionIndexRef.current = currentIdx;
    }
  }, [scrollProgress, sectionPositions, isHomepage, prefersReducedMotion, isDesktop]);

  // #39 Muisti
  useEffect(() => {
    if (!isHomepage || !isDesktop || prefersReducedMotion) return;
    try {
      const visitCount = parseInt(localStorage.getItem("bp_visit_count") || "0", 10);
      const raw = localStorage.getItem("bp_depth_history");
      const history: number[] = raw ? JSON.parse(raw) : [];
      if (visitCount >= 5 && history.length >= 3) {
        const avg = history.reduce((a, b) => a + b, 0) / history.length;
        setMuistiStars([
          { pos: avg, size: 1.5, opacity: 0.03 },
          { pos: Math.min(...history), size: 1, opacity: 0.02 },
          { pos: Math.max(...history), size: 1, opacity: 0.02 },
        ]);
      }
    } catch { /* ignore */ }
  }, [isHomepage, isDesktop, prefersReducedMotion]);

  // #40 Löyly Count
  useEffect(() => {
    try { setLoylyCount(parseInt(localStorage.getItem("bp_loyly_count") || "0", 10)); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (isHomepage && scrollProgress >= 0.99 && !loylyCountedThisSession.current) {
      loylyCountedThisSession.current = true;
      const newCount = loylyCount + 1;
      setLoylyCount(newCount);
      try { localStorage.setItem("bp_loyly_count", String(newCount)); } catch { /* ignore */ }
    }
  }, [scrollProgress, isHomepage, loylyCount]);

  // #37 Kondenssi
  useEffect(() => {
    if (!isHomepage || !isDesktop || prefersReducedMotion) return;
    const onScroll = () => {
      setCondensationDroplets([]);
      if (condensationTimer.current) clearTimeout(condensationTimer.current);
      condensationTimer.current = setTimeout(() => {
        const p = scrollProgress;
        if (p > 0.2 && p < 0.8) {
          const drops = [
            { x: Math.random() * p * 100, id: condensationIdRef.current++ },
            { x: Math.random() * p * 100, id: condensationIdRef.current++ },
          ];
          setCondensationDroplets(drops);
          setTimeout(() => setCondensationDroplets([]), 2500);
        }
      }, 5000);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (condensationTimer.current) clearTimeout(condensationTimer.current); };
  }, [isHomepage, isDesktop, prefersReducedMotion, scrollProgress]);

  // #41 Kindling
  useEffect(() => {
    if (kindlingFired.current || prefersReducedMotion || !isHomepage || !isDesktop) return;
    if (scrollProgress > 0) {
      try {
        if (!localStorage.getItem("bp_first_scroll_seen")) {
          kindlingFired.current = true;
          localStorage.setItem("bp_first_scroll_seen", "true");
          setKindlingSpark(true);
          setTimeout(() => setKindlingSpark(false), 400);
        } else {
          kindlingFired.current = true;
        }
      } catch { kindlingFired.current = true; }
    }
  }, [scrollProgress, isHomepage, isDesktop, prefersReducedMotion]);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-px nav-grain-container ${scrollDirection !== "idle" ? "nav-grain-active" : ""} ${grainShiftActive ? "nav-grain-shift" : ""}`}
      data-scroll-dir={scrollDirection}
      data-patina={patinaLevel}
    >
      {/* Section dots with #28 Communion + #34 Anchor */}
      {isHomepage && sectionPositions.map((pos, i) => (
        <div
          key={i}
          className={`nav-section-dot ${passedDots.has(i) ? "dot-heated" : ""} ${communionFlash ? "dot-communion" : ""} ${isDesktop ? "cursor-pointer" : ""}`}
          aria-hidden="true"
          style={{
            left: `${pos * 100}%`,
            opacity: scrollProgress >= pos ? 1 : 0.3,
            transition: "opacity 0.3s ease, transform 0.15s ease",
            animationDelay: communionFlash ? `${i * 50}ms` : undefined,
            transform: hoveredDotIndex === i && isDesktop ? "scale(1.5)" : undefined,
            zIndex: hoveredDotIndex === i ? 10 : undefined,
          }}
          onMouseEnter={() => { if (isDesktop) setHoveredDotIndex(i); }}
          onMouseLeave={() => setHoveredDotIndex(null)}
          onClick={() => {
            if (!isDesktop) return;
            const sectionId = SECTION_LABELS[i]?.id;
            if (sectionId) {
              const el = document.getElementById(sectionId);
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }
          }}
        >
          {hoveredDotIndex === i && isDesktop && SECTION_LABELS[i]?.label && (
            <span className="nav-dot-tooltip" aria-hidden="true">{SECTION_LABELS[i].label}</span>
          )}
        </div>
      ))}

      {/* #14 Stone Count */}
      {isHomepage && STONE_MILESTONES.map((milestone) => (
        <div key={milestone} className={`nav-stone ${collectedStones.has(milestone) ? "nav-stone-collected" : ""}`} aria-hidden="true" style={{ left: `${milestone * 100}%` }} />
      ))}

      {showFirstLight && <div className="first-light-bar absolute bottom-0 left-0 h-px" aria-hidden="true" />}
      {smokeGhost !== null && <div className="smoke-signal-ghost absolute bottom-0 left-0 h-px" aria-hidden="true" style={{ width: `${smokeGhost * 100}%` }} />}
      {isHomepage && avgDepth !== null && avgDepth > 0 && !prefersReducedMotion && <div className="nav-depth-memory absolute bottom-0 left-0 h-px pointer-events-none" aria-hidden="true" style={{ width: `${Math.min(avgDepth, highWaterMarkDisplay || 1) * 100}%` }} />}
      {isHomepage && highWaterMarkDisplay > 0 && highWaterMarkDisplay < 1.0 && !prefersReducedMotion && <div className="nav-tideline" aria-hidden="true" style={{ left: `${highWaterMarkDisplay * 100}%` }} />}
      {isHomepage && inscriptionVisible && <span className={`nav-inscription hidden lg:block ${!prefersReducedMotion ? "nav-inscription-fade-in" : ""}`} aria-hidden="true">LOYLY</span>}
      {isHomepage && isDesktop && !isFooterMode && !isTransparent && !prefersReducedMotion && (
        <div ref={vapourContainerRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" />
      )}
      {isHomepage && isDesktop && showEcho && !prefersReducedMotion && <div className="progress-echo absolute bottom-0 left-0 h-px" aria-hidden="true" style={{ width: `${echoWidth * 100}%` }} />}
      {isHomepage && isDesktop && !prefersReducedMotion && bellFlashIndex === null && condensationDroplets.map(drop => (
        <div key={drop.id} className="condensation-drop" aria-hidden="true" style={{ left: `${drop.x}%` }} />
      ))}
      {isHomepage && isDesktop && bellFlashIndex !== null && !prefersReducedMotion && sectionPositions[bellFlashIndex] !== undefined && (
        <div className="section-bell" aria-hidden="true" style={{ left: `${sectionPositions[bellFlashIndex] * 100}%` }} />
      )}
      {isHomepage && isDesktop && !prefersReducedMotion && muistiStars.map((star, i) => (
        <div key={`muisti-${i}`} className="muisti-star" aria-hidden="true" style={{ left: `${star.pos * 100}%`, width: `${star.size}px`, height: `${star.size}px`, opacity: star.opacity }} />
      ))}
      {isHomepage && isDesktop && loylyCount > 0 && (
        <span className={`loyly-count hidden lg:block ${loylyCount >= 25 ? "loyly-tier-3" : loylyCount >= 10 ? "loyly-tier-2" : ""}`} aria-hidden="true">{loylyCount}</span>
      )}
      {kindlingSpark && <div className="absolute bottom-0 left-0 w-1 h-1 rounded-full bg-cedar animate-ping" aria-hidden="true" />}
      {isHomepage && isDesktop && !prefersReducedMotion && (
        <div ref={rekkaContainerRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" />
      )}

      {/* Progress fill */}
      <div
        className={`absolute bottom-0 left-0 h-px cedar-progress ${
          isFooterMode ? "cedar-stones-glow" : ""
        } ${warmPhase && !isFooterMode ? "cedar-warming" : ""} ${
          stonesComplete ? "stones-complete-glow" : ""
        } ${footerDwell ? "loyly-exhale-bar" : ""} ${
          pulseSpeed > 0 && isHomepage && isDesktop ? "kiuas-pulse-active" : ""
        } ${is404 ? "nav-hearthstone-pulse" : ""} ${
          sisuGlow && !prefersReducedMotion ? "sisu-glow" : ""
        }`}
        style={{
          width: is404 ? `${hearthstoneProgress}%` : `${scrollProgress * 100}%`,
          transition: is404 ? "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)" : "width 0.1s linear",
          background: isHomepage && !is404 ? getHeatMapGradient() : undefined,
          boxShadow: isFooterMode ? "0 0 6px hsl(28 50% 52% / 0.3), 0 0 20px hsl(28 50% 52% / 0.08)" : undefined,
          ...(pulseSpeed > 0 && isHomepage && isDesktop ? { '--pulse-speed': `${pulseSpeed}s` } as React.CSSProperties : {}),
        }}
      />

      {showThresholdPulse && <div className="absolute bottom-0 left-0 right-0 h-px threshold-pulse-bar" aria-hidden="true" />}

      {/* Steam Trail / Warm Return / Hearthstone labels */}
      {is404 && hearthstoneLabel ? (
        <span className="nav-section-label hidden lg:block text-cedar transition-opacity duration-500" aria-hidden="true" style={{ left: "50%", transform: "translateX(-50%)" }}>{hearthstoneLabel}</span>
      ) : warmReturnMsg ? (
        <span className="nav-section-label hidden lg:block text-cedar transition-opacity duration-500" aria-hidden="true" style={{ left: "50%", transform: "translateX(-50%)" }}>{warmReturnMsg}</span>
      ) : (
        isHomepage && currentSectionLabel && (
          <span className="nav-section-label hidden lg:block transition-opacity duration-300" aria-hidden="true" style={{ left: `${Math.min(scrollProgress * 100, 95)}%`, transform: "translateX(-100%)" }}>{currentSectionLabel}</span>
        )
      )}
    </div>
  );
});

NavProgressBar.displayName = "NavProgressBar";

export default NavProgressBar;
