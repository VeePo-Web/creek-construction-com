import { useEffect, useMemo, useRef, useState } from "react";
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
  Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CONTACT } from "@/config/contact";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "./QuoteModalProvider";
import logo from "@/assets/creek-logo-nav-sm.png";

type Step = 1 | 2 | 3;
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
  const d = input.replace(/\D/g, "").slice(0, 10);
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

  // Refs for autofocus on step transitions.
  const detailsRef = useRef<HTMLTextAreaElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const firstTileRef = useRef<HTMLButtonElement | null>(null);

  // Reset / preselect each time the modal opens.
  useEffect(() => {
    if (open) {
      setStep(1);
      setSuccess(false);
      setTouched({});
      // If caller pre-selected `general`, normalize to GENERAL_ID.
      const pre = preselectedServices.includes(GENERAL_ID)
        ? [GENERAL_ID]
        : preselectedServices;
      setForm({ ...INITIAL, services: pre });
    }
  }, [open, preselectedServices]);

  // Auto-focus on step transitions (with a small tick so Radix finishes mounting).
  useEffect(() => {
    if (!open || success) return;
    const t = setTimeout(() => {
      if (step === 1) firstTileRef.current?.focus();
      if (step === 2) detailsRef.current?.focus();
      if (step === 3) nameRef.current?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [step, open, success]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const markTouched = (field: string) =>
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));

  const toggleService = (id: string) =>
    setForm((prev) => {
      // Mutual exclusion with the general-inquiry sentinel.
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

  // Per-field validity for inline messages.
  const phoneDigits = form.phone.replace(/\D/g, "").length;
  const emailValid =
    !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const nameValid = form.name.trim().length > 1;
  const phoneValid = phoneDigits === 10;
  const areaValid = form.addressOrArea.trim().length > 1;

  const canSubmit = useMemo(
    () => nameValid && phoneValid && areaValid && emailValid,
    [nameValid, phoneValid, areaValid, emailValid],
  );

  const submitDisabledReason = !nameValid
    ? "Add your name to send."
    : !phoneValid
      ? "Add a 10-digit phone number to send."
      : !areaValid
        ? "Add your city or service area to send."
        : !emailValid
          ? "That email doesn't look right."
          : "";

  const handleSubmit = async () => {
    if (!canSubmit) {
      // Surface all field errors at once.
      setTouched({ name: true, phone: true, email: true, addressOrArea: true });
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
          addressOrArea: form.addressOrArea.trim(),
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

  // Cmd/Ctrl + Enter to advance.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (step < 3) {
        if (step === 1 && !canContinueStep1) return;
        setStep((s) => ((s + 1) as Step));
      } else if (canSubmit && !submitting) {
        handleSubmit();
      }
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
      : step === 2
        ? mode === "inquiry"
          ? "Tell us a bit more (optional)"
          : "Tell us about the project"
        : "How can we reach you?";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) closeModal();
      }}
    >
      <DialogContent
        className="max-w-5xl w-[95vw] p-0 gap-0 overflow-hidden border-evergreen/20 bg-background sm:rounded-lg max-h-[92vh] grid-cols-1 md:grid-cols-[280px_1fr] md:grid"
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

        {/* LEFT — brand identity stack (collapses to slim header on mobile) */}
        <aside
          className="hidden md:flex flex-col justify-between bg-evergreen text-evergreen-foreground p-8 relative overflow-hidden"
          aria-label="Creek Construction brand panel"
        >
          <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
          <div className="relative z-10">
            <img
              src={logo}
              alt="Creek Construction"
              width={200}
              height={200}
              className="h-32 w-auto object-contain mb-8 drop-shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]"
              loading="eager"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-3">
              Creek Construction
            </p>
            <h2 className="font-serif text-2xl leading-tight mb-4">
              Excellence in the Work.
            </h2>
            <p className="text-sm text-evergreen-foreground/70 leading-relaxed">
              Residential exterior construction across Calgary, Edmonton, and surrounding Alberta.
            </p>
          </div>

          <div className="relative z-10 mt-8 space-y-3 text-sm">
            <div className="w-12 h-px bg-cedar/40 mb-5" />
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
            <p className="text-[10px] tracking-[0.2em] uppercase text-evergreen-foreground/40 pt-4">
              Locally owned · Calgary & Edmonton
            </p>
          </div>
        </aside>

        {/* Mobile slim header */}
        <div className="md:hidden bg-evergreen text-evergreen-foreground px-6 py-4 flex items-center gap-3">
          <img src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-cedar/80">Creek Construction</p>
            <p className="font-serif text-base leading-tight">Excellence in the Work.</p>
          </div>
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
            />
          ) : (
            <>
              <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-6 md:px-10 pt-8 pb-6 border-b border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    {mode === "inquiry" ? "Send us a Message" : "Request a Quote"}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-cedar tabular-nums">
                    Step {step} / 3
                  </p>
                </div>
                <ProgressBar step={step} />
                <h3
                  className="font-serif text-2xl md:text-3xl mt-5 text-foreground"
                  aria-live="polite"
                >
                  {stepHeading}
                </h3>
              </header>

              <div className="px-6 md:px-10 py-6 flex-1">
                {step === 1 && (
                  <Step1
                    selected={form.services}
                    onToggle={toggleService}
                    firstTileRef={firstTileRef}
                  />
                )}
                {step === 2 && (
                  <Step2
                    form={form}
                    mode={mode}
                    onUpdate={update}
                    detailsRef={detailsRef}
                  />
                )}
                {step === 3 && (
                  <Step3
                    form={form}
                    mode={mode}
                    onUpdate={update}
                    nameRef={nameRef}
                    touched={touched}
                    markTouched={markTouched}
                    nameValid={nameValid}
                    phoneValid={phoneValid}
                    emailValid={emailValid}
                    areaValid={areaValid}
                  />
                )}
              </div>

              <footer
                className="sticky bottom-0 z-10 bg-muted/85 backdrop-blur supports-[backdrop-filter]:bg-muted/70 px-6 md:px-10 py-5 border-t border-border/40 flex items-center justify-between gap-3"
                style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
              >
                <button
                  type="button"
                  onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
                  className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2 rounded-sm ${
                    step === 1 ? "invisible" : ""
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back
                </button>

                {/* Live region for the disabled-Send reason */}
                {step === 3 && submitDisabledReason && (
                  <p
                    role="status"
                    className="hidden sm:block text-xs text-muted-foreground/70 flex-1 text-right pr-3"
                  >
                    {submitDisabledReason}
                  </p>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => ((s + 1) as Step))}
                    disabled={step === 1 && !canContinueStep1}
                    aria-label={
                      step === 1 && !canContinueStep1
                        ? "Pick a service or 'General inquiry' to continue"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 bg-evergreen text-evergreen-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-evergreen/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px]"
                  >
                    Continue <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    aria-label={submitDisabledReason || undefined}
                    className="inline-flex items-center gap-2 bg-cedar text-cedar-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-cedar-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px]"
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
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
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
              className={`text-left p-4 rounded-sm border transition-all duration-300 group flex items-start gap-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
                isSelected
                  ? "border-cedar bg-cedar/[0.06] shadow-elevated"
                  : "border-border hover:border-cedar/50 hover:bg-cedar/[0.02]"
              }`}
              style={{ borderLeft: `2px solid hsl(var(--cedar) / ${s.intensity})` }}
            >
              <Icon
                className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${
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

        {/* General Inquiry / Something else — full row on desktop */}
        <button
          type="button"
          onClick={() => onToggle(GENERAL_ID)}
          aria-pressed={generalSelected}
          className={`sm:col-span-2 text-left p-4 rounded-sm border transition-all duration-300 group flex items-start gap-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
            generalSelected
              ? "border-cedar bg-cedar/[0.06] shadow-elevated"
              : "border-dashed border-border hover:border-cedar/50 hover:bg-cedar/[0.02]"
          }`}
          style={{ borderLeftWidth: 2, borderLeftStyle: "solid", borderLeftColor: "hsl(var(--cedar))" }}
        >
          <MessageCircleQuestion
            className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${
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

const Step2 = ({
  form,
  mode,
  onUpdate,
  detailsRef,
}: {
  form: FormState;
  mode: Mode;
  onUpdate: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  detailsRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  const isInquiry = mode === "inquiry";
  const detailsLabel = isInquiry ? "How can we help? (optional)" : "Project details";
  const detailsPlaceholder = isInquiry
    ? "e.g. Wondering about pricing for a 200 ft fence in Cochrane, or whether you do small repair jobs."
    : "e.g. 14x20 cedar deck, replacing a worn pressure-treated one. Want built-in benches if budget allows.";
  const detailsHint = isInquiry
    ? "A line or two is plenty — we'll follow up with anything we need."
    : "Size, materials, timing — anything that helps us scope it.";
  const timelineLabel = isInquiry ? "When do you need a reply?" : "Timeline";
  const timelineOptions = isInquiry ? TIMELINES_INQUIRY : TIMELINES_QUOTE;

  return (
    <div className="space-y-6">
      <Field label={detailsLabel} htmlFor="qm-details" hint={detailsHint}>
        <textarea
          ref={detailsRef}
          id="qm-details"
          value={form.projectDetails}
          onChange={(e) => onUpdate("projectDetails", e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder={detailsPlaceholder}
          className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-cedar focus:ring-1 focus:ring-cedar/30 transition-colors resize-none"
        />
      </Field>

      <div className={`grid gap-4 ${isInquiry ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
        {!isInquiry && (
          <Field label="Property type" htmlFor="qm-property">
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
      </div>
    </div>
  );
};

const Step3 = ({
  form,
  mode,
  onUpdate,
  nameRef,
  touched,
  markTouched,
  nameValid,
  phoneValid,
  emailValid,
  areaValid,
}: {
  form: FormState;
  mode: Mode;
  onUpdate: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  nameRef: React.RefObject<HTMLInputElement>;
  touched: Record<string, boolean>;
  markTouched: (field: string) => void;
  nameValid: boolean;
  phoneValid: boolean;
  emailValid: boolean;
  areaValid: boolean;
}) => {
  const phoneDigits = form.phone.replace(/\D/g, "").length;
  return (
    <div className="space-y-5">
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
        <Field
          label="City or service area"
          htmlFor="qm-area"
          required
          error={touched.addressOrArea && !areaValid ? "Please enter your city or service area." : undefined}
        >
          <Input
            id="qm-area"
            value={form.addressOrArea}
            onChange={(v) => onUpdate("addressOrArea", v)}
            onBlur={() => markTouched("addressOrArea")}
            placeholder="e.g. Calgary NW, Sherwood Park"
            maxLength={255}
            autoComplete="address-level2"
            invalid={touched.addressOrArea && !areaValid}
          />
        </Field>
      </div>

      <Field label="Preferred contact method" htmlFor="qm-pref">
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
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
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm border text-sm transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 ${
                  active
                    ? "border-cedar bg-cedar/[0.08] text-foreground"
                    : "border-border text-muted-foreground hover:border-cedar/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
              </button>
            );
          })}
        </div>
      </Field>

      <p className="text-[11px] text-muted-foreground/60 pt-2">
        Tip: press <kbd className="px-1.5 py-0.5 rounded border border-border text-[10px]">⌘ Enter</kbd> /{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-border text-[10px]">Ctrl Enter</kbd> to send.
      </p>
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
}: {
  mode: Mode;
  onClose: () => void;
  onSendAnother: () => void;
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
        onClick={onClose}
        className="bg-evergreen text-evergreen-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-evergreen/90 transition-all min-h-[44px]"
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
