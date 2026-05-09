import { forwardRef, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Loader2, Phone, ShieldCheck, Star, Clock } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { CONTACT } from "@/config/contact";
import { SERVICE_GROUPS, SERVICE_ITEMS, getItemsForGroup } from "@/config/services";

/**
 * QuoteFormInline — the actual lead-capture form, embeddable anywhere.
 *
 * Lives independently of the QuoteModal Dialog so the same form can be:
 *   - Inlined on /contact (no clicks-to-open)
 *   - Inlined on the homepage (above-the-fold conversion path)
 *
 * Same Supabase edge-function endpoint as the modal, same validation
 * schema, same trust micro-strip — just no Dialog wrapper, no brand
 * panel. Visual treatment matches the editorial system (cedar primary,
 * grain texture, no gradients, no urgency theatrics).
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
});

interface FormState {
  services: string[];
  projectDetails: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  addressOrArea: string;
}

const INITIAL: FormState = {
  services: [],
  projectDetails: "",
  timeline: "Within 1 month",
  name: "",
  phone: "",
  email: "",
  addressOrArea: "",
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

interface QuoteFormInlineProps {
  /** Compact treatment trims paddings and hides the timeline radio. */
  compact?: boolean;
  /** Label for the submit button when valid. Defaults to the brand CTA. */
  submitLabel?: string;
  /** Surface intended for placement; affects the form shell color. */
  surface?: "background" | "secondary";
  className?: string;
}

const QuoteFormInline = ({
  compact = false,
  submitLabel = "Get my free quote",
  surface = "background",
  className,
}: QuoteFormInlineProps) => {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const markTouched = (field: string) =>
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));

  const toggleService = (id: string) =>
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));

  const phoneDigits = form.phone.replace(/\D/g, "").length;
  const phoneValid = phoneDigits === 10;
  const nameValid = form.name.trim().length > 1;
  const emailValid = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canSubmit = nameValid && phoneValid && emailValid && !submitting;

  const selectedItems = useMemo(
    () => SERVICE_ITEMS.filter((s) => form.services.includes(s.id)),
    [form.services],
  );

  const ctaLabel = useMemo(() => {
    if (submitting) return "Sending…";
    if (!phoneValid)
      return phoneDigits === 0 ? "Add your phone to continue" : "Finish your phone number";
    if (!nameValid) return "Add your name to continue";
    if (!emailValid) return "Check your email address";
    return submitLabel;
  }, [submitting, phoneValid, phoneDigits, nameValid, emailValid, submitLabel]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setTouched({ name: true, phone: true, email: true });
      if (!phoneValid) phoneRef.current?.focus();
      else if (!nameValid) nameRef.current?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const serviceTitles = selectedItems.map((s) => s.title);
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        addressOrArea: form.addressOrArea.trim() || undefined,
        services: serviceTitles,
        projectDetails: form.projectDetails.trim() || undefined,
        propertyType: "Residential",
        timeline: form.timeline,
        contactPreference: "call" as const,
      };

      const parsed = quotePayloadSchema.safeParse(payload);
      if (!parsed.success) {
        const first = parsed.error.issues[0]?.message ?? "Please check the form and try again.";
        toast.error("Can’t send yet", { description: first });
        return;
      }

      const { data, error } = await supabase.functions.invoke("submit-quote-request", {
        body: parsed.data,
      });
      if (error || !data?.ok) {
        const msg = error?.message || (data as { error?: string })?.error || "Please try again.";
        toast.error("Something went wrong", {
          description: `${msg} Or call ${CONTACT.phone}.`,
        });
        return;
      }
      setSuccess(true);
    } catch (err) {
      console.error("[QuoteFormInline] submit failed", err);
      toast.error("Network error", {
        description: `We couldn’t reach the server. Please try again or call ${CONTACT.phone}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isTextarea = (e.target as HTMLElement)?.tagName?.toLowerCase() === "textarea";
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (canSubmit) handleSubmit();
    } else if (e.key === "Enter" && !isTextarea && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const shellBg = surface === "secondary" ? "bg-background" : "bg-secondary/40";
  const pad = compact ? "p-5 md:p-6" : "p-6 md:p-8";

  if (success) {
    return (
      <div
        className={`rounded-[6px] border border-cedar/15 border-l-[3px] border-l-cedar/40 grain-texture shadow-contact ${shellBg} ${pad} text-center ${className ?? ""}`}
        role="status"
        aria-live="polite"
      >
        <p className="font-serif text-2xl text-cedar tabular-nums mb-2">01</p>
        <h3 className="font-serif text-2xl text-foreground mb-2">We’ve got it.</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Thanks — we’ll review your project and reach out within 24 hours.
        </p>
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="inline-flex items-center gap-2 bg-cedar text-cedar-foreground px-5 py-3 rounded-[6px] text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-cedar-hover transition-colors min-h-[44px] tabular-nums shadow-[0_1px_2px_hsl(var(--cedar)/0.20),0_8px_24px_-8px_hsl(var(--cedar)/0.30)]"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden /> Call us now
        </a>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[6px] border border-cedar/15 border-l-[3px] border-l-cedar/40 grain-texture shadow-contact ${shellBg} ${className ?? ""}`}
      onKeyDown={handleKeyDown}
    >
      <div className={pad}>
        <div className="space-y-6">
          {/* Phone first — conversion-critical */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Field
              label="Phone"
              htmlFor="qfi-phone"
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
                  <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-cedar">
                    <Check className="h-3 w-3" aria-hidden /> Ready
                  </span>
                ) : null
              }
            >
              <Input
                id="qfi-phone"
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
              htmlFor="qfi-name"
              required
              error={touched.name && !nameValid ? "Add your name." : undefined}
            >
              <Input
                id="qfi-name"
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

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Field
              label="Email"
              htmlFor="qfi-email"
              optional
              error={touched.email && !emailValid ? "That email doesn’t look right." : undefined}
            >
              <Input
                id="qfi-email"
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
            <Field label="City or area" htmlFor="qfi-area" optional>
              <Input
                id="qfi-area"
                value={form.addressOrArea}
                onChange={(v) => update("addressOrArea", v)}
                placeholder="e.g. Calgary NW"
                maxLength={255}
                autoComplete="address-level2"
              />
            </Field>
          </div>

          {/* Services chips, grouped */}
          <div>
            <div className="mb-3">
              <BronzeRule width="short" label="WHAT DO YOU NEED?" variant="accent" />
              <p className="mt-1 text-[11px] text-muted-foreground/70">— pick any</p>
            </div>
            <div className="space-y-3">
              {SERVICE_GROUPS.map((group) => {
                const items = getItemsForGroup(group.id);
                return (
                  <div key={group.id}>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-cedar/70 mb-1.5">
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
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] border text-xs transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-1 ${
                              isSelected
                                ? "border-cedar/60 bg-cedar/[0.06] text-foreground shadow-[inset_0_-2px_0_hsl(var(--cedar))]"
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

          {!compact && (
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
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
                      className={`px-2 py-2.5 rounded-sm border text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-1 ${
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

          <Field label="Anything we should know?" htmlFor="qfi-details" optional>
            <textarea
              id="qfi-details"
              value={form.projectDetails}
              onChange={(e) => update("projectDetails", e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="e.g. 14×20 cedar deck, replacing a worn pressure-treated one."
              className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-cedar focus:ring-1 focus:ring-cedar/30 transition-colors resize-none"
            />
          </Field>
        </div>
      </div>

      {/* Trust micro-strip + CTA — same as the modal */}
      <div className="border-t border-border/40 bg-muted/40">
        <div className="px-6 md:px-8 py-2 flex items-center justify-center gap-4 text-[10px] tracking-[0.18em] uppercase text-muted-foreground border-b border-border/30 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-3 w-3 fill-cedar text-cedar" aria-hidden /> Verified
          </span>
          <span className="text-border" aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-cedar" aria-hidden /> 24-hour reply
          </span>
          <span className="text-border" aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-cedar" aria-hidden /> No obligation
          </span>
        </div>
        <div className="px-6 md:px-8 py-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-label={ctaLabel}
            data-quote-cta
            className="w-full inline-flex items-center justify-center gap-2 bg-cedar text-cedar-foreground px-6 py-3.5 rounded-sm text-[12px] tracking-[0.18em] uppercase font-medium hover:bg-cedar-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[52px]"
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
      </div>
    </div>
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
      className={`w-full rounded-sm border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors min-h-[44px] ${
        invalid
          ? "border-destructive/60 focus:border-destructive focus:ring-destructive/30"
          : "border-border focus:border-cedar focus:ring-cedar/30"
      } ${className ?? ""}`}
    />
  ),
);
Input.displayName = "QuoteFormInlineInput";

export default QuoteFormInline;
