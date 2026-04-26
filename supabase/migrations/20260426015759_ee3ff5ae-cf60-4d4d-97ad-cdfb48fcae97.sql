-- ── Tier-2 bulk promotion ───────────────────────────────────────────
-- Promote every "suggested" row that has a real service tag (not 'other'),
-- a portfolio-or-reference quality grade, a non-reject quality, and at
-- least 12 chars of alt text. These fill secondary slots; the public
-- `min_quality:'hero'` query in MediaSlot still excludes them from
-- above-the-fold hero positions.
UPDATE public.media_metadata
SET ai_review_status = 'approved'
WHERE ai_review_status = 'suggested'
  AND service IS NOT NULL
  AND service NOT IN ('other')
  AND ai_quality IN ('hero', 'portfolio', 'reference')
  AND LENGTH(COALESCE(alt, '')) >= 12;

-- ── Auto-seed service-portfolio projects so FeaturedProjects renders ──
-- Only inserts rows that don't already exist; uses a representative hero
-- shot per service (preferring 'hero' or 'elevation' shot types).
INSERT INTO public.projects
  (slug, title, service, status, year, featured, display_order, hero_path, location, summary)
SELECT
  'portfolio-' || s.service || '-2025'                                   AS slug,
  initcap(s.service) || ' Portfolio'                                      AS title,
  s.service                                                               AS service,
  'complete'                                                              AS status,
  2025                                                                    AS year,
  true                                                                    AS featured,
  80                                                                      AS display_order,
  s.hero_path                                                             AS hero_path,
  'Calgary & Edmonton'                                                    AS location,
  'Selected ' || s.service || ' work across Calgary, Edmonton, and surrounding Alberta.' AS summary
FROM (
  SELECT DISTINCT ON (service)
    service,
    storage_path AS hero_path
  FROM public.media_metadata
  WHERE ai_review_status = 'approved'
    AND service IN ('decks', 'sheds', 'fencing', 'painting', 'siding', 'pergolas')
    AND storage_path !~* '\.(mov|mp4|webm|m4v)$'
  ORDER BY service,
           CASE shot_type
             WHEN 'hero'      THEN 1
             WHEN 'elevation' THEN 2
             WHEN 'wide'      THEN 3
             ELSE 4
           END,
           CASE ai_quality
             WHEN 'hero'      THEN 1
             WHEN 'portfolio' THEN 2
             ELSE 3
           END
) s
ON CONFLICT (slug) DO NOTHING;