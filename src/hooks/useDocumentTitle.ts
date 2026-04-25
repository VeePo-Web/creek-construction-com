import { useEffect } from "react";

const BASE_TITLE = "B&P Sauna";

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE_TITLE}` : `${BASE_TITLE} — Alberta-Built Outdoor Cedar Saunas`;
    
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }
    
    return () => {
      document.title = `${BASE_TITLE} — Alberta-Built Outdoor Cedar Saunas`;
    };
  }, [title, description]);
}
