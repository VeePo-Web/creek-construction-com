import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

/**
 * FaqAccordion — flat editorial stack (Pass 34).
 * Items are separated by .hairline rules. No card chrome, no grain,
 * no background fill on open. Chevron is a typographic + → × glyph.
 */
const FaqAccordion = ({ items, className }: FaqAccordionProps) => {
  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      {items.map((f, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className={cn(
            "border-0 border-b border-cedar/12",
            i === 0 && "border-t border-cedar/12",
          )}
        >
          <AccordionTrigger
            className={cn(
              "group flex items-baseline justify-between gap-6 py-5 md:py-6",
              "text-left hover:no-underline focus-visible:ring-offset-background",
              "[&>svg]:hidden",
            )}
          >
            <span className="flex items-baseline gap-4 flex-1 min-w-0">
              <span className="eyebrow tabular-nums opacity-55 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-lg md:text-xl tracking-[-0.01em] text-foreground leading-snug">
                {f.q}
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "shrink-0 text-cedar/70 text-base leading-none",
                "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "group-data-[state=open]:rotate-45",
              )}
            >
              +
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pl-9 text-foreground/70 leading-relaxed max-w-[58ch]">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqAccordion;
