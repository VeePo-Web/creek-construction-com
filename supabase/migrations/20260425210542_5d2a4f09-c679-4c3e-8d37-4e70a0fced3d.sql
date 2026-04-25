-- Extend media_metadata for the AI pipeline
ALTER TABLE public.media_metadata
  ADD COLUMN IF NOT EXISTS lqip TEXT,
  ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_review_status TEXT DEFAULT 'pending'
    CHECK (ai_review_status IN ('pending','suggested','approved','rejected')),
  ADD COLUMN IF NOT EXISTS ai_subject TEXT,
  ADD COLUMN IF NOT EXISTS ai_quality TEXT,
  ADD COLUMN IF NOT EXISTS ai_season TEXT,
  ADD COLUMN IF NOT EXISTS ai_notes TEXT,
  ADD COLUMN IF NOT EXISTS service TEXT,
  ADD COLUMN IF NOT EXISTS project_guess TEXT,
  ADD COLUMN IF NOT EXISTS poster_path TEXT;

CREATE INDEX IF NOT EXISTS media_metadata_review_status_idx
  ON public.media_metadata (ai_review_status);
CREATE INDEX IF NOT EXISTS media_metadata_service_idx
  ON public.media_metadata (service);

-- Projects table — editorial data, not hard-coded
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  service TEXT NOT NULL,
  location TEXT,
  year INTEGER,
  status TEXT NOT NULL DEFAULT 'complete'
    CHECK (status IN ('in-progress','complete')),
  summary TEXT,
  hero_path TEXT,
  video_path TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_service_idx ON public.projects (service);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON public.projects (featured);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read projects (the website needs them)
CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Public can read approved media metadata too (for alt text on the live site)
CREATE POLICY "Public can read approved media metadata"
  ON public.media_metadata FOR SELECT
  USING (ai_review_status = 'approved');