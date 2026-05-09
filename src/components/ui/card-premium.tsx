import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * CardPremium — Pass 34 calm sweep.
 * Variants collapse to flat surfaces with optional .hairline framing.
 * The legacy variant names (foundation/interactive/testimonial/cta) are
 * preserved for backwards compatibility but all resolve to restrained
 * editorial treatments — no grain, no shadow, no gradient.
 */

const cardVariants = cva(
  "relative transition-[background-color,border-color] duration-300",
  {
    variants: {
      variant: {
        foundation: "bg-card",
        interactive: [
          "bg-card border-l-2 border-cedar/0",
          "hover:border-cedar hover:bg-cedar/[0.025]",
        ].join(" "),
        testimonial: "bg-secondary/40",
        cta: [
          "bg-secondary/60 border-l-2 border-cedar",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "foundation",
    },
  }
);

export interface CardPremiumProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  accentIntensity?: number;
}

const CardPremium = React.forwardRef<HTMLDivElement, CardPremiumProps>(
  ({ className, variant, accentIntensity: _ai, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        {...props}
      >
        <div className="relative h-full w-full flex flex-col">{children}</div>
      </div>
    );
  }
);
CardPremium.displayName = "CardPremium";

const CardPremiumHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardPremiumHeader.displayName = "CardPremiumHeader";

const CardPremiumTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-serif text-2xl leading-tight tracking-[-0.01em]", className)}
    {...props}
  />
));
CardPremiumTitle.displayName = "CardPremiumTitle";

const CardPremiumDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardPremiumDescription.displayName = "CardPremiumDescription";

const CardPremiumContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 flex-grow", className)} {...props} />
));
CardPremiumContent.displayName = "CardPremiumContent";

const CardPremiumFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 mt-auto", className)}
    {...props}
  />
));
CardPremiumFooter.displayName = "CardPremiumFooter";

export {
  CardPremium,
  CardPremiumHeader,
  CardPremiumTitle,
  CardPremiumDescription,
  CardPremiumContent,
  CardPremiumFooter,
};
