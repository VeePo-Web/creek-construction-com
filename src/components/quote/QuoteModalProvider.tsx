import { createContext, useCallback, useContext, useMemo, useState } from "react";

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

  return <QuoteModalContext.Provider value={value}>{children}</QuoteModalContext.Provider>;
};

export const useQuoteModal = () => {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error("useQuoteModal must be used inside <QuoteModalProvider>");
  return ctx;
};
