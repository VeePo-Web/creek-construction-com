import { useApprovedMedia } from "@/hooks/useApprovedMedia";
import EditorialPicture from "@/components/media/EditorialPicture";
import ProvenanceCaption from "@/components/media/ProvenanceCaption";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { MEDIA_SIZES } from "@/lib/media-sizes";

/**
 * HomeProjectRecapStrip — a 4-up grid of the strongest hero-quality photos
 * across every service, shown between FeaturedProjects and Contact on the
 * home page. Editorial counterpart to "more proof before the ask."
 *
 * Renders absolutely nothing if we have fewer than 4 approved hero shots —
 * better to skip the section than show a half-baked grid.
 */
const HomeProjectRecapStrip = () => {
  const { items, loading } = useApprovedMedia({
    kind: "image",
    min_quality: "hero",
    shot_type: ["hero", "wide", "elevation"],
    limit: 8,
  });

  if (loading) return null;
  if (items.length < 4) return null;

  // De-dupe by project_slug so we don't show 4 photos of the same job
  const seenSlugs = new Set<string>();
  const picks: typeof items = [];
  for (const item of items) {
    const key = item.project_slug ?? item.storage_path;
    if (seenSlugs.has(key)) continue;
    seenSlugs.add(key);
    picks.push(item);
    if (picks.length === 4) break;
  }
  // Fall back to top-N if dedup left us short
  while (picks.length < 4 && items.length >= 4) {
    const next = items[picks.length];
    if (!next) break;
    if (!picks.includes(next)) picks.push(next);
    else break;
  }
  if (picks.length < 4) return null;

  return (
    <section
      aria-labelledby="home-recap-heading"
      className="py-16 md:py-24 bg-background relative grain-overlay"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 800px" }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollRevealMotion>
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/70 mb-3">
                  Field Notes
                </p>
                <h2
                  id="home-recap-heading"
                  className="font-serif text-3xl md:text-4xl text-foreground"
                >
                  Recent corners of the work.
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-px bg-cedar/30" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 tabular-nums">
                  04 Frames
                </span>
              </div>
            </div>
          </ScrollRevealMotion>

          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            role="list"
          >
            {picks.map((item, i) => (
              <ScrollRevealMotion
                key={item.storage_path}
                delay={i * 0.08}
                y={20}
              >
                <figure role="listitem" className="group">
                  <EditorialPicture
                    src={item.url}
                    alt={item.alt}
                    width={item.width ?? 1200}
                    height={item.height ?? 1200}
                    lqip={item.lqip}
                    sizes={MEDIA_SIZES.QUARTER}
                    wrapperClassName="aspect-square"
                    cedarHover
                  />
                  <figcaption className="mt-3">
                    <ProvenanceCaption
                      numeral={String(i + 1).padStart(2, "0")}
                      location={item.project_slug ?? undefined}
                      subject={item.shot_type ?? undefined}
                      variant="subtle"
                    />
                  </figcaption>
                </figure>
              </ScrollRevealMotion>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProjectRecapStrip;
