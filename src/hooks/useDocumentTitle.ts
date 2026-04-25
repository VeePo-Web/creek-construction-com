import { useEffect } from "react";

const BASE_TITLE = "Creek Construction";

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} — ${BASE_TITLE}`
      : `${BASE_TITLE} — Excellence in the Work`;

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", description);
    }

    return () => {
      document.title = `${BASE_TITLE} — Excellence in the Work`;
    };
  }, [title, description]);
}
