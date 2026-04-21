
CREATE TABLE IF NOT EXISTS public.ai_generation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'scheduled',
  status text NOT NULL,
  topic text,
  post_id uuid,
  post_slug text,
  post_title text,
  error_message text,
  duration_ms integer
);

ALTER TABLE public.ai_generation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ai logs"
ON public.ai_generation_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert ai logs"
ON public.ai_generation_log FOR INSERT TO authenticated, anon
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ai_log_created ON public.ai_generation_log(created_at DESC);
