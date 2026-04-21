
DROP POLICY IF EXISTS "Service role can insert ai logs" ON public.ai_generation_log;
-- No INSERT policy = only service_role (which bypasses RLS) can insert. Edge functions use service role.
