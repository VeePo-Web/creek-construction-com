// Single source of truth for the stat trio shown across the site.
// Used by CrewMoment (showStats), TrustStrip (compact tail row), and any
// future proof bands. Tuning these numbers is a one-file change.

export interface StatPoint {
  value: string;
  label: string;
}

export const STATS_TRIO: StatPoint[] = [
  { value: "05+", label: "Years Building" },
  { value: "500+", label: "Alberta Projects" },
  { value: "24h", label: "Reply Window" },
];
