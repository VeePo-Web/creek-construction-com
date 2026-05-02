// Single source of truth for the trust line shown across the site.
// Used by HeroTrustStrip, QuoteCloserCard, QuoteModal footer, and Footer.

import { ShieldCheck, FileCheck, Clock, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrustSignal {
  icon: LucideIcon;
  label: string;
}

/** The four words/phrases the brand stands behind. */
export const TRUST_SIGNALS: TrustSignal[] = [
  { icon: ShieldCheck, label: "WCB Covered" },
  { icon: FileCheck, label: "Fully Insured" },
  { icon: Clock, label: "24-hour reply" },
  { icon: BadgeCheck, label: "No obligation" },
];

/** Inline string version, dot-separated. */
export const TRUST_LINE = TRUST_SIGNALS.map((s) => s.label).join(" · ");

/** The single canonical CTA phrase used everywhere on the site. */
export const PRIMARY_CTA_LABEL = "Get my free quote";
