import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProjects } from "@/hooks/useApprovedMedia";
import EditorialPicture from "@/components/media/EditorialPicture";
import SectionHeader from "@/components/SectionHeader";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { supabase } from "@/integrations/supabase/client";
import type { DBProject } from "@/lib/api/public-media";
import { useReveal } from "@/hooks/useReveal";
import { SECTION_PADDING } from "@/lib/spacing";
import { BACKDROP } from "@/lib/colors";

/**
 * FeaturedProjects — editorial gallery of `featured = true` projects from
 * the database. Asymmetric 2-row layout when 6 are available; collapses
 * gracefully when fewer rows exist.
 *
 *   6+ projects → row1: 1 large + 2 stacked, row2: 3 equal
 *   3-5         → single 3-column grid
 *   <3          → renders nothing (the page lands on Contact instead)
 *
 * Pulls hero photos directly from the project row (`hero_path`). Falls
 * back silently if a featured project has no hero set.
 */

interface ProjectCardProps {
  project: DBProject;
  /** Layout intent — affects aspect ratio and sizes hint. */
  variant: "lead" | "stack" | "row";
  index: number;
}

const ProjectCard = ({ project, variant, index }: ProjectCardProps) => {
  // Ratio per slot — lead is 4:5, stacked are 4:3, row are 3:4
  const aspectClass =
    variant === "lead"
      ? "aspect-[4/5]"
      : variant === "stack"
        ? "aspect-[5/4]"
        : "aspect-portrait";

  const sizes =
    variant === "lead"
      ? MEDIA_SIZES.ASYM_PRIMARY
      : variant === "stack"
        ? MEDIA_SIZES.ASYM_SECONDARY
        : MEDIA_SIZES.THIRD;

  const headingSize =
    variant === "lead"
      ? "text-2xl md:text-3xl lg:text-[34px] xl:text-[40px]"
      : "text-lg md:text-xl lg:text-[22px]";

  return (
    <article className="group h-full flex flex-col">
        <Link
          to={`/work#${project.slug}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 rounded-[6px]"
          aria-label={`View ${project.title}, ${project.service} in ${project.location ?? "Alberta"}`}
        >
          {project.hero_url ? (
            <EditorialPicture
              src={project.hero_url}
              alt={`${project.title} — ${project.service} ${project.location ? `in ${project.location}` : ""}`.trim()}
              width={1600}
              height={variant === "lead" ? 2000 : variant === "stack" ? 1200 : 2133}
              sizes={sizes}
              wrapperClassName={`${aspectClass} w-full rounded-none`}
              className="transition-transform duration-[1.2s] group-hover:scale-[1.025]"
              cedarHover
            />
          ) : (
            // Calm secondary fallback for featured projects without a hero
            <div className={`${aspectClass} w-full rounded-none relative overflow-hidden bg-secondary`}>
              <span className="absolute inset-0 flex items-center justify-center font-serif text-foreground/15 text-6xl select-none tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}

          <div className="mt-5 flex items-baseline gap-3 tabular-nums flex-wrap">
            <span className="eyebrow text-cedar/70">{String(index + 1).padStart(2, "0")}</span>
            <span className="eyebrow">{project.location ?? "Alberta"}</span>
            <span className="eyebrow">·</span>
            <span className="eyebrow">{project.service}</span>
            {project.year && (
              <>
                <span className="eyebrow">·</span>
                <span className="eyebrow">{project.year}</span>
              </>
            )}
          </div>

          <h3
            className={`font-serif ${headingSize} text-foreground mt-2 leading-tight group-hover:text-cedar transition-colors duration-300`}
          >
            {project.title}
          </h3>

          {project.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3">
              {project.summary}
            </p>
          )}

          <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-cedar/70 group-hover:text-cedar transition-colors duration-300">
            View project
            <ArrowRight
              className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300"
              aria-hidden
            />
          </span>
        </Link>
      </article>
    );
};

interface FeaturedProjectsProps {
  /** Background tone. Default "background". */
  background?: "background" | "secondary";
}

const FeaturedProjects = ({ background = "background" }: FeaturedProjectsProps = {}) => {
  const { projects, loading } = useProjects({ featured: true, limit: 6 });
  const { ref, cls, style } = useReveal();

  // Quietly hide the section if we don't have at least 3 featured projects.
  if (loading) return null;
  if (projects.length < 3) return null;

  // Patch hero_url onto rows that ship a hero_path but no resolved URL —
  // belt-and-suspenders for any rows synced before useProjects hardened.
  const withUrls = projects.map((p) =>
    p.hero_url
      ? p
      : p.hero_path
        ? {
            ...p,
            hero_url: supabase.storage
              .from("media-library")
              .getPublicUrl(p.hero_path).data.publicUrl,
          }
        : p,
  );

  const has6 = withUrls.length >= 6;
  const lead = withUrls[0];
  const stack = withUrls.slice(1, 3);
  const row = has6 ? withUrls.slice(3, 6) : withUrls.slice(3);

  return (
    <section
      id="section-featured"
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"} relative`}
      aria-labelledby="featured-heading"
    >
      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6">
        <div ref={ref} className={`max-w-7xl mx-auto ${cls}`} style={style}>
          <div className="mb-12 md:mb-16">
            <SectionHeader
              numeral="V"
              label="FEATURED PROJECTS"
              headingId="featured-heading"
              heading="Recent work, in detail."
              subheading="Projects we’re proud of — across Calgary, Edmonton, and surrounding Alberta."
              badge={`${String(withUrls.length).padStart(2, "0")} Featured`}
              align="center"
              disableMotion
            />
          </div>

          {has6 ? (
            <>
              {/* Row 1 — asymmetric 60/40: lead + 2 stacked */}
              <div className="grid md:grid-cols-5 gap-6 md:gap-8 mb-10 md:mb-14">
                <div className="md:col-span-3">
                  <ProjectCard project={lead} variant="lead" index={0} />
                </div>
                <div className="md:col-span-2 grid gap-6 md:gap-8">
                  {stack.map((p, i) => (
                    <ProjectCard
                      key={p.slug}
                      project={p}
                      variant="stack"
                      index={i + 1}
                    />
                  ))}
                </div>
              </div>

              {/* Row 2 — three equal */}
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {row.map((p, i) => (
                  <ProjectCard
                    key={p.slug}
                    project={p}
                    variant="row"
                    index={i + 3}
                  />
                ))}
              </div>
            </>
          ) : (
            // Fewer than 6 — single row, equal columns
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {withUrls.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  variant="row"
                  index={i}
                />
              ))}
            </div>
          )}

          <div className="mt-12 md:mt-16 flex justify-center">
            <Link
              to="/work"
              className="eyebrow !text-cedar hover:!text-cedar-hover transition-colors duration-300 group/link inline-flex items-center gap-2 min-h-[44px] py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
            >
              <span>See all work</span>
              <ArrowRight
                className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform duration-300"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
