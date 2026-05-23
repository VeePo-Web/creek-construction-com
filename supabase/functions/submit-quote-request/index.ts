// Public edge function — accepts quote requests from the website's QuoteModal
// and inserts them into the quote_requests table using the service role key.
// No authentication required (this is a public lead form).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  name?: string;
  phone?: string;
  email?: string;
  addressOrArea?: string;
  services?: string[];
  projectDetails?: string;
  propertyType?: string;
  timeline?: string;
  contactPreference?: string;
  voucher?: string;
}

function sanitize(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as Payload;

    const name = sanitize(body.name, 120);
    const phone = sanitize(body.phone, 40);
    const email = sanitize(body.email, 255);
    const addressOrArea = sanitize(body.addressOrArea, 255);
    const projectDetails = sanitize(body.projectDetails, 2000);
    const propertyType = sanitize(body.propertyType, 60);
    const timeline = sanitize(body.timeline, 60);
    const contactPreference = sanitize(body.contactPreference, 20);
    const voucher = sanitize(body.voucher, 80);

    const services = Array.isArray(body.services)
      ? body.services
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim().slice(0, 80))
          .filter(Boolean)
          .slice(0, 20)
      : [];

    // Bare minimum: name + phone. Everything else is optional — a half-typed
    // lead with just a phone number is still a lead worth a callback. The
    // client UX still encourages full completion, but we don't want a typo
    // in the area field to lose us the conversion.
    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: name and phone.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        name,
        phone,
        email: email || null,
        address_or_area: addressOrArea || "(not provided)",
        services,
        project_details: projectDetails || null,
        property_type: propertyType || null,
        timeline: timeline || null,
        contact_preference: contactPreference || null,
        voucher: voucher || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[submit-quote-request] insert error", error);
      return new Response(
        JSON.stringify({ error: "Could not save your request." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const isInquiry = services.includes("General inquiry") || services.length === 0;
    console.log(
      `[submit-quote-request] ${isInquiry ? "INQUIRY" : "QUOTE"} received`,
      { id: data?.id, services, name },
    );

    // Fire-and-forget: notify Creek via Resend. Failures are logged but
    // never block the 200 response — the row is already saved.
    void (async () => {
      try {
        const lovableKey = Deno.env.get("LOVABLE_API_KEY");
        const resendKey = Deno.env.get("RESEND_API_KEY");
        if (!lovableKey || !resendKey) {
          console.warn("[submit-quote-request] email skipped — missing Resend keys");
          return;
        }

        const esc = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const row = (label: string, value?: string | null) =>
          value
            ? `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;font-size:13px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;color:#1a1a1a;font-size:14px;">${esc(value)}</td></tr>`
            : "";

        const subjectKind = isInquiry
          ? "General inquiry"
          : services.slice(0, 2).join(", ") || "Quote request";
        const subject = `New ${isInquiry ? "inquiry" : "quote request"} — ${name} (${subjectKind})`;

        const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e7e3dc;border-left:3px solid #9a6b3f;padding:28px 28px 24px;">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9a6b3f;">Creek Construction · Lead</p>
<h1 style="margin:0 0 18px;font-size:20px;color:#1a1a1a;font-weight:600;">${esc(name)}</h1>
<table style="width:100%;border-collapse:collapse;">
${row("Phone", phone)}
${row("Email", email)}
${row("City / area", addressOrArea)}
${row("Services", services.join(", "))}
${row("Timeline", timeline)}
${row("Property", propertyType)}
${row("Contact pref.", contactPreference)}
${row("Voucher", voucher || "No voucher")}
${projectDetails ? `<tr><td colspan="2" style="padding:14px 0 0;"><div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6b6b;margin-bottom:6px;">Project details</div><div style="font-size:14px;color:#1a1a1a;white-space:pre-wrap;line-height:1.55;">${esc(projectDetails)}</div></td></tr>` : ""}
</table>
<div style="margin-top:20px;padding-top:14px;border-top:1px solid #ece8e0;font-size:12px;color:#8a8a8a;">Reply directly to this email to reach the customer${email ? "" : " (no email provided — call them)"}.</div>
</div></body></html>`;

        const text = [
          `New ${isInquiry ? "inquiry" : "quote request"} — ${name}`,
          ``,
          `Phone: ${phone}`,
          email ? `Email: ${email}` : null,
          addressOrArea ? `City: ${addressOrArea}` : null,
          services.length ? `Services: ${services.join(", ")}` : null,
          timeline ? `Timeline: ${timeline}` : null,
          `Voucher: ${voucher || "No voucher"}`,
          projectDetails ? `\nDetails:\n${projectDetails}` : null,
        ].filter(Boolean).join("\n");

        const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": resendKey,
          },
          body: JSON.stringify({
            from: "Creek Construction <quotes@creek-construction.com>",
            to: ["Creekproconstruction@gmail.com"],
            cc: ["parker@veepo.ca"],
            reply_to: email || undefined,
            subject,
            html,
            text,
          }),
        });
        if (!res.ok) {
          console.error("[submit-quote-request] resend failed", res.status, await res.text());
        }
      } catch (e) {
        console.error("[submit-quote-request] resend error", e);
      }
    })();

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[submit-quote-request] unexpected error", err);
    return new Response(JSON.stringify({ error: "Bad request." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
