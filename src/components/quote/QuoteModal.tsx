import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Mail,
  MessageCircleQuestion,
  MessageSquare,
  Pencil,
  Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CONTACT } from "@/config/contact";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "./QuoteModalProvider";
import logo from "@/assets/creek-logo-nav-sm.png";

/**
 * QuoteModal — two-step conversion form.
 *
 *   Step 1: pick service(s) — skipped entirely when caller preselects one.
 *   Step 2: project details + contact (collapsed from former 3-step flow).
 *
 * Express mode: when `preselectedServices.length === 1`, the modal opens
 * directly on Step 2 with an editable service chip at the top.
 *
 * Submission: Enter inside any text input (not textarea) submits when
 * the form is valid; Cmd/Ctrl+Enter still works as a power-user shortcut.
 */

type Step = 1 | 2;
type Mode = "quote" | "inquiry";

const GENERAL_ID = "general";

interface FormState {
  services: string[];
  projectDetails: string;
  propertyType: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  addressOrArea: string;
  contactPreference: "call" | "text" | "email";
}

const INITIAL: FormState = {
  services: [],
  projectDetails: "",
  propertyType: "Residential",
  timeline: "Within 1 month",
  name: "",
  phone: "",
  email: "",
  addressOrArea: "",
  contactPreference: "call",
};

const TIMELINES_QUOTE = ["ASAP", "Within 1 month", "1–3 months", "Just exploring"];
const TIMELINES_INQUIRY = ["Today if possible", "Within a few days", "No rush"];
const PROPERTY_TYPES = ["Residential", "Acreage", "Other"];

function formatPhone(input: string): string {
  // Strip non-digits, then drop a leading "1" (NANP country code) so paste
  // of "+1 (403) 555-0123" formats to "(403) 555-0123" cleanly.
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
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const mode: Mode = form.services.includes(GENERAL_ID) ? "inquiry" : "quote";

  // Refs for autofocus + post-success focus management.
  const detailsRef = useRef<HTMLTextAreaElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const firstTileRef = useRef<HTMLButtonElement | null>(null);
  const doneBtnRef = useRef<HTMLButtonElement | null>(null);

  // Reset / preselect each time the modal opens. Express mode (single
  // preselection) jumps the user straight to Step 2.
  useEffect(() => {
    if (open) {
      setSuccess(false);
      setTouched({});
      const pre = preselectedServices.includes(GENERAL_ID)
        ? [GENERAL_ID]
        : preselectedServices;
      setForm({ ...INITIAL, services: pre });
      // Express: single non-general service preselected → skip to Step 2.
      const express =
        pre.length === 1 && pre[0] !== GENERAL_ID;
      setStep(express ? 2 : 1);
    }
  }, [open, preselectedServices]);

  // Autofocus on step transitions (small tick for Radix mount).
  useEffect(() => {
    if (!open) return;
    if (success) {
      const t = setTimeout(() => doneBtnRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (step === 1) firstTileRef.current?.focus();
      if (step === 2) {
        // Focus the first empty required field; otherwise project details.
        if (!form.name) nameRef.current?.focus();
        else detailsRef.current?.focus();
      }
    }, 60);
    return () => clearTimeout(t);
  }, [step, open, success, form.name]);

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

  const canContinueStep1 = form.services.length > 0;

  // Validation.
  const phoneDigits = form.phone.replace(/\D/g, "").length;
  const emailValid =
    !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const nameValid = form.name.trim().length > 1;
  const phoneValid = phoneDigits === 10;
  // Area is now optional client-side (server also accepts without it) —
  // we only ask name + phone as truly required, matching the friction goal.
  const areaValid = true;

  const canSubmit = useMemo(
    () => nameValid && phoneValid && emailValid,
    [nameValid, phoneValid, emailValid],
  );

  const submitDisabledReason = !nameValid
    ? "Add your name to send."
    : !phoneValid
      ? "Add a 10-digit phone number to send."
      : !emailValid
        ? "That email doesn't look right."
        : "";

  const handleSubmit = async () => {
    if (!canSubmit) {
      setTouched({ name: true, phone: true, email: true });
      // Move focus to the first invalid field.
      if (!nameValid) nameRef.current?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const isInquiry = mode === "inquiry";
      const serviceTitles = isInquiry
        ? ["General inquiry"]
        : SERVICES.filter((s) => form.services.includes(s.id)).map((s) => s.title);

      const detailsBody = form.projectDetails.trim();
      const projectDetails = isInquiry
        ? detailsBody
          ? `[General Inquiry] ${detailsBody}`
          : "[General Inquiry]"
        : detailsBody || undefined;

      const { data, error } = await supabase.functions.invoke("submit-quote-request", {
        body: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          addressOrArea: form.addressOrArea.trim() || undefined,
          services: serviceTitles,
          projectDetails,
          propertyType: isInquiry ? undefined : form.propertyType,
          timeline: form.timeline,
          contactPreference: form.contactPreference,
        },
      });
      if (error || !data?.ok) {
        const msg =
          error?.message || (data as { error?: string })?.error || "Please try again.";
        toast.error("Something went wrong", {
          description: `${msg} Or call ${CONTACT.phone}.`,
        });
        return;
      }
      setSuccess(true);
    } catch (err) {
      console.error("[QuoteModal] submit failed", err);
      toast.error("Network error", {
        description: `We couldn't reach the server. Please try again or call ${CONTACT.phone}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cmd/Ctrl+Enter advances; Enter inside a text input (not textarea) submits.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isTextarea =
      (e.target as HTMLElement)?.tagName?.toLowerCase() === "textarea";
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (step === 1) {
        if (canContinueStep1) setStep(2);
      } else if (canSubmit && !submitting) {
        handleSubmit();
      }
    } else if (e.key === "Enter" && !isTextarea && step === 2 && canSubmit && !submitting) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetForAnother = () => {
    setForm(INITIAL);
    setStep(1);
    setSuccess(false);
    setTouched({});
  };

  const stepHeading =
    step === 1
      ? mode === "inquiry"
        ? "How can we help?"
        : "What are we building?"
      : mode === "inquiry"
        ? "Send your message"
        : "Your project & contact";

  // Selected service titles, used for the editable chip on Step 2.
  const selectedServiceTitles = useMemo(
    () =>
      mode === "inquiry"
        ? ["General inquiry"]
        : SERVICES.filter((s) => form.services.includes(s.id)).map((s) => s.title),
    [form.services, mode],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) closeModal();
      }}
    >
      <DialogContent
        className="max-w-5xl w-[95vw] p-0 gap-0 overflow-hidden border-evergreen/20 bg-background sm:rounded-lg max-h-[92vh] grid-cols-1 md:grid-cols-[260px_1fr] md:grid"
      >
        <DialogTitle className="sr-only">
          {mode === "inquiry"
            ? "Send us a message — Creek Construction"
            : "Request a Quote — Creek Construction"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {mode === "inquiry"
            ? "Tell us what you'd like to know and we'll be in touch within 24 hours."
            : "Tell us about your exterior project and we'll be in touch within 24 hours."}
        </DialogDescription>

        {/* LEFT — desktop brand panel */}
        <aside
          className="hidden md:flex flex-col justify-between bg-evergreen text-evergreen-foreground p-7 relative overflow-hidden"
          aria-label="Creek Construction brand panel"
        >
          <div className="relative z-10">
            <img
              src={logo}
              alt="Creek Construction"
              width={200}
              height={200}
              className="h-24 w-auto object-contain mb-6 drop-shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]"
              loading="eager"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-3">
              Creek Construction
            </p>
            <h2 className="font-serif text-xl leading-tight mb-3">
              Excellence in the Work.
            </h2>
            <p className="text-sm text-evergreen-foreground/70 leading-relaxed">
              Residential exterior construction across Calgary, Edmonton, and surrounding Alberta.
            </p>
          </div>

          <div className="relative z-10 mt-6 space-y-2 text-sm">
            <div className="w-12 h-px bg-cedar/40 mb-4" />
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="flex items-center gap-3 text-evergreen-foreground/80 hover:text-cedar transition-colors min-h-[44px]"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              <span>{CONTACT.phone}</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3 text-evergreen-foreground/80 hover:text-cedar transition-colors min-h-[44px] break-all"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{CONTACT.email}</span>
            </a>
          </div>
        </aside>

        {/* Slim mobile brand strip — 40px so form fields land above-the-fold */}
        <div className="md:hidden bg-evergreen text-evergreen-foreground px-5 py-2.5 flex items-center gap-2.5">
          <img src={logo} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <p className="font-serif text-sm leading-none">Creek Construction</p>
          <span className="ml-auto text-[9px] tracking-[0.25em] uppercase text-cedar/80">
            Quote
          </span>
        </div>

        {/* RIGHT — step content */}
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
              <header className="sticky top-0 z-10 bg-background border-b border-border/40 px-6 md:px-8 pt-6 md:pt-7 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    {mode === "inquiry" ? "Send us a Message" : "Request a Quote"}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-cedar tabular-nums">
                    Step {step} / 2
                  </p>
                </div>
                <ProgressBar step={step} />
                <h3
                  className="font-serif text-2xl md:text-[28px] mt-4 text-foreground leading-tight"
                  aria-live="polite"
                >
                  {stepHeading}
                </h3>

                {/* Editable service chip on Step 2 — Express-mode breadcrumb */}
                {step === 2 && mode === "quote" && selectedServiceTitles.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedServiceTitles.map((title) => (
                      <span
                        key={title}
                        className="inline-flex items-center gap-1.5 text-[11px] tracking-wide px-2.5 py-1 rounded-sm bg-cedar/[0.06] border border-cedar/30 text-foreground"
                      >
                        {title}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1 text-[11px] tracking-wide text-muted-foreground hover:text-cedar transition-colors px-1.5 py-1 rounded-sm focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-1"
                    >
                      <Pencil className="h-3 w-3" aria-hidden /> change
                    </button>
                  </div>
                )}
              </header>

              <div className="px-6 md:px-8 py-6 flex-1">
                {step === 1 && (
                  <Step1
                    selected={form.services}
                    onToggle={toggleService}
                    firstTileRef={firstTileRef}
                  />
                )}
                {step === 2 && (
                  <Step2Combined
                    form={form}
                    mode={mode}
                    onUpdate={update}
                    detailsRef={detailsRef}
                    nameRef={nameRef}
                    touched={touched}
                    markTouched={markTouched}
                    nameValid={nameValid}
                    phoneValid={phoneValid}
                    emailValid={emailValid}
                  />
                )}
              </div>

              <footer
                className="sticky bottom-0 z-10 bg-muted px-6 md:px-8 py-4 border-t border-border/40 flex items-center justify-between gap-3"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2 rounded-sm ${
                    step === 1 ? "invisible" : ""
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back
                </button>

                {step === 2 && submitDisabledReason && (
                  <p
                    role="status"
                    className="hidden sm:block text-xs text-muted-foreground/70 flex-1 text-right pr-3"
                  >
                    {submitDisabledReason}
                  </p>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canContinueStep1}
                    aria-label={
                      !canContinueStep1
                        ? "Pick a service or 'General inquiry' to continue"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 bg-evergreen text-evergreen-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-evergreen/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                  >
                    Continue <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    aria-label={submitDisabledReason || undefined}
                    className="inline-flex items-center gap-2 bg-cedar text-cedar-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-cedar-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Sending
                      </>
                    ) : (
                      <>
                        {mode === "inquiry" ? "Send Message" : "Send Request"}{" "}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </>
                    )}
                  </button>
                )}
              </footer>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProgressBar = ({ step }: { step: Step }) => (
  <div className="flex items-center gap-1.5" aria-hidden>
    {[1, 2].map((i) => (
      <div
        key={i}
        className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
          i <= step ? "bg-cedar" : "bg-border"
        }`}
      />
    ))}
  </div>
);

const Step1 = ({
  selected,
  onToggle,
  firstTileRef,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  firstTileRef: React.RefObject<HTMLButtonElement>;
}) => {
  const generalSelected = selected.includes(GENERAL_ID);
  return (
    <fieldset>
      <legend className="text-sm text-muted-foreground mb-4">
        Select all that apply — or pick "General inquiry" if you just have questions.
      </legend>
      <div className="grid sm:grid-cols-2 gap-3">
        {SERVICES.map((s, idx) => {
          const isSelected = selected.includes(s.id);
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              ref={idx === 0 ? firstTileRef : undefined}
              type="button"
              onClick={() => onToggle(s.id)}
              aria-pressed={isSelected}
              className={`text-left p-4 rounded-sm border transition-colors duration-200 group flex items-start gap-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
                isSelected
                  ? "border-cedar bg-cedar/[0.06]"
                  : "border-border hover:border-cedar/50 hover:bg-cedar/[0.02]"
              }`}
              style={{ borderLeft: `2px solid hsl(var(--cedar) / ${s.intensity})` }}
            >
              <Icon
                className={`h-5 w-5 mt-0.5 shrink-0 ${
                  isSelected ? "text-cedar" : "text-muted-foreground group-hover:text-cedar/80"
                }`}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{s.title}</p>
                  {isSelected && <Check className="h-4 w-4 text-cedar shrink-0" aria-hidden />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s.short}</p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onToggle(GENERAL_ID)}
          aria-pressed={generalSelected}
          className={`sm:col-span-2 text-left p-4 rounded-sm border transition-colors duration-200 group flex items-start gap-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
            generalSelected
              ? "border-cedar bg-cedar/[0.06]"
              : "border-dashed border-border hover:border-cedar/50 hover:bg-cedar/[0.02]"
          }`}
          style={{ borderLeftWidth: 2, borderLeftStyle: "solid", borderLeftColor: "hsl(var(--cedar))" }}
        >
          <MessageCircleQuestion
            className={`h-5 w-5 mt-0.5 shrink-0 ${
              generalSelected ? "text-cedar" : "text-muted-foreground group-hover:text-cedar/80"
            }`}
            aria-hidden
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">Something else / General inquiry</p>
              {generalSelected && <Check className="h-4 w-4 text-cedar shrink-0" aria-hidden />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pricing, warranty, custom work, or just questions — we'll get back to you.
            </p>
          </div>
        </button>
      </div>
    </fieldset>
  );
};

/**
 * Step 2 (combined) — project details + contact in one screen. Replaces
 * the former Step 2 (details) and Step 3 (contact) for a 2-step flow.
 */
const Step2Combined = ({
  form,
  mode,
  onUpdate,
  detailsRef,
  nameRef,
  touched,
  markTouched,
  nameValid,
  phoneValid,
  emailValid,
}: {
  form: FormState;
  mode: Mode;
  onUpdate: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  detailsRef: React.RefObject<HTMLTextAreaElement>;
  nameRef: React.RefObject<HTMLInputElement>;
  touched: Record<string, boolean>;
  markTouched: (field: string) => void;
  nameValid: boolean;
  phoneValid: boolean;
  emailValid: boolean;
}) => {
  const isInquiry = mode === "inquiry";
  const detailsLabel = isInquiry ? "How can we help? (optional)" : "Project details (optional)";
  const detailsPlaceholder = isInquiry
    ? "e.g. Wondering about pricing for a 200 ft fence in Cochrane."
    : "e.g. 14x20 cedar deck, replacing a worn pressure-treated one. Built-in benches if budget allows.";
  const timelineLabel = isInquiry ? "When do you need a reply?" : "Timeline";
  const timelineOptions = isInquiry ? TIMELINES_INQUIRY : TIMELINES_QUOTE;
  const phoneDigits = form.phone.replace(/\D/g, "").length;

  return (
    <div className="space-y-5">
      {/* Contact block FIRST — it's the only required info. Details below
          encourage but never block submission. */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Your name"
          htmlFor="qm-name"
          required
          error={touched.name && !nameValid ? "Please enter your name." : undefined}
        >
          <Input
            id="qm-name"
            ref={nameRef}
            value={form.name}
            onChange={(v) => onUpdate("name", v)}
            onBlur={() => markTouched("name")}
            placeholder="Jane Doe"
            maxLength={120}
            autoComplete="name"
            invalid={touched.name && !nameValid}
          />
        </Field>
        <Field
          label="Phone"
          htmlFor="qm-phone"
          required
          error={
            touched.phone && !phoneValid
              ? phoneDigits === 0
                ? "Phone number is required."
                : `Looks like the phone is missing ${10 - phoneDigits} digit${10 - phoneDigits === 1 ? "" : "s"}.`
              : undefined
          }
        >
          <Input
            id="qm-phone"
            type="tel"
            value={form.phone}
            onChange={(v) => onUpdate("phone", formatPhone(v))}
            onBlur={() => markTouched("phone")}
            placeholder="(403) 555-0123"
            autoComplete="tel"
            invalid={touched.phone && !phoneValid}
          />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Email (optional)"
          htmlFor="qm-email"
          error={touched.email && !emailValid ? "Hmm — that email doesn't look right." : undefined}
        >
          <Input
            id="qm-email"
            type="email"
            value={form.email}
            onChange={(v) => onUpdate("email", v)}
            onBlur={() => markTouched("email")}
            placeholder="you@example.com"
            maxLength={255}
            autoComplete="email"
            invalid={touched.email && !emailValid}
          />
        </Field>
        <Field label="City or area (optional)" htmlFor="qm-area">
          <Input
            id="qm-area"
            value={form.addressOrArea}
            onChange={(v) => onUpdate("addressOrArea", v)}
            placeholder="e.g. Calgary NW"
            maxLength={255}
            autoComplete="address-level2"
          />
        </Field>
      </div>

      {/* Project details — optional but encouraged */}
      <Field label={detailsLabel} htmlFor="qm-details">
        <textarea
          ref={detailsRef}
          id="qm-details"
          value={form.projectDetails}
          onChange={(e) => onUpdate("projectDetails", e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder={detailsPlaceholder}
          className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-cedar focus:ring-1 focus:ring-cedar/30 transition-colors resize-none"
        />
      </Field>

      <div className={`grid gap-4 ${isInquiry ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {!isInquiry && (
          <Field label="Property" htmlFor="qm-property">
            <Select
              id="qm-property"
              value={form.propertyType}
              options={PROPERTY_TYPES}
              onChange={(v) => onUpdate("propertyType", v)}
            />
          </Field>
        )}
        <Field label={timelineLabel} htmlFor="qm-timeline">
          <Select
            id="qm-timeline"
            value={isInquiry && !TIMELINES_INQUIRY.includes(form.timeline) ? TIMELINES_INQUIRY[1] : form.timeline}
            options={timelineOptions}
            onChange={(v) => onUpdate("timeline", v)}
          />
        </Field>
        <Field label="Reach me by" htmlFor="qm-pref">
          <div className="grid grid-cols-3 gap-1.5" role="radiogroup">
            {(
              [
                { v: "call", label: "Call", icon: Phone },
                { v: "text", label: "Text", icon: MessageSquare },
                { v: "email", label: "Email", icon: Mail },
              ] as const
            ).map(({ v, label, icon: Icon }) => {
              const active = form.contactPreference === v;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onUpdate("contactPreference", v)}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-sm border text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
                    active
                      ? "border-cedar bg-cedar/[0.08] text-foreground"
                      : "border-border text-muted-foreground hover:border-cedar/50"
                  }`}
                >
                  <Icon className="h-3 w-3" aria-hidden /> {label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </div>
  );
};

const Field = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-2"
    >
      {label}
      {required && <span className="text-cedar ml-1">*</span>}
    </label>
    {children}
    {error ? (
      <p className="text-xs text-destructive mt-1.5" role="alert">
        {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground/60 mt-1.5">{hint}</p>
    ) : null}
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
      className={`w-full rounded-sm border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${
        invalid
          ? "border-destructive/60 focus:border-destructive focus:ring-destructive/30"
          : "border-border focus:border-cedar focus:ring-cedar/30"
      } ${className ?? ""}`}
    />
  ),
);
Input.displayName = "QuoteModalInput";

const Select = ({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-cedar focus:ring-1 focus:ring-cedar/30 transition-colors min-h-[44px]"
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

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
      {mode === "inquiry" ? "Message received." : "Request received."}
    </h3>
    <p className="text-muted-foreground max-w-md mb-2">
      {mode === "inquiry"
        ? "Thanks — we'll review and reach out within 24 hours."
        : "Thanks — we'll review your project details and reach out within 24 hours."}
    </p>
    <p className="text-sm text-muted-foreground/70 mb-8">
      Need to talk now? Call{" "}
      <a href={`tel:${CONTACT.phoneTel}`} className="text-cedar hover:underline">
        {CONTACT.phone}
      </a>
      .
    </p>
    <div className="flex items-center gap-6">
      <button
        type="button"
        ref={doneBtnRef}
        onClick={onClose}
        className="bg-evergreen text-evergreen-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-evergreen/90 transition-colors min-h-[44px]"
      >
        Done
      </button>
      <button
        type="button"
        onClick={onSendAnother}
        className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-cedar transition-colors min-h-[44px] px-2"
      >
        Send another →
      </button>
    </div>
  </div>
);

export default QuoteModal;
