import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { HOMEPAGE_GALLERY } from "@/config/gallery";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { HEADLINE } from "@/lib/typography";
import { useReveal } from "@/hooks/useReveal";

interface HomeGalleryStripProps {
  background?: "background" | "secondary";
}

/**
 * HomeGalleryStrip — a 3-up captionless image row on the homepage.
 *
 * No titles, no descriptions, no project metadata. Click anywhere
 * (or the closing link) to land on the full /work gallery wall.
 */
const HomeGalleryStrip = ({ background = "secondary" }: HomeGalleryStripProps) => {
  const { ref, cls, style } = useReveal();
  const bg = background === "secondary" ? "bg-secondary" : "bg-background";

  return (
    <section
      id="section-gallery-strip"
      className={`${SECTION_PADDING.default} ${bg}`}
      aria-labelledby="home-gallery-heading"
    >
      <div className="container-page">
        <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 mb-12 md:mb-16">
            <p className="eyebrow md:col-span-3">Recent work</p>
            <div className="md:col-span-9">
              <h2
                id="home-gallery-heading"
                className={`${HEADLINE.section} leading-[1.02]`}
              >
                A look at the work.
              </h2>
            </div>
          </div>

          <Link
            to="/work"
            aria-label="See the full gallery"
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {HOMEPAGE_GALLERY.map((img, i) => (
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

          <div className="mt-10 md:mt-12 hairline pt-6 flex items-center justify-between">
            <p className="eyebrow opacity-70">More photographs in the gallery</p>
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 cta-label text-foreground hover:text-cedar transition-colors"
            >
              <span className="link-underline group-hover:[background-size:100%_1px]">
                See the full gallery
              </span>
              <ArrowUpRight className="h-4 w-4 link-arrow" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeGalleryStrip;
