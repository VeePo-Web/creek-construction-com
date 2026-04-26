-- Reset previously-skipped video rows so the new auto-classify-batch
-- pipeline (v2) can ingest them as ambient process clips.
UPDATE public.media_metadata
SET ai_review_status = 'pending',
    ai_notes = NULL
WHERE ai_review_status = 'rejected'
  AND storage_path ~* '\.(mov|mp4|webm|m4v)$';