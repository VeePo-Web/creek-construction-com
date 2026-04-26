/**
 * Route → breadcrumb metadata.
 *
 * Single source of truth for "what label do we put on this sub-page in the
 * chrome breadcrumb chip". Consumed by both `HeaderBreadcrumb` (≥ md) and
 * `MobileSubNav` (< md) so the wording can never drift between the two
 * surfaces.
 *
 * Sub-pages of `/` only — the home page itself never shows a breadcrumb.
 */
export interface RouteBreadcrumbMeta {
  /** Short label for the current page (e.g. "Services"). */
  label: string;
  /** Parent route label (always "Home" for now, kept generic for future depth). */
  parent: string;
  /** Path the parent label links to. */
  parentPath: string;
}

export const ROUTE_BREADCRUMB: Record<string, RouteBreadcrumbMeta> = {
  "/services": { label: "Services", parent: "Home", parentPath: "/" },
  "/work": { label: "Our Work", parent: "Home", parentPath: "/" },
  "/about": { label: "About", parent: "Home", parentPath: "/" },
  "/contact": { label: "Contact", parent: "Home", parentPath: "/" },
};

export function getRouteBreadcrumb(pathname: string): RouteBreadcrumbMeta | null {
  return ROUTE_BREADCRUMB[pathname] ?? null;
}
