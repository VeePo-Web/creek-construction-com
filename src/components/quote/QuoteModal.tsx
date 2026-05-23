import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Check,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { CONTACT } from "@/config/contact";
import { SERVICE_GROUPS, SERVICE_ITEMS, getItemsForGroup } from "@/config/services";
import { useQuoteModal } from "./QuoteModalProvider";
import logo from "@/assets/creek-logo-nav-sm.png";

/**
 * QuoteModal — single-screen, conversion-optimized quote form.
 *
 * Design intent (Temu-translated for premium editorial):
 *   1. One screen, no step counter — services + details + CTA visible.
 *   2. Two genuinely required fields: name + 10-digit phone. Email,
 *      address, and project details are optional.
 *   3. Live phone-validation checkmark for instant micro-feedback.
 *   4. CTA copy names the outcome ("Get my free quote →") or the
 *      missing field ("Add your phone to continue").
 *   5. Trust micro-strip immediately above the CTA.
 *   6. Property type and contact preference removed from the UI and sent
 *      as defaults — six fewer taps without sacrificing lead quality.
 *
 * Express mode: when `preselectedServices.length === 1`, the modal opens
 * with that service already selected and focus on the phone field.
 */

const quotePayloadSchema = z.object({
  name: z.string().trim().min(2, "Add your full name.").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length === 10, "Add a 10-digit phone number."),
  email: z
    .string()
    .trim()
    .max(255)
    .email("That email doesn’t look right.")
    .optional()
    .or(z.literal("")),
  addressOrArea: z.string().trim().max(255).optional().or(z.literal("")),
  projectDetails: z.string().trim().max(2000).optional().or(z.literal("")),
  services: z.array(z.string().max(80)).max(20),
  propertyType: z.string().max(60).optional(),
  timeline: z.string().max(60).optional(),
  contactPreference: z.enum(["call", "text", "email"]),
  voucher: z.string().max(80).optional(),
});

type Mode = "quote" | "inquiry";

const GENERAL_ID = "general";

interface FormState {
  services: string[];
  projectDetails: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  addressOrArea: string;
  voucher: string;
}

const INITIAL: FormState = {
  services: [],
  projectDetails: "",
  timeline: "Within 1 month",
  name: "",
  phone: "",
  email: "",
  addressOrArea: "",
  voucher: "pg2026",
};

const TIMELINE_OPTIONS = ["ASAP", "Within 1 month", "Just exploring"] as const;

function formatPhone(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length > 0) return `(${d}`;
  return "";
}

const QuoteModal = () => {
  const { open, preselectedServices, closeModal } = useQuoteModal();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const mode: Mode = form.services.includes(GENERAL_ID) ? "inquiry" : "quote";

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const doneBtnRef = useRef<HTMLButtonElement | null>(null);

  // Reset on each open. Express mode (single preselection) just lands you
  // on the same screen with that chip ticked and focus on the phone.
  useEffect(() => {
    if (open) {
      setSuccess(false);
      setTouched({});
      const pre = preselectedServices.includes(GENERAL_ID)
        ? [GENERAL_ID]
        : preselectedServices;
      setForm({ ...INITIAL, services: pre });
    }
  }, [open, preselectedServices]);

  // Autofocus: phone first (highest-conversion field). On success → Done.
  useEffect(() => {
    if (!open) return;
    if (success) {
      const t = setTimeout(() => doneBtnRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => phoneRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open, success]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const markTouched = (field: string) =>
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));

  const toggleService = (id: string) =>
    setForm((prev) => {
      if (id === GENERAL_ID) {
        return prev.services.includes(GENERAL_ID)
          ? { ...prev, services: [] }
          : { ...prev, services: [GENERAL_ID] };
      }
      const withoutGeneral = prev.services.filter((s) => s !== GENERAL_ID);
      return {
        ...prev,
        services: withoutGeneral.includes(id)
          ? withoutGeneral.filter((s) => s !== id)
          : [...withoutGeneral, id],
      };
    });

  // Validation
  const phoneDigits = form.phone.replace(/\D/g, "").length;
  const phoneValid = phoneDigits === 10;
  const nameValid = form.name.trim().length > 1;
  const emailValid =
    !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const canSubmit = nameValid && phoneValid && emailValid && !submitting;

  // Dynamic header copy — names the user's progress in plain words.
  const selectedItems = useMemo(
    () => SERVICE_ITEMS.filter((s) => form.services.includes(s.id)),
    [form.services],
  );
  const headerLine = useMemo(() => {
    if (mode === "inquiry") return "We typically reply within a few hours.";
    if (selectedItems.length === 0) return "Free quote in 24 hours. No obligation.";
    if (selectedItems.length === 1)
      return `Quoting your ${selectedItems[0].title.toLowerCase()}. Takes 30 seconds.`;
    return `Quoting ${selectedItems.length} services. Takes 30 seconds.`;
  }, [selectedItems, mode]);

  // CTA copy — names the outcome or the missing field.
  const ctaLabel = useMemo(() => {
    if (submitting) return "Sending…";
    if (!phoneValid)
      return phoneDigits === 0 ? "Add your phone to continue" : "Finish your phone number";
    if (!nameValid) return "Add your name to continue";
    if (!emailValid) return "Check your email address";
    return mode === "inquiry" ? "Send my message" : "Get my free quote";
  }, [submitting, phoneValid, phoneDigits, nameValid, emailValid, mode]);

  const handleSubmit = () => {
    if (!canSubmit) {
      setTouched({ name: true, phone: true, email: true });
      if (!phoneValid) phoneRef.current?.focus();
      else if (!nameValid) nameRef.current?.focus();
      return;
    }

    const isInquiry = mode === "inquiry";
    const serviceTitles = isInquiry
      ? ["General inquiry"]
      : selectedItems.map((s) => s.title);

    const detailsBody = form.projectDetails.trim();
    const projectDetails = isInquiry
      ? detailsBody
        ? `[General Inquiry] ${detailsBody}`
        : "[General Inquiry]"
      : detailsBody || undefined;
    const voucherValue = form.voucher.trim();

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      addressOrArea: form.addressOrArea.trim() || undefined,
      services: serviceTitles,
      projectDetails,
      propertyType: isInquiry ? undefined : "Residential",
      timeline: form.timeline,
      contactPreference: "call" as const,
      voucher: voucherValue || undefined,
    };

    const parsed = quotePayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Please check the form and try again.";
      toast.error("Can’t send yet", { description: first });
      return;
    }

    // Optimistic UI: flip to success instantly, fire request in background.
    setSuccess(true);
    void supabase.functions
      .invoke("submit-quote-request", { body: parsed.data })
      .then(({ data, error }) => {
        if (error || !data?.ok) {
          const msg =
            error?.message || (data as { error?: string })?.error || "Please try again.";
          setSuccess(false);
          toast.error("Something went wrong", {
            description: `${msg} Or call ${CONTACT.phone}.`,
          });
        }
      })
      .catch((err) => {
        console.error("[QuoteModal] submit failed", err);
        setSuccess(false);
        toast.error("Network error", {
          description: `We couldn’t reach the server. Please try again or call ${CONTACT.phone}.`,
        });
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isTextarea =
      (e.target as HTMLElement)?.tagName?.toLowerCase() === "textarea";
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (canSubmit) handleSubmit();
    } else if (e.key === "Enter" && !isTextarea && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetForAnother = () => {
    setForm(INITIAL);
    setSuccess(false);
    setTouched({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) closeModal();
      }}
    >
      <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 overflow-hidden border-evergreen/20 bg-background sm:rounded-lg max-h-[92vh] grid-cols-1 md:grid-cols-[240px_1fr] md:grid">
        <DialogTitle className="sr-only">
          {mode === "inquiry"
            ? "Send us a message — Creek Construction"
            : "Request a free quote — Creek Construction"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Tell us about your project and we’ll be in touch within 24 hours.
        </DialogDescription>

        {/* LEFT — desktop brand panel */}
        <aside
          className="hidden md:flex flex-col justify-between bg-evergreen text-evergreen-foreground p-6 relative overflow-hidden"
          aria-label="Creek Construction"
        >
          <div className="relative z-10">
            <img
              src={logo}
              alt="Creek Construction"
              width={200}
              height={200}
              className="h-20 w-auto object-contain mb-5 drop-shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]"
              loading="eager"
            />
            <p className="eyebrow-base text-cedar/80 mb-3">
              Free · No obligation
            </p>
            <h2 className="font-serif text-xl leading-tight mb-3">
              A real quote, in 24 hours.
            </h2>
            <p className="text-sm text-evergreen-foreground/70 leading-relaxed">
              Calgary, Edmonton & surrounding Alberta. We quote what we’ll actually charge.
            </p>
          </div>

          <div className="relative z-10 mt-6 space-y-3 text-sm">
            <div className="w-12 h-px bg-cedar/40 mb-3" />
            <div className="flex items-center gap-2 text-cedar">
              <Star className="h-3 w-3 fill-cedar" aria-hidden />
              <Star className="h-3 w-3 fill-cedar" aria-hidden />
              <Star className="h-3 w-3 fill-cedar" aria-hidden />
              <Star className="h-3 w-3 fill-cedar" aria-hidden />
              <Star className="h-3 w-3 fill-cedar" aria-hidden />
              <span className="eyebrow-base text-evergreen-foreground/70 ml-1">
                Verified builds
              </span>
            </div>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="flex items-center gap-3 text-evergreen-foreground/80 hover:text-cedar transition-colors min-h-[40px]"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              <span>{CONTACT.phone}</span>
            </a>
          </div>
        </aside>

        {/* Slim mobile brand strip */}
        <div className="md:hidden bg-evergreen text-evergreen-foreground px-5 py-2.5 flex items-center gap-2.5">
          <img src={logo} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <p className="font-serif text-sm leading-none">Creek Construction</p>
          <span className="ml-auto eyebrow-base text-cedar/80">
            Free Quote
          </span>
        </div>

        {/* RIGHT — single-screen form */}
        <div
          className="flex flex-col overflow-y-auto max-h-[92vh] md:max-h-[92vh] relative"
          onKeyDown={handleKeyDown}
        >
          {success ? (
            <SuccessPanel
              mode={mode}
              onClose={closeModal}
              onSendAnother={resetForAnother}
              doneBtnRef={doneBtnRef}
            />
          ) : (
            <>
              {/* Header — dynamic line replaces step counter */}
              <header className="px-6 md:px-8 pt-6 md:pt-7 pb-4">
                <p className="eyebrow-base text-cedar mb-2">
                  {mode === "inquiry" ? "Send us a message" : "Free quote"}
                </p>
                <h3
                  className="font-serif text-2xl md:text-[28px] text-foreground leading-tight"
                  aria-live="polite"
                >
                  {headerLine}
                </h3>
              </header>

              <div className="px-6 md:px-8 pb-6 flex-1 space-y-6">
                {/* CONTACT BLOCK FIRST — phone is the conversion-critical field */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field
                    label="Phone"
                    htmlFor="qm-phone"
                    required
                    error={
                      touched.phone && !phoneValid
                        ? phoneDigits === 0
                          ? "Phone number is required."
                          : `${10 - phoneDigits} digit${10 - phoneDigits === 1 ? "" : "s"} to go.`
                        : undefined
                    }
                    adornment={
                      phoneValid ? (
                        <span className="inline-flex items-center gap-1 eyebrow-base text-cedar">
                          <Check className="h-3 w-3" aria-hidden /> Ready
                        </span>
                      ) : null
                    }
                  >
                    <Input
                      id="qm-phone"
                      ref={phoneRef}
                      type="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={(v) => update("phone", formatPhone(v))}
                      onBlur={() => markTouched("phone")}
                      placeholder="(403) 555-0123"
                      autoComplete="tel"
                      invalid={touched.phone && !phoneValid}
                    />
                  </Field>
                  <Field
                    label="Name"
                    htmlFor="qm-name"
                    required
                    error={touched.name && !nameValid ? "Add your name." : undefined}
                  >
                    <Input
                      id="qm-name"
                      ref={nameRef}
                      value={form.name}
                      onChange={(v) => update("name", v)}
                      onBlur={() => markTouched("name")}
                      placeholder="Jane Doe"
                      maxLength={120}
                      autoComplete="name"
                      invalid={touched.name && !nameValid}
                    />
                  </Field>
                </div>

                {/* Optional contact details — collapsed visual weight */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field
                    label="Email"
                    htmlFor="qm-email"
                    optional
                    error={touched.email && !emailValid ? "That email doesn’t look right." : undefined}
                  >
                    <Input
                      id="qm-email"
                      type="email"
                      inputMode="email"
                      value={form.email}
                      onChange={(v) => update("email", v)}
                      onBlur={() => markTouched("email")}
                      placeholder="you@example.com"
                      maxLength={255}
                      autoComplete="email"
                      invalid={touched.email && !emailValid}
                    />
                  </Field>
                  <Field label="City or area" htmlFor="qm-area" optional>
                    <Input
                      id="qm-area"
                      value={form.addressOrArea}
                      onChange={(v) => update("addressOrArea", v)}
                      placeholder="e.g. Calgary NW"
                      maxLength={255}
                      autoComplete="address-level2"
                    />
                  </Field>
                </div>

                {/* SERVICES — chip picker, grouped */}
                {mode === "quote" && (
                  <div>
                    <p className="eyebrow-base text-muted-foreground mb-3">
                      What do you need? <span className="text-muted-foreground/60 normal-case tracking-normal">— pick any</span>
                    </p>
                    <div className="space-y-3">
                      {SERVICE_GROUPS.map((group) => {
                        const items = getItemsForGroup(group.id);
                        return (
                          <div key={group.id}>
                            <p className="eyebrow-base text-cedar/70 mb-1.5">
                              {group.title}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((s) => {
                                const isSelected = form.services.includes(s.id);
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => toggleService(s.id)}
                                    aria-pressed={isSelected}
                                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] border text-xs transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-1 ${
                                      isSelected
                                        ? "border-cedar bg-cedar/[0.08] text-foreground"
                                        : "border-border text-muted-foreground hover:border-cedar/50 hover:text-foreground hover:bg-cedar/[0.02]"
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 text-cedar" aria-hidden />}
                                    {s.title}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Timeline — segmented, 3 options, defaults to "Within 1 month" */}
                {mode === "quote" && (
                  <div>
                    <p className="eyebrow-base text-muted-foreground mb-2">
                      When?
                    </p>
                    <div className="grid grid-cols-3 gap-1.5" role="radiogroup">
                      {TIMELINE_OPTIONS.map((t) => {
                        const active = form.timeline === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => update("timeline", t)}
                            className={`px-2 py-2.5 rounded-[2px] border text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-1 ${
                              active
                                ? "border-cedar bg-cedar/[0.08] text-foreground"
                                : "border-border text-muted-foreground hover:border-cedar/50"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Project details — optional, encouraged */}
                <Field
                  label={mode === "inquiry" ? "How can we help?" : "Anything we should know?"}
                  htmlFor="qm-details"
                  optional
                >
                  <textarea
                    id="qm-details"
                    value={form.projectDetails}
                    onChange={(e) => update("projectDetails", e.target.value)}
                    rows={2}
                    maxLength={2000}
                    placeholder={
                      mode === "inquiry"
                        ? "e.g. Wondering about pricing for a 200 ft fence in Cochrane."
                        : "e.g. 14×20 cedar deck, replacing a worn pressure-treated one."
                    }
                    className="w-full rounded-[2px] border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-cedar focus:ring-1 focus:ring-cedar/30 transition-colors resize-none"
                  />
                </Field>

                {/* Voucher / referral — optional, last field */}
                <Field label="Voucher or referral code (10% off)" htmlFor="qm-voucher" optional>
                  <input
                    id="qm-voucher"
                    type="text"
                    value={form.voucher}
                    onChange={(e) => update("voucher", e.target.value)}
                    maxLength={80}
                    autoComplete="off"
                    className="w-full rounded-[2px] border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground/60 italic focus:text-foreground focus:not-italic focus:outline-none focus:border-cedar focus:ring-1 focus:ring-cedar/30 transition-colors"
                  />
                </Field>

                {/* Quiet inquiry-mode escape hatch */}
                {mode === "quote" && (
                  <button
                    type="button"
                    onClick={() => toggleService(GENERAL_ID)}
                    className="text-xs text-muted-foreground hover:text-cedar transition-colors underline-offset-4 hover:underline"
                  >
                    Just have a question? Send a message instead.
                  </button>
                )}
                {mode === "inquiry" && (
                  <button
                    type="button"
                    onClick={() => toggleService(GENERAL_ID)}
                    className="text-xs text-muted-foreground hover:text-cedar transition-colors underline-offset-4 hover:underline"
                  >
                    ← Back to quote request
                  </button>
                )}
              </div>

              {/* Trust micro-strip + CTA */}
              <footer
                className="sticky bottom-0 z-10 bg-muted border-t border-border/40"
                style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
              >
                <div className="px-6 md:px-8 py-2 flex items-center justify-center gap-4 eyebrow-base text-muted-foreground border-b border-border/30">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-cedar text-cedar" aria-hidden />
                    Verified
                  </span>
                  <span className="text-border" aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-cedar" aria-hidden />
                    24-hour reply
                  </span>
                  <span className="text-border" aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-cedar" aria-hidden />
                    No obligation
                  </span>
                </div>
                <div className="px-6 md:px-8 py-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    aria-label={ctaLabel}
                    className="w-full inline-flex items-center justify-center gap-2 bg-cedar text-cedar-foreground px-6 py-3.5 rounded-[2px] cta-label hover:bg-cedar-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[52px]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending
                      </>
                    ) : (
                      <>
                        {ctaLabel}
                        {canSubmit && <ArrowRight className="h-4 w-4" aria-hidden />}
                      </>
                    )}
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({
  label,
  htmlFor,
  required,
  optional,
  error,
  adornment,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  adornment?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5 min-h-[16px]">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground"
      >
        {label}
        {required && <span className="text-cedar ml-1">*</span>}
        {optional && (
          <span className="text-muted-foreground/50 ml-1.5 normal-case tracking-normal text-[10px]">
            optional
          </span>
        )}
      </label>
      {adornment}
    </div>
    {children}
    {error && (
      <p className="text-xs text-destructive mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, value, onChange, invalid, className, ...rest }, ref) => (
    <input
      id={id}
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid || undefined}
      {...rest}
      className={`w-full rounded-[2px] border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors min-h-[44px] ${
        invalid
          ? "border-destructive/60 focus:border-destructive focus:ring-destructive/30"
          : "border-border focus:border-cedar focus:ring-cedar/30"
      } ${className ?? ""}`}
    />
  ),
);
Input.displayName = "QuoteModalInput";

const SuccessPanel = ({
  mode,
  onClose,
  onSendAnother,
  doneBtnRef,
}: {
  mode: Mode;
  onClose: () => void;
  onSendAnother: () => void;
  doneBtnRef: React.RefObject<HTMLButtonElement>;
}) => (
  <div className="px-6 md:px-12 py-12 md:py-16 text-center flex-1 flex flex-col items-center justify-center">
    <div className="w-16 h-16 rounded-full bg-cedar/10 border-2 border-cedar/30 flex items-center justify-center mb-6">
      <Check className="h-7 w-7 text-cedar" aria-hidden />
    </div>
    <h3 className="font-serif text-3xl text-foreground mb-3">
      {mode === "inquiry" ? "Message received." : "We’ve got it."}
    </h3>
    <p className="text-muted-foreground max-w-md mb-2">
      {mode === "inquiry"
        ? "Thanks — we’ll review and reach out within 24 hours."
        : "Thanks — we’ll review your project and reach out within 24 hours."}
    </p>
    <p className="text-sm text-muted-foreground/70 mb-8">
      We typically respond within 4 hours during business days.
    </p>
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <a
        href={`tel:${CONTACT.phoneTel}`}
        className="inline-flex items-center gap-2 bg-cedar text-cedar-foreground px-6 py-3 rounded-[2px] cta-label hover:bg-cedar-hover transition-colors min-h-[44px]"
      >
        <Phone className="h-3.5 w-3.5" aria-hidden /> Call us now
      </a>
      <button
        type="button"
        ref={doneBtnRef}
        onClick={onClose}
        className="bg-evergreen text-evergreen-foreground px-6 py-3 rounded-[2px] cta-label hover:bg-evergreen/90 transition-colors min-h-[44px]"
      >
        Done
      </button>
      <button
        type="button"
        onClick={onSendAnother}
        className="cta-label text-muted-foreground hover:text-cedar transition-colors min-h-[44px] px-2"
      >
        Send another →
      </button>
    </div>
  </div>
);

export default QuoteModal;
