import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState } from "react";

// QuoteModal is heavy (~37 KB, 879 lines: form schema, react-hook-form,
// service config, edge-function client). It only renders when a CTA opens it,
// so we defer it until first open instead of shipping it on initial paint.
const QuoteModal = lazy(() => import("@/components/quote/QuoteModal"));

interface QuoteModalContextValue {
  open: boolean;
  /** Service IDs to pre-select when the modal opens. */
  preselectedServices: string[];
  openModal: (preselect?: string[]) => void;
  closeModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export const QuoteModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  // Once the modal has been opened once, keep it mounted so subsequent opens
  // don't re-fetch the chunk. This trades ~37 KB of memory for snappy UX.
  const [hasOpened, setHasOpened] = useState(false);
  const [preselectedServices, setPreselectedServices] = useState<string[]>([]);

  const openModal = useCallback((preselect?: string[]) => {
    setPreselectedServices(preselect ?? []);
    setHasOpened(true);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<QuoteModalContextValue>(
    () => ({ open, preselectedServices, openModal, closeModal }),
    [open, preselectedServices, openModal, closeModal],
  );

  return (
    <QuoteModalContext.Provider value={value}>
      {children}
      {hasOpened && (
        <Suspense fallback={null}>
          <QuoteModal />
        </Suspense>
      )}
    </QuoteModalContext.Provider>
  );
};

export const useQuoteModal = () => {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error("useQuoteModal must be used inside <QuoteModalProvider>");
  return ctx;
};
