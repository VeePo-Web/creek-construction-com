import NavigationMinimal from "@/components/navigation/NavigationMinimal";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import QuoteFormInline from "@/components/quote/QuoteFormInline";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { bronzeStep } from "@/lib/colors";
import { MAX_WIDTH } from "@/lib/spacing";

/**
 * Contact — single-screen conversion page.
 *
 * FlexServices-style funnel discipline: stripped chrome (no nav, no
 * section rail, no GlobalMenu), the form embedded directly into the
 * hero zone, and a single MiniFaq below for objection-killing.
 *
 * Layout:
 *   NavigationMinimal (logo + phone)
 *   PageHero-equivalent: 2-column — info card LEFT, QuoteFormInline RIGHT
 *   MiniFaq (no phone fallback duplicate — already in nav and info card)
 *   Footer
 */
const Contact = () => {
  useDocumentTitle(
    "Contact",
    `Get in touch with Creek Construction — call ${CONTACT.phone} or email ${CONTACT.email}. Free quotes across Calgary, Edmonton, and surrounding Alberta.`,
  );

  const ROW_COUNT = 3;

  return (
    <main className="min-h-screen bg-background" aria-label="Contact — Creek Construction">
      <NavigationMinimal />
      <SkipToContent target="section-contact" />

      <section
        id="section-contact"
        className="pt-10 sm:pt-14 md:pt-20 pb-20 md:pb-28"
        aria-labelledby="contact-heading"
      >
        <div className="container mx-auto px-5 sm:px-6">
          <div className={`${MAX_WIDTH.wide} mx-auto`}>
            {/* Headline strip */}
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <p className="text-[10px] tracking-[0.25em] uppercase text-cedar mb-4">
                FREE QUOTE
              </p>
              <h1
                id="contact-heading"
                className="font-serif text-[32px] sm:text-4xl md:text-[44px] lg:text-[56px] text-foreground leading-[1.05] lg:leading-[1.02] tracking-[-0.025em] text-pretty"
              >
                Tell us what you’re building.
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                Free written quote within 24–48 hours. We quote what we’ll actually charge.
              </p>
            </div>

            <div className="grid lg:grid-cols-[5fr_7fr] gap-10 md:gap-12 lg:gap-16 items-start">
              {/* LEFT — direct contact card */}
              <div>
                <SectionHeader
                  label="DIRECT LINE"
                  headingId="direct-heading"
                  heading="Reach us directly."
                  subheading="The fastest way is the phone."
                  disableMotion
                />

                <aside
                  className="mt-8 rounded-sm border border-border/40 grain-texture overflow-hidden"
                  style={{ borderLeft: `2px solid hsl(var(--cedar) / ${bronzeStep(0, ROW_COUNT)})` }}
                  aria-label="Direct contact details"
                >
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    className="flex items-center gap-4 px-5 py-5 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-sm bg-cedar/10 flex items-center justify-center">
                      <Phone className="h-3.5 w-3.5 text-cedar" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Call or Text · Reply in 24–48&nbsp;hours</p>
                      <p className="text-foreground font-medium group-hover/row:text-cedar transition-colors duration-200">
                        {CONTACT.phone}
                      </p>
                    </div>
                  </a>

                  <div className="border-t border-border/30" aria-hidden />

                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-4 px-5 py-5 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-sm bg-cedar/10 flex items-center justify-center">
                      <Mail className="h-3.5 w-3.5 text-cedar" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Email</p>
                      <p className="text-foreground font-medium group-hover/row:text-cedar transition-colors duration-200 truncate">
                        {CONTACT.email}
                      </p>
                    </div>
                  </a>

                  <div className="border-t border-border/30" aria-hidden />

                  <div className="flex items-start gap-4 px-5 py-5">
                    <div className="shrink-0 w-9 h-9 rounded-sm bg-cedar/10 flex items-center justify-center">
                      <MapPin className="h-3.5 w-3.5 text-cedar" aria-hidden />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">Service Areas</p>
                      <p className="text-foreground font-medium">Calgary, Edmonton &amp; surrounding Alberta</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Including {CONTACT.cities.slice(0, 3).join(", ")} + more towns
                      </p>
                    </div>
                  </div>
                </aside>
              </div>

              {/* RIGHT — the actual form */}
              <div>
                <SectionHeader
                  label="OR FILL THIS OUT"
                  headingId="form-heading"
                  heading="It takes about 30 seconds."
                  subheading="Phone and name are all we strictly need."
                  disableMotion
                />
                <div className="mt-8">
                  <QuoteFormInline />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
