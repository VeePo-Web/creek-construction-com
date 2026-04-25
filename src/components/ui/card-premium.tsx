import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * CardPremium — Premium material card component with depth, texture, and thermal glow
 * Variants: foundation (resting), interactive (hover depth), testimonial (glass), cta (thermal)
 */

const cardVariants = cva(
  "relative rounded-sm transition-all duration-500 grain-texture overflow-hidden",
  {
    variants: {
      variant: {
        foundation: [
          "bg-card border border-border/60",
          "shadow-contact",
          "hover:shadow-elevated hover:border-cedar/20",
          "hover:translate-y-[-2px]",
        ].join(" "),
        interactive: [
          "bg-card border border-border/50",
          "shadow-contact",
          "hover:shadow-elevated hover:border-cedar/25",
          "hover:translate-y-[-3px] hover:bg-cedar/[0.02]",
          "focus-within:shadow-elevated focus-within:border-cedar/30",
        ].join(" "),
        testimonial: [
          "bg-background/60 backdrop-blur-md border border-border/40",
          "shadow-contact",
          "hover:shadow-elevated hover:bg-background/75 hover:border-cedar/20",
        ].join(" "),
        cta: [
          "bg-gradient-to-br from-cedar/[0.06] to-cedar/[0.02]",
          "border border-cedar/20",
          "shadow-elevated",
          "hover:shadow-thermal hover:border-cedar/35",
          "hover:translate-y-[-4px]",
          "hover:from-cedar/[0.08] hover:to-cedar/[0.03]",
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
  ({ className, variant, accentIntensity = 0.5, style, children, ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...style,
          ["--accent-intensity" as string]: accentIntensity,
        }}
        {...props}
      >
        {/* Flashlight radial gradient effect */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--cedar) / 0.08), transparent 40%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 h-full w-full flex flex-col">
          {children}
        </div>
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
    className={cn("text-architectural-premium text-2xl leading-tight", className)}
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
