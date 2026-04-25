-- ============================================================
-- 1. PROFILES TABLE (auto-created on signup)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================
-- 2. ROLES SYSTEM
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role() — security definer to bypass RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 3. AUTO-CREATE PROFILE + FIRST-USER-IS-ADMIN ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  role_count INTEGER;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );

  -- First user becomes admin; everyone else is a regular user
  SELECT COUNT(*) INTO role_count FROM public.user_roles;
  IF role_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. updated_at TRIGGER FUNCTION (shared)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. MEDIA METADATA TABLE
-- ============================================================
CREATE TABLE public.media_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL UNIQUE,
  alt TEXT,
  caption TEXT,
  project_slug TEXT,
  shot_type TEXT,
  width INTEGER,
  height INTEGER,
  duration_seconds NUMERIC,
  taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX media_metadata_project_slug_idx ON public.media_metadata (project_slug);
CREATE INDEX media_metadata_shot_type_idx ON public.media_metadata (shot_type);

ALTER TABLE public.media_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all media metadata"
  ON public.media_metadata FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert media metadata"
  ON public.media_metadata FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media metadata"
  ON public.media_metadata FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media metadata"
  ON public.media_metadata FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER media_metadata_set_updated_at
  BEFORE UPDATE ON public.media_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 6. STORAGE BUCKET — media-library (public read, admin write)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-library',
  'media-library',
  TRUE,
  104857600,  -- 100 MB per file
  ARRAY[
    'image/jpeg','image/jpg','image/png','image/webp','image/avif','image/gif','image/heic','image/heif',
    'video/mp4','video/webm','video/quicktime','video/x-m4v'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read on media-library"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-library');

CREATE POLICY "Admins can upload to media-library"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'media-library'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update media-library"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'media-library'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete from media-library"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'media-library'
    AND public.has_role(auth.uid(), 'admin')
  );