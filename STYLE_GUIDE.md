# Creek Construction — Style Guide

> **The style guide is code-first.**
> The five files in `src/lib/` are the source of truth. Visit
> [`/style-guide`](/style-guide) for the rendered, copy-to-clipboard reference.

This markdown file documents only **governance** — how the system evolves.
For palette swatches, type specimens, motion demos, and component previews,
go to the live page.

---

## Source of truth

| File | Owns |
|---|---|
| [`src/lib/colors.ts`](./src/lib/colors.ts) | Palette, surfaces, text, buttons, shadows, dividers, contrast pairings |
| [`src/lib/typography.ts`](./src/lib/typography.ts) | Headlines, body, eyebrow, quote, stat, UI styles + do/don't rules |
| [`src/lib/spacing.ts`](./src/lib/spacing.ts) | Section padding, container padding, gaps, max-widths, touch targets |
| [`src/lib/motion.ts`](./src/lib/motion.ts) | Easing curves, durations, hover patterns, focus rings, scroll-reveal contracts |
| [`src/lib/brand-identity.ts`](./src/lib/brand-identity.ts) | Voice, value prop, non-negotiables, dealbreakers, performance budgets |

Every component imports from these. **Never hand-roll a hex value, font-size string, or `py-32` literal in a component file** — pick from a token. If the token you need doesn't exist, follow the checklist below before adding it.

---

## Companion docs

- [`MEDIA_PLAYBOOK.md`](./MEDIA_PLAYBOOK.md) — photography rules, MediaSlot patterns, EditorialPicture guardrails.
- `mem://design/*` — long-form principles (warmth, restraint, editorial rhythm).
- `mem://standards/*` — performance and accessibility standards we hold the site to.

---

## Before adding a token

1. **Does an existing token solve this?**
   Check `colors.ts`, `spacing.ts`, `motion.ts` first. New tokens fragment the system.
2. **Will this token be used 3+ times?**
   If not, it's a one-off. Compose Tailwind classes in the component instead.
3. **Have you documented the usage rule and the WHY?**
   Every export in `src/lib/` carries a JSDoc explaining when and why to use it. Match the pattern.
4. **Does it need a `/style-guide` entry?**
   Almost always yes. Render new tokens on the live page in the same section as their peers.

---

## Deprecation policy

- When a token is replaced, leave it in place for **one release** with a `@deprecated` JSDoc tag pointing at the replacement.
- After one release, **delete it** and remove the `/style-guide` entry.
- **Never silently remap a token to a different value.** That happened with `--cedar` → bronze in early 2026 and confused every contributor for months. The current alias (`--cedar` resolves to bronze) is documented in `colors.ts` and `index.css` and will stay until we sweep `text-cedar` usage out of components in a future pass.

---

## Contributor checklist

Before opening a PR that touches design surfaces:

- [ ] Did you import from `src/lib/*` instead of hand-rolling Tailwind class strings?
- [ ] Did you add the new token's usage to `/style-guide` if you added one?
- [ ] Did you check the contrast on any new color pairing? (See `CONTRAST` in `colors.ts`.)
- [ ] Did you wrap any non-essential motion in `motion-reduce:` classes from `REDUCED_MOTION`?
- [ ] Did every interactive element hit the 44×44px touch target on mobile?
- [ ] Did every image carry meaningful alt text? (`EditorialPicture` warns in dev.)
- [ ] Did you keep the headline in DM Serif Display? (No sans-serif headlines.)

---

## Performance review cadence

The performance budgets in `brand-identity.ts` (`PERFORMANCE_BUDGETS`) are the contract:

| Metric | Target | Critical |
|---|---|---|
| LCP (mobile, 4G) | < 2.0s | < 2.5s |
| CLS | < 0.05 | < 0.1 |
| INP | < 200ms | < 500ms |
| Total JS (gz) | < 180 KB | < 250 KB |
| Critical CSS (gz) | < 14 KB | < 30 KB |
| Lighthouse Perf | > 95 | > 90 |

Re-measure after any change that adds a dependency, a route, or a heavy effect. If a metric crosses the **critical** threshold, ship a follow-up plan to repair it before adding more features.

---

## Accessibility review cadence

The accessibility guarantees in `brand-identity.ts` (`ACCESSIBILITY`) are also the contract:

- WCAG 2.1 AA target, AAA where contrast allows.
- 44×44px touch targets on mobile (WCAG 2.5.8).
- 4.5:1 contrast for body, 3:1 for large text and UI.
- Visible 2px bronze focus ring with 2px offset on every focusable element.
- All non-essential animation disabled at `prefers-reduced-motion: reduce`.
- Real semantic HTML (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`).
- Meaningful alt text on every image.

Run an axe / Lighthouse a11y pass on every new public route before merging.

---

## What changed in this rewrite

This file used to be ~700 lines describing the **B&P Sauna** brand (cedar ritual, löyly, hearthstone). All of that is gone. The Creek Construction brand and design system live in code now, with `/style-guide` as the rendered reference. If you're looking for the sauna doc, it was the wrong source of truth — anything you copied from it is off-brand for Creek.
