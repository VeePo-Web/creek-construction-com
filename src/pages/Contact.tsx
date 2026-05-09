import NavigationMinimal from "@/components/navigation/NavigationMinimal";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import BronzeRule from "@/components/ui/bronze-rule";
import QuoteFormInline from "@/components/quote/QuoteFormInline";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { bronzeStep } from "@/lib/colors";
import { MAX_WIDTH, SECTION_PADDING } from "@/lib/spacing";

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
    <main id="main-content" className="min-h-screen overflow-x-clip bg-background" aria-label="Contact — Creek Construction">
      <NavigationMinimal />
      <SkipToContent target="section-contact" />

      <section
        id="section-contact"
        className="pt-10 sm:pt-14 md:pt-20 pb-16 sm:pb-20 md:pb-24 lg:pb-28 xl:pb-32"
        aria-labelledby="contact-heading"
      >
        <div className="container mx-auto px-5 sm:px-6">
          <div className={`${MAX_WIDTH.wide} mx-auto`}>
            {/* Headline strip */}
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <div className="flex justify-center mb-4">
                <BronzeRule label="FREE QUOTE" />
              </div>
              <h1
                id="contact-heading"
                className="font-serif text-[32px] sm:text-4xl md:text-[44px] lg:text-[56px] xl:text-[64px] text-foreground leading-[1.05] lg:leading-[1.02] tracking-[-0.02em] text-pretty text-balance"
              >
                Tell us what you’re building.
              </h1>
              <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-[44ch] mx-auto text-balance">
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
                  className="mt-8 rounded-[6px] border border-border/40 grain-texture overflow-hidden"
                  style={{ borderLeft: `2px solid hsl(var(--cedar) / ${bronzeStep(0, ROW_COUNT)})` }}
                  aria-label="Direct contact details"
                >
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    className="flex items-center gap-4 px-5 py-5 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                  >
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-cedar" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/75">Call or Text · Reply in 24–48&nbsp;hours</p>
                      <p className="font-serif text-lg text-foreground group-hover/row:text-cedar transition-colors duration-200 tabular-nums">
                        {CONTACT.phone}
                      </p>
                    </div>
                  </a>

                  <div
                    className="border-t border-transparent"
                    aria-hidden
                    style={{
                      borderImage:
                        "linear-gradient(90deg, transparent 0%, hsl(var(--cedar) / 0.20) 50%, transparent 100%) 1",
                    }}
                  />

                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-4 px-5 py-5 min-h-[44px] hover:bg-cedar/[0.03] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-inset group/row"
                  >
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-cedar" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/75">Email</p>
                      <p className="text-foreground font-medium group-hover/row:text-cedar transition-colors duration-200 truncate">
                        {CONTACT.email}
                      </p>
                    </div>
                  </a>

                  <div
                    className="border-t border-transparent"
                    aria-hidden
                    style={{
                      borderImage:
                        "linear-gradient(90deg, transparent 0%, hsl(var(--cedar) / 0.20) 50%, transparent 100%) 1",
                    }}
                  />

                  <div className="flex items-start gap-4 px-5 py-5">
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-cedar" aria-hidden />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/75 mb-1">Service Areas</p>
                      <p className="text-foreground font-medium">Calgary, Edmonton &amp; surrounding Alberta</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Including {CONTACT.cities.slice(0, 3).join(", ")} — and the towns in between.
                      </p>
                    </div>
                  </div>
                </aside>

              {/* RIGHT — the actual form */}
              <div>
                <SectionHeader
                  label="THE FORM"
                  headingId="form-heading"
                  heading="Tell us a few details."
                  subheading="Just your phone and name to start."
                  disableMotion
                />
                <div className="mt-6 md:mt-8">
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
