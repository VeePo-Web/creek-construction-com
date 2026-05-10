/**
 * Per-route section nav registry — emptied in Pass 52.
 *
 * The two-tier nav now collapses to brand mark + (phone · Quote · MENU)
 * on every route. Per-page in-section anchors live exclusively in the
 * fullscreen GlobalMenu, not in the chrome.
 */

export interface PageSection {
  name: string;
  anchor: string;
}

export function getPageSections(_pathname: string): PageSection[] {
  return [];
}

export const ROUTES_WITH_SECTIONS: string[] = [];
