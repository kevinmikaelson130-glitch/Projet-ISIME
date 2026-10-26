ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS tracking_code text UNIQUE
  DEFAULT ('MSG-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8)));

UPDATE public.contact_messages
SET tracking_code = 'MSG-' || upper(substr(md5(random()::text || id::text || clock_timestamp()::text), 1, 8))
WHERE tracking_code IS NULL;

CREATE OR REPLACE FUNCTION public.track_message(_code text)
RETURNS TABLE(name text, subject text, message text, status text, admin_response text, created_at timestamptz, responded_at timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT m.name, m.subject, m.message, m.status, m.admin_response, m.created_at, m.responded_at
  FROM public.contact_messages m
  WHERE m.tracking_code = upper(trim(_code))
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.track_message(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_message(text) TO anon, authenticated;