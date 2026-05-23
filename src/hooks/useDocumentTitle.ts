import { useEffect } from "react";
import { absoluteUrl, SITE_SEO } from "@/config/seo";

const BASE_TITLE = "Creek Construction";

interface DocumentTitleOptions {
  path?: string;
  noindex?: boolean;
}

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => el!.setAttribute(key, value));
    document.head.appendChild(el);
  }
  return el;
}

function setMetaName(name: string, content: string) {
  const el = ensureMeta(`meta[name="${name}"]`, { name });
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  const el = ensureMeta(`meta[property="${property}"]`, { property });
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useDocumentTitle(
  title: string,
  description?: string,
  options: DocumentTitleOptions = {},
) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — ${BASE_TITLE}`
      : `${BASE_TITLE} — Excellence in the Work`;
    const metaDescription = description ?? SITE_SEO.defaultDescription;
    const canonicalUrl = absoluteUrl(options.path ?? window.location.pathname);

    document.title = fullTitle;
    setMetaName("description", metaDescription);
    setMetaProperty("og:title", fullTitle);
    setMetaName("twitter:title", fullTitle);
    setMetaProperty("og:description", metaDescription);
    setMetaName("twitter:description", metaDescription);
    setMetaProperty("og:url", canonicalUrl);
    setCanonical(canonicalUrl);
    setMetaName("robots", options.noindex ? "noindex, nofollow" : "index, follow");

    return () => {
      document.title = `${BASE_TITLE} — Excellence in the Work`;
      setMetaName("robots", "index, follow");
    };
  }, [title, description, options.path, options.noindex]);
}
