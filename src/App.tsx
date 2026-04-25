import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { QuoteModalProvider } from "@/components/quote/QuoteModalProvider";
import QuoteModal from "@/components/quote/QuoteModal";
import RequireAdmin from "@/components/admin/RequireAdmin";

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AdminClassify = lazy(() => import("./pages/admin/Classify"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <QuoteModalProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<div className="min-h-screen bg-background" />}>
                  <AdminLogin />
                </Suspense>
              }
            />
            <Route
              path="/admin/media"
              element={
                <Suspense fallback={<div className="min-h-screen bg-background" />}>
                  <RequireAdmin>
                    <AdminMediaLibrary />
                  </RequireAdmin>
                </Suspense>
              }
            />
            <Route
              path="/admin/classify"
              element={
                <Suspense fallback={<div className="min-h-screen bg-background" />}>
                  <RequireAdmin>
                    <AdminClassify />
                  </RequireAdmin>
                </Suspense>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <QuoteModal />
        </QuoteModalProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
