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

    const services = Array.isArray(body.services)
      ? body.services
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim().slice(0, 80))
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (!name || !phone || !addressOrArea || services.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: name, phone, addressOrArea, and at least one service.",
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
        address_or_area: addressOrArea,
        services,
        project_details: projectDetails || null,
        property_type: propertyType || null,
        timeline: timeline || null,
        contact_preference: contactPreference || null,
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

    console.log("[submit-quote-request] new quote request", {
      id: data?.id,
      services,
      name,
    });

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
