import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";
import SkipToContent from "@/components/ui/skip-to-content";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NotFound = () => {
  const location = useLocation();
  useDocumentTitle(
    "Page Not Found",
    "The page you’re looking for doesn’t exist. Find your way back to Creek Construction.",
  );

  useEffect(() => {
    if (import.meta.env.DEV) console.warn("[404]", location.pathname);
  }, [location.pathname]);

  return (
    <main
      id="main-content"
      className="min-h-screen overflow-x-clip bg-background"
      aria-label="Page not found — Creek Construction"
    >
      <Navigation />
      <SkipToContent target="section-not-found" />

      <section id="section-not-found" aria-labelledby="not-found-heading">
        <PageHero
          variant="evergreen-typographic"
          breadcrumb={[]}
          numeral="404"
          title={["Nothing here.", "But the work does."]}
          subtitle="That page doesn’t exist — but the projects, the crew, and the calendar all do."
          skipToId="not-found-heading"
        >
          <div
            id="not-found-heading"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <CedarCTA to="/">Back to home</CedarCTA>
            <CedarCTA to="/services" variant="secondary">
              Browse services
            </CedarCTA>
          </div>
        </PageHero>
      </section>

      <Footer />
    </main>
  );
};

export default NotFound;
