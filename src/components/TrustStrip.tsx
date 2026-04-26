/**
 * TrustStrip — single-line editorial byline beneath the hero.
 *
 * The previous icon-grid duplicated the hero's TrustChips. This is now
 * a hairline of small-caps type — a press-credit byline, not a second
 * trust band. Discipline: the hero already says it; this just signs it.
 */
const TrustStrip = () => {
  return (
    <section
      aria-label="Credentials"
      className="bg-secondary"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 88px" }}
    >
      <div className="container mx-auto px-6 py-5 md:py-6">
        <p className="text-center text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-foreground/55 font-light">
          <span className="whitespace-nowrap">WCB Covered</span>
          <span aria-hidden className="mx-2 md:mx-3 text-cedar/40">·</span>
          <span className="whitespace-nowrap">Fully Insured</span>
          <span aria-hidden className="mx-2 md:mx-3 text-cedar/40">·</span>
          <span className="whitespace-nowrap">Locally Owned</span>
          <span aria-hidden className="mx-2 md:mx-3 text-cedar/40 hidden sm:inline">·</span>
          <span className="whitespace-nowrap hidden sm:inline">Calgary + Edmonton</span>
          <span aria-hidden className="mx-2 md:mx-3 text-cedar/40 hidden md:inline">·</span>
          <span className="whitespace-nowrap hidden md:inline">Free Estimates</span>
        </p>
      </div>
    </section>
  );
};

export default TrustStrip;
