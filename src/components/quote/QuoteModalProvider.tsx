import { createContext, useCallback, useContext, useMemo, useState } from "react";
import QuoteModal from "@/components/quote/QuoteModal";

// QuoteModal is 5.3 KB gzipped — not worth lazy-loading. Importing directly
// means the JS is parsed on page load so the modal opens with zero delay on
// first click. Radix Dialog renders nothing into the DOM when open={false},
// so there is no layout or paint cost until the user actually opens it.

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
  const [preselectedServices, setPreselectedServices] = useState<string[]>([]);

  const openModal = useCallback((preselect?: string[]) => {
    setPreselectedServices(preselect ?? []);
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
      <QuoteModal />
    </QuoteModalContext.Provider>
  );
};

export const useQuoteModal = () => {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error("useQuoteModal must be used inside <QuoteModalProvider>");
  return ctx;
};
