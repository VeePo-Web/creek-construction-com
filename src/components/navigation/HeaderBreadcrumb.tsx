import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRouteBreadcrumb } from "@/lib/route-meta";

interface HeaderBreadcrumbProps {
  className?: string;
}

/**
 * HeaderBreadcrumb — a small chip that lives inside the header and
 * tells the user which sub-page they're on. Replaces the floating
 * breadcrumb that used to sit on top of hero photos.
 *
 *   [← Services]
 *
 * Renders nothing on routes that aren't sub-pages (e.g. `/`).
 */
const HeaderBreadcrumb = ({ className }: HeaderBreadcrumbProps) => {
  const { pathname } = useLocation();
  const meta = getRouteBreadcrumb(pathname);
  if (!meta) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("hidden md:flex items-center", className)}>
      <Link
        to="/"
        className={cn(
          "group/back inline-flex items-center gap-1.5 px-2.5 py-2 rounded-sm",
          "text-[10px] tracking-[0.22em] uppercase font-medium",
          "text-foreground/55 hover:text-cedar transition-colors duration-300",
          "min-h-[44px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
        )}
      >
        <ChevronLeft
          className="h-3 w-3 -translate-x-0 group-hover/back:-translate-x-0.5 transition-transform duration-300"
          aria-hidden
        />
        <span className="text-cedar/55 group-hover/back:text-cedar transition-colors">
          {meta.parent}
        </span>
        <span aria-hidden className="text-foreground/25 mx-0.5">/</span>
        <span className="text-cedar">{meta.label}</span>
      </Link>
    </nav>
  );
};

export default HeaderBreadcrumb;
