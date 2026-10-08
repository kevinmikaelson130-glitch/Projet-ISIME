ALTER TABLE public.applications ADD COLUMN tracking_code text UNIQUE DEFAULT ('ISIME-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8)));
UPDATE public.applications SET tracking_code = 'ISIME-' || upper(substr(md5(random()::text || id::text), 1, 8)) WHERE tracking_code IS NULL;

CREATE OR REPLACE FUNCTION public.track_application(_code text)
RETURNS TABLE(first_name text, program text, status text, admin_response text, created_at timestamptz, responded_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT a.first_name, a.program, a.status, a.admin_response, a.created_at, a.responded_at
  FROM public.applications a
  WHERE a.tracking_code = upper(trim(_code))
  LIMIT 1
$$;
GRANT EXECUTE ON FUNCTION public.track_application(text) TO anon, authenticated;