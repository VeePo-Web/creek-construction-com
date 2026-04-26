import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { bronzeStep } from "@/lib/colors";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

/**
 * FaqAccordion — wraps Radix Accordion with the bronze-step border treatment
 * baked in. Single source of truth for FAQ rendering across the site.
 */
const FaqAccordion = ({ items, className }: FaqAccordionProps) => {
  return (
    <Accordion type="single" collapsible className={cn("space-y-4", className)}>
      {items.map((f, i) => {
        const borderOp = 0.1 + (i / Math.max(items.length - 1, 1)) * 0.3;
        const accentOp = bronzeStep(i, items.length);
        return (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="grain-texture border px-6 transition-all duration-500 shadow-contact hover:shadow-elevated hover:border-cedar/30 data-[state=open]:border-cedar/40 data-[state=open]:bg-cedar/[0.03] rounded-sm bg-background"
            style={{
              borderColor: `hsl(var(--cedar) / ${borderOp})`,
              borderLeft: `3px solid hsl(var(--cedar) / ${accentOp})`,
            }}
          >
            <AccordionTrigger className="text-left text-base md:text-lg font-light text-foreground hover:no-underline py-5 hover:text-cedar transition-colors duration-500">
              <span className="flex items-center gap-4">
                <span className="text-[11px] tracking-[0.2em] text-cedar/40 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{f.q}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pl-10">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default FaqAccordion;
