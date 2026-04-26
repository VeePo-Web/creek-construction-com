import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { QuoteModalProvider } from "@/components/quote/QuoteModalProvider";
import RequireAdmin from "@/components/admin/RequireAdmin";
import MobileQuoteFAB from "@/components/MobileQuoteFAB";

// Public routes are lazy except Home (the LCP/entry route).
// Each non-home route ships its own JS chunk so visitors only download
// what they actually browse to.
const Services = lazy(() => import("./pages/Services"));
const Work = lazy(() => import("./pages/Work"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AdminClassify = lazy(() => import("./pages/admin/Classify"));
const StyleGuide = lazy(() => import("./pages/StyleGuide"));

const queryClient = new QueryClient();

/**
 * Calm, layout-stable fallback while a route chunk loads.
 * Matches the page background so there's no flash, no spinner.
 */
const RouteSkeleton = () => <div className="min-h-screen bg-background" aria-hidden />;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/**
 * Gate the mobile Quote FAB to public marketing routes only — never on
 * admin, /style-guide, or /contact (the contact page is itself a CTA).
 */
function PublicMobileFAB() {
  const { pathname } = useLocation();
  const blocked =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/style-guide") ||
    pathname.startsWith("/contact");
  if (blocked) return null;
  return <MobileQuoteFAB />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <QuoteModalProvider>
          <ScrollToTop />
          <Suspense fallback={<RouteSkeleton />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/media"
                element={
                  <RequireAdmin>
                    <AdminMediaLibrary />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/classify"
                element={
                  <RequireAdmin>
                    <AdminClassify />
                  </RequireAdmin>
                }
              />
              <Route path="/style-guide" element={<StyleGuide />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </QuoteModalProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
