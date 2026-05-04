interface SkipToContentProps {
  /** Section id to jump to (without the leading #). */
  target: string;
  /** Visible label. Defaults to "Skip to content". */
  label?: string;
}

/**
 * SkipToContent — sitewide accessible skip link.
 *
 * Lives off-screen until focused, then surfaces as a cedar pill in the
 * top-left so keyboard users can jump past the Navigation chrome straight
 * into the page's first content section. Same affordance on every page.
 */
const SkipToContent = ({ target, label = "Skip to content" }: SkipToContentProps) => (
  <a
    href={`#${target}`}
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
  >
    {label}
  </a>
);

export default SkipToContent;
