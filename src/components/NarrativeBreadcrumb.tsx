import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SECTION_PHRASES: { id: string; phrase: string }[] = [
  { id: "section-hero", phrase: "The truth about recovery..." },
  { id: "section-truth", phrase: "Built for Alberta winters..." },
  { id: "section-services", phrase: "One team. One outcome..." },
  { id: "section-testimonials", phrase: "Real properties. Real rituals..." },
  { id: "section-vignettes", phrase: "Your standard, not a novelty..." },
  { id: "section-contact", phrase: "Start here." },
];

const STORAGE_KEY = "bp_visited";

const NarrativeBreadcrumb = () => {
  const location = useLocation();
  const [activePhrase, setActivePhrase] = useState(SECTION_PHRASES[0].phrase);
  const [visible, setVisible] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  const isHomepage = location.pathname === "/";
  const [hasVisited] = useState(() => {
    try { return typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
  });

  // Return Visit: show "Ready to continue?" for returning homepage visitors
  const [returnDismissed, setReturnDismissed] = useState(false);

  useEffect(() => {
    if (!isHomepage || !hasVisited) return;

    setVisible(true);

    // Auto-dismiss after 5 seconds
    const dismissTimer = setTimeout(() => setReturnDismissed(true), 5000);

    // Dismiss on scroll past 200px
    const onScroll = () => {
      if (window.scrollY > 200) setReturnDismissed(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(dismissTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHomepage, hasVisited]);

  useEffect(() => {
    if (!isHomepage || hasVisited) return;

    const showTimer = setTimeout(() => setVisible(true), 800);

    let lastScrollY = 0;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 200 && currentY > lastScrollY) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      if (currentY < 80) setNavHidden(false);
      lastScrollY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const observers: IntersectionObserver[] = [];
    SECTION_PHRASES.forEach(({ id, phrase }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActivePhrase(phrase);
            if (id === "section-contact") {
              localStorage.setItem(STORAGE_KEY, "true");
            }
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
      localStorage.setItem(STORAGE_KEY, "true");
    };
  }, [isHomepage, hasVisited]);

  // Returning visitor breadcrumb
  if (isHomepage && hasVisited) {
    if (returnDismissed) return null;
    return (
      <div
        className={`fixed left-0 right-0 z-40 h-8 flex items-center justify-center bg-background/90 backdrop-blur-sm border-b border-border/50 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
        style={{ top: 61 }}
      >
        <Link
          to="/plan"
          className="text-minimal text-cedar hover:underline underline-offset-4 decoration-cedar/40 transition-all duration-300"
        >
          Ready to continue?
        </Link>
      </div>
    );
  }

  if (!isHomepage) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-40 h-8 flex items-center justify-center bg-background/90 backdrop-blur-sm border-b border-border/50 transition-all duration-500 ${
        visible && !navHidden
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full"
      }`}
      style={{ top: 61 }}
    >
      <p
        key={activePhrase}
        className="text-minimal text-muted-foreground animate-[fade-in_0.3s_ease-out]"
      >
        {activePhrase}
      </p>
    </div>
  );
};

export default NarrativeBreadcrumb;
