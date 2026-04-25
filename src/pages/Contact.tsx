import { useState, useRef } from "react";
// Link used via CedarCTA
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import CedarCTA from "@/components/CedarCTA";
import { motion, AnimatePresence } from "framer-motion";
import ProgressiveImage from "@/components/ProgressiveImage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubPageHero from "@/components/SubPageHero";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { toast } from "sonner";
import saunaStonesContact from "@/assets/sauna-stones-steam.jpg";
import saunaStonesHero from "@/assets/sauna-stones-macro.jpg";

/* Accessible form field IDs */

/* Premium floating-label input */
const FloatingField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  id,
  inputRef,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  error?: string;
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const fieldId = id || `field-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="relative group/field">
      <label
        htmlFor={fieldId}
        className={`absolute left-4 pointer-events-none select-none ${
          active
            ? "top-1.5 text-[10px] tracking-[0.15em] uppercase text-cedar font-medium"
            : "top-3.5 text-sm text-muted-foreground/50"
        }`}
        style={{ transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {label}{required && <span className="text-cedar/60 ml-0.5">*</span>}
      </label>
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ""}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full px-4 pt-6 pb-2.5 border text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-cedar focus:shadow-[0_0_0_1px_hsl(28_50%_52%/0.15),0_0_16px_hsl(28_50%_52%/0.06),0_1px_6px_hsl(28_50%_52%/0.15)] transition-all duration-500 rounded-sm ${
          error ? 'border-destructive/60' : 'border-border'
        } ${focused ? 'bg-cedar/[0.02]' : 'bg-background'}`}
      />
      {error && (
        <p id={errorId} className="text-[11px] text-destructive/80 mt-1.5 pl-1" role="alert">
          {error}
        </p>
      )}
      {/* Completion indicator */}
      <div
        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-500 ${
          value.length > 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{ transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <Check className="h-3 w-3 text-cedar/60" aria-hidden="true" />
      </div>
      {/* Bottom warmth line */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] bg-cedar transition-all duration-500 rounded-full ${
          focused ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
};

/* Floating-label select */
const FloatingSelect = ({
  label,
  value,
  onChange,
  options,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id?: string;
}) => {
  const active = value.length > 0;
  const fieldId = id || `field-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return (
    <div className="relative group/field">
      <label
        htmlFor={fieldId}
        className={`absolute left-4 transition-all duration-300 pointer-events-none select-none z-[1] ${
          active
            ? "top-1.5 text-[10px] tracking-[0.15em] uppercase text-cedar font-medium"
            : "top-3.5 text-sm text-muted-foreground/50"
        }`}
      >
        {label}
      </label>
      <select
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 pt-6 pb-2.5 min-h-[44px] bg-background border border-border text-foreground focus:outline-none focus:border-cedar focus:shadow-[0_0_0_1px_hsl(28_50%_52%/0.15),0_0_16px_hsl(28_50%_52%/0.06)] transition-all duration-500 rounded-sm appearance-none cursor-pointer pr-10 ${
          !value ? "text-muted-foreground/40" : ""
        }`}
      >
        <option value="">{active ? "Select..." : ""}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
      {value && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cedar/60" />
      )}
    </div>
  );
};

/* Floating-label textarea */
const FloatingTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const fieldId = id || `field-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return (
    <div className="relative group/field">
      <label
        htmlFor={fieldId}
        className={`absolute left-4 pointer-events-none select-none z-[1] ${
          active
            ? "top-1.5 text-[10px] tracking-[0.15em] uppercase text-cedar font-medium"
            : "top-3.5 text-sm text-muted-foreground/50"
        }`}
        style={{ transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {label}
      </label>
      <textarea
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ""}
        className={`w-full px-4 pt-6 pb-2.5 border border-border text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-cedar focus:shadow-[0_0_0_1px_hsl(28_50%_52%/0.15),0_0_16px_hsl(28_50%_52%/0.06),0_1px_6px_hsl(28_50%_52%/0.15)] transition-all duration-500 rounded-sm min-h-24 resize-none ${focused ? 'bg-cedar/[0.02]' : 'bg-background'}`}
      />
      <div
        className={`absolute bottom-0 left-0 h-[2px] bg-cedar transition-all duration-500 rounded-full ${
          focused ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
};

const Contact = () => {
  useDocumentTitle("Get Your Sauna Plan", "Start your sauna journey with a free, no-obligation Sauna Plan — tailored to your property, timeline, and budget.");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", community: "",
    propertyType: "", timeline: "", interest: "", access: "", power: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const communities = [
    "Edmonton", "Sherwood Park", "Red Deer", "Calgary",
    "Cochrane", "Canmore", "Bragg Creek", "Other"
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error on change
    if (validationErrors[field]) {
      setValidationErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const handleSubmit = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fill in your name and email.");
      if (errors.name) nameRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      return;
    }
    setIsSubmitting(true);
    // Simulate network delay for polish UX
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  // Form completion progress
  const filledCount = [
    formData.name, formData.email, formData.community,
    formData.propertyType, formData.interest, formData.timeline,
  ].filter(Boolean).length;
  const completionPct = Math.round((filledCount / 6) * 100);



  return (
    <main className="min-h-screen bg-background" aria-label="Get Your Sauna Plan — B&P Sauna">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://bpsauna.ca/" },
        { name: "Your Sauna Plan", url: "https://bpsauna.ca/plan" },
      ]} />
      <Navigation transparent />

      <SubPageHero
        image={saunaStonesHero}
        imageAlt="Hands pouring water from a traditional wooden bucket onto hot sauna stones creating löyly steam"
        breadcrumbLabel="Your Plan"
        sectionLabel="START HERE"
        title="Get My Sauna Plan"
        subtitle="From first call to first session — handled."
        height="60vh"
        minHeight="420px"
        skipToId="plan-content"
      >
        <div className="flex items-center gap-3 mt-4">
          <div className="w-12 h-px bg-cedar/30" />
          <span className="text-[10px] tracking-[0.25em] text-white/30 uppercase">Free · No Obligation · Alberta Only</span>
        </div>
      </SubPageHero>

      {/* Trust steps + intro */}
      <section id="plan-content" className="pt-16 pb-8" aria-labelledby="plan-steps-heading" style={{ contain: 'layout style' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <h2 id="plan-steps-heading" className="sr-only">How the Sauna Plan Works</h2>
              <p className="text-subhead text-muted-foreground max-w-3xl mb-16">
                Tell us about your property. We'll send you a Sauna Plan — placement guidance,
                base/pad notes, electrical checklist, timeline, and next steps. No pressure.
              </p>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.1}>
              <div className="grid md:grid-cols-3 gap-8 max-w-3xl">
                {[
                  { num: "01", title: "We review your details", sub: "Within 24–48 hours", opacity: 0.2 },
                  { num: "02", title: "You receive your Sauna Plan", sub: "Placement, base, electrical, timeline", opacity: 0.5 },
                  { num: "03", title: "We walk through it together", sub: "No pressure, no obligation", opacity: 0.8 },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start space-x-3 pl-5 py-4 px-4 rounded-sm transition-all duration-500 hover:bg-cedar/[0.04] hover:shadow-elevated cursor-default group/trust grain-texture shadow-contact border border-border/40"
                    style={{ borderLeft: `2px solid hsl(28 50% 52% / ${step.opacity})` }}
                  >
                    <span className="text-cedar font-medium text-minimal mt-0.5">{step.num}</span>
                    <div>
                      <p className="text-foreground font-medium text-sm transition-colors duration-500 group-hover/trust:text-cedar">{step.title}</p>
                      <p className="text-muted-foreground text-sm">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      {/* Form / Success */}
      <section className="pb-32 relative grain-overlay" aria-label="Sauna plan request form" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1200px' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">II</span>
                <div className="w-8 h-px bg-cedar/20" />
                <span className="text-minimal text-muted-foreground">YOUR DETAILS</span>
              </div>
            </ScrollRevealMotion>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-2xl mx-auto text-center py-20"
                >
                  {/* Animated cedar ring */}
                  <div className="flex justify-center mb-10">
                    <motion.div
                      className="w-20 h-20 rounded-full border-2 border-cedar/30 flex items-center justify-center relative"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ boxShadow: '0 0 0 0 hsl(28 50% 52% / 0)' }}
                        animate={{ boxShadow: '0 0 30px 4px hsl(28 50% 52% / 0.15)' }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                      >
                        <Check className="h-8 w-8 text-cedar" aria-hidden="true" />
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.h2
                    className="text-headline text-foreground mb-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Plan Request Received
                  </motion.h2>
                  <motion.p
                    className="text-lg text-foreground/60 italic font-serif mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    We'll review your details within 24–48 hours.
                  </motion.p>
                  <motion.p
                    className="text-muted-foreground mb-12 max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    Your Sauna Plan — placement guidance, base/pad notes, electrical checklist,
                    and timeline — will be tailored to your property and sent to <span className="text-cedar">{formData.email}</span>.
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-center gap-4 mb-8"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    <div className="w-12 h-px bg-cedar/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
                    <div className="w-12 h-px bg-cedar/20" />
                  </motion.div>

                  <motion.p
                    className="text-sm font-serif italic text-foreground/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                  >
                    — B&P Sauna · Your ritual starts the day we install.
                  </motion.p>

                  <motion.div
                    className="mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                  >
                    <CedarCTA to="/" variant="secondary">BACK TO HOME</CedarCTA>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef as React.RefObject<HTMLFormElement>}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-5 gap-20"
                  onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                  noValidate
                >
                  <div className="md:col-span-3 space-y-6">
                    {/* Form progress indicator */}
                    <ScrollRevealMotion delay={0.05}>
                      <div className="flex items-center gap-4 mb-4">
                       <div className="flex-1 h-px bg-border relative overflow-hidden rounded-full" role="progressbar" aria-valuenow={completionPct} aria-valuemin={0} aria-valuemax={100} aria-label={`Form completion: ${completionPct}%`}>
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-cedar/50 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <span className="text-[10px] tracking-[0.2em] text-muted-foreground/50 tabular-nums min-w-[3ch]">
                          {completionPct}%
                        </span>
                      </div>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.1}>
                      <div className="grid md:grid-cols-2 gap-5">
                        <FloatingField label="Name" value={formData.name} onChange={(v) => handleChange("name", v)} required inputRef={nameRef} error={validationErrors.name} />
                        <FloatingField label="Email" value={formData.email} onChange={(v) => handleChange("email", v)} type="email" required inputRef={emailRef} error={validationErrors.email} />
                      </div>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.15}>
                      <div className="grid md:grid-cols-2 gap-5">
                        <FloatingField label="Phone (optional)" value={formData.phone} onChange={(v) => handleChange("phone", v)} type="tel" />
                        <FloatingSelect
                          label="City / Community"
                          value={formData.community}
                          onChange={(v) => handleChange("community", v)}
                          options={communities.map((c) => ({ value: c, label: c }))}
                        />
                      </div>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.2}>
                       <fieldset>
                        <legend className="text-minimal text-muted-foreground mb-3">PROPERTY TYPE</legend>
                        <div className="grid grid-cols-3 gap-3" role="group" aria-label="Property type selection">
                    {["Backyard", "Acreage", "Mountain"].map(type => (
                            <button key={type} type="button" onClick={() => handleChange("propertyType", type)}
                              aria-pressed={formData.propertyType === type}
                              className={`px-4 py-3.5 border text-sm rounded-sm transition-all duration-500 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
                                formData.propertyType === type
                                  ? "border-cedar bg-cedar text-cedar-foreground shadow-[0_0_16px_hsl(28_50%_52%/0.2)]"
                                  : "border-border text-muted-foreground hover:border-cedar/30 hover:text-foreground hover:bg-cedar/[0.02]"
                              }`}
                            >{type}</button>
                          ))}
                        </div>
                      </fieldset>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.25}>
                      <fieldset>
                        <legend className="text-minimal text-muted-foreground mb-3">INTEREST</legend>
                        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Interest selection">
                          {["Signature 8×8", "Custom Build"].map(type => (
                            <button key={type} type="button" onClick={() => handleChange("interest", type)}
                              aria-pressed={formData.interest === type}
                              className={`px-4 py-3.5 border text-sm rounded-sm transition-all duration-500 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
                                formData.interest === type
                                  ? "border-cedar bg-cedar text-cedar-foreground shadow-[0_0_16px_hsl(28_50%_52%/0.2)]"
                                  : "border-border text-muted-foreground hover:border-cedar/30 hover:text-foreground hover:bg-cedar/[0.02]"
                              }`}
                            >{type}</button>
                          ))}
                        </div>
                      </fieldset>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.3}>
                      <FloatingSelect
                        label="Timeline"
                        value={formData.timeline}
                        onChange={(v) => handleChange("timeline", v)}
                        options={[
                          { value: "asap", label: "As soon as possible" },
                          { value: "3months", label: "Within 3 months" },
                          { value: "6months", label: "Within 6 months" },
                          { value: "exploring", label: "Just exploring" },
                        ]}
                      />
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.35}>
                      <div className="relative">
                        <FloatingTextarea
                          label="Access constraints (optional)"
                          value={formData.access}
                          onChange={(v) => handleChange("access", v)}
                          placeholder="Gate width, slope, stairs, tight access — anything relevant"
                        />
                        {formData.access.length > 0 && (
                          <span className="absolute bottom-2 right-3 text-[10px] tabular-nums text-muted-foreground/30 transition-opacity duration-300">
                            {formData.access.length}
                          </span>
                        )}
                      </div>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.4}>
                      <div className="relative">
                        <FloatingTextarea
                          label="Power / panel info (optional)"
                          value={formData.power}
                          onChange={(v) => handleChange("power", v)}
                          placeholder="Panel amperage, available breaker slots, distance to sauna location"
                        />
                        {formData.power.length > 0 && (
                          <span className="absolute bottom-2 right-3 text-[10px] tabular-nums text-muted-foreground/30 transition-opacity duration-300">
                            {formData.power.length}
                          </span>
                        )}
                      </div>
                    </ScrollRevealMotion>

                     <ScrollRevealMotion delay={0.45}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        aria-label={isSubmitting ? "Submitting your sauna plan request" : "Submit sauna plan request"}
                        aria-busy={isSubmitting}
                        className={`w-full text-minimal bg-cedar text-cedar-foreground px-10 py-5 rounded-sm transition-all duration-500 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 group/submit flex items-center justify-center gap-3 ${
                          isSubmitting
                            ? 'opacity-70 pointer-events-none animate-pulse'
                            : 'hover:bg-cedar-hover active:scale-[0.98]'
                        }`}
                        style={{
                          boxShadow: completionPct >= 80
                            ? '0 0 24px hsl(28 50% 52% / 0.35), 0 4px 16px hsl(28 50% 52% / 0.2)'
                            : '0 0 16px hsl(28 50% 52% / 0.15), 0 2px 8px hsl(28 50% 52% / 0.1)',
                          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        <span>{isSubmitting ? 'SENDING\u2026' : 'SUBMIT \u2014 GET MY SAUNA PLAN'}</span>
                        {!isSubmitting && <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover/submit:translate-x-1" aria-hidden="true" />}
                      </button>
                    </ScrollRevealMotion>
                  </div>

                  {/* Sidebar */}
                  <div className="md:col-span-2 space-y-12 relative grain-overlay">
                    <ScrollRevealMotion delay={0.15}>
                      <ProgressiveImage
                        src={saunaStonesContact}
                        alt="Water poured over hot sauna stones creating löyly steam"
                        className="h-48 rounded-sm"
                        caption="The Löyly Moment — Water Meets Stone"
                      />
                    </ScrollRevealMotion>
                    <ScrollRevealMotion delay={0.2}>
                      <div>
                        <h3 className="text-minimal text-muted-foreground mb-6">WHAT YOU'LL RECEIVE</h3>
                        <p className="text-muted-foreground mb-4">Your Sauna Plan is a clear, branded document covering:</p>
                        <div className="space-y-4">
                          {[
                            "Recommended placement on your property",
                            "Base/pad guidance for your property type",
                            "Electrical notes for your electrician",
                            "Timeline and next steps",
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3 py-3 pl-4 px-3 transition-all duration-500 hover:bg-cedar/[0.04] hover:pl-5 cursor-default group/receive grain-texture shadow-contact border border-border/40 rounded-sm" style={{ borderLeft: `2px solid hsl(28 50% 52% / ${[0.15, 0.35, 0.55, 0.8][i]})` }}>
                              <span className="text-cedar mt-1 transition-opacity duration-500 opacity-60 group-hover/receive:opacity-100">—</span>
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.3}>
                      <div>
                        <h3 className="text-minimal text-muted-foreground mb-6">SERVICE AREAS</h3>
                        <div className="flex flex-wrap gap-2">
                          {communities.filter(c => c !== "Other").map((city, i) => (
                            <span key={city} className="text-sm text-muted-foreground border px-3 py-2 min-h-[44px] flex items-center rounded-sm transition-all duration-500 cursor-default hover:text-foreground hover:bg-cedar/[0.04] hover:border-cedar/50 grain-texture shadow-contact" style={{ borderColor: `hsl(28 50% 52% / ${0.08 + i * 0.06})` }}>
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>
                    </ScrollRevealMotion>

                    {/* Trust metrics */}
                    <ScrollRevealMotion delay={0.35}>
                      <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border">
                        <div className="group/trust cursor-default transition-all duration-500 hover:bg-cedar/[0.03] py-4 px-4 rounded-sm grain-texture shadow-contact border border-border/40">
                          <p className="text-2xl font-light text-architectural transition-all duration-500 group-hover/trust:text-cedar group-hover/trust:drop-shadow-[0_0_16px_hsl(28_50%_52%/0.2)]">24–48h</p>
                          <p className="text-xs text-muted-foreground mt-1">Response time</p>
                        </div>
                        <div className="group/trust cursor-default transition-all duration-500 hover:bg-cedar/[0.03] py-4 px-4 rounded-sm grain-texture shadow-contact border border-border/40">
                          <p className="text-2xl font-light text-architectural transition-all duration-500 group-hover/trust:text-cedar group-hover/trust:drop-shadow-[0_0_16px_hsl(28_50%_52%/0.2)]">$0</p>
                          <p className="text-xs text-muted-foreground mt-1">Plan cost. Always free.</p>
                        </div>
                      </div>
                    </ScrollRevealMotion>

                    <ScrollRevealMotion delay={0.4}>
                      <div className="border-t border-border pt-8">
                        <p className="text-sm font-serif italic text-foreground/30 mb-4">
                          {"\u201C"}Outdoor-only. Traditional heat. Installed turnkey.{"\u201D"}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                          One team sells, delivers, and installs. No trades to coordinate,
                          no project to manage. Alberta-built cedar saunas.
                        </p>
                        <p className="text-[9px] tracking-[0.2em] text-foreground/15 italic font-serif">
                          Est. Alberta · Crafted with Cedar & Intention
                        </p>
                      </div>
                    </ScrollRevealMotion>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
