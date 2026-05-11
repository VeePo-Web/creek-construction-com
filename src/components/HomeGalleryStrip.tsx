import { useMemo } from "react";
import { Link } from "react-router-dom";
import { HOMEPAGE_GALLERY } from "@/config/gallery";
import { useApprovedMedia } from "@/hooks/useApprovedMedia";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { HEADLINE } from "@/lib/typography";
import { useReveal } from "@/hooks/useReveal";

interface HomeGalleryStripProps {
  background?: "background" | "secondary";
}

/**
 * HomeGalleryStrip — a 3-up captionless image row on the homepage.
 *
 * Pulls live from the approved cloud media library (real photos only).
 * Falls back to the curated 3 shed photos if cloud returns nothing.
 */
const HomeGalleryStrip = ({ background = "secondary" }: HomeGalleryStripProps) => {
  const { ref, cls, style } = useReveal();
  const bg = background === "secondary" ? "bg-secondary" : "bg-background";

  const { items } = useApprovedMedia({
    kind: "image",
    min_quality: "reference",
    shot_type: ["hero", "elevation", "wide"],
    limit: 3,
  });

  const tiles = useMemo(() => {
    if (items.length >= 3) {
      return items.slice(0, 3).map((m) => ({ src: m.url, alt: m.alt }));
    }
    return HOMEPAGE_GALLERY;
  }, [items]);

  return (
    <section
      id="section-gallery-strip"
      className={`${SECTION_PADDING.default} ${bg} min-h-[100svh] flex flex-col justify-center`}
      aria-labelledby="home-gallery-heading"
    >
      <div className="container-page">
        <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
          <div className="mb-12 md:mb-16">
            <h2
              id="home-gallery-heading"
              className={`${HEADLINE.section} leading-[1.02]`}
            >
              A look at the work.
            </h2>
          </div>

          <Link
            to="/work"
            aria-label="See the full gallery"
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {tiles.map((img, i) => (
                <figure
                  key={`${img.src}-${i}`}
                  className="overflow-hidden bg-background aspect-[4/5]"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </figure>
              ))}
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default HomeGalleryStrip;
