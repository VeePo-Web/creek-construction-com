-- Quote requests submitted from the public website
CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  address_or_area text NOT NULL,
  services text[] NOT NULL DEFAULT '{}',
  project_details text,
  property_type text,
  timeline text,
  contact_preference text,
  status text NOT NULL DEFAULT 'new'
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated visitors) can submit a quote request
CREATE POLICY "Anyone can submit a quote request"
ON public.quote_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Nobody can read/update/delete from the client side (no SELECT policy = no access).
-- Admin access will be added in a future migration via a roles table.

CREATE INDEX idx_quote_requests_created_at ON public.quote_requests(created_at DESC);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);