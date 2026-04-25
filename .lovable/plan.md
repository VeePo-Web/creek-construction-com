

# Homepage Audit: Contact Section -- Community Tag Warmth

## Audit Finding

The Contact section ("Get My Sauna Plan") lists seven Alberta service area tags: Edmonton, Sherwood Park, Red Deer, Calgary, Cochrane, Canmore, Bragg Creek. These are currently styled with `border border-border` -- a neutral gray border with no hover state and no cedar connection.

Every other tag-like element on the homepage carries the brand's cedar warmth. The Footer's service area tags use `border-primary-foreground/20` with `hover:border-primary-foreground/40`. The Testimonials' anxiety tags use `border-cedar/20`. The progressive cedar border motif runs through RitualIdentity, Services, About, Portfolio, LifeAfterFirstHeat, and Contact's own step list.

But these seven community tags sit in plain gray, completely inert. They are the only interactive-looking elements on the entire homepage that don't respond to cursor proximity. On a premium brand site, every touchable-looking element should acknowledge the user's presence -- even if it doesn't navigate anywhere. The absence of hover feedback reads as unfinished rather than intentional.

## The Fix

Add `hover:border-cedar/30 transition-colors duration-300` to the community tag `span` elements. This creates a subtle cedar-warmth response on hover that connects the tags to the brand's visual system without implying they are clickable links. The transition duration matches the 300ms used throughout the Contact section's other interactive elements.

## Technical Changes

### File: `src/components/Contact.tsx` (line 58)

Current:
```tsx
<span key={city} className="text-sm text-muted-foreground border border-border px-4 py-2">
```

Replace with:
```tsx
<span key={city} className="text-sm text-muted-foreground border border-border hover:border-cedar/30 px-4 py-2 transition-colors duration-300">
```

## What This Achieves

- Aligns the community tags with the site's established pattern of cedar-responsive interactive elements
- The 30% cedar opacity on hover is barely there -- a whisper of warmth that acknowledges cursor proximity without suggesting navigation
- The `transition-colors duration-300` matches the Contact section's CTA button and the Footer's service area tags
- Creates visual consistency between the Contact section's community tags and the Footer's nearly identical service area layout
- No new CSS, no JavaScript, no structural changes -- two Tailwind utility additions only

