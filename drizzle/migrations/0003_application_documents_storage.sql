CREATE OR REPLACE FUNCTION public.can_upload_application_document(_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    lower(split_part(_name, '.', array_length(string_to_array(_name, '.'), 1))) IN ('pdf', 'jpg', 'jpeg', 'png', 'webp')
    AND EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id::text = split_part(_name, '/', 1)
        AND a.created_at > now() - interval '1 hour'
    )
    AND (
      SELECT count(*) FROM storage.objects o
      WHERE o.bucket_id = 'application-documents'
        AND split_part(o.name, '/', 1) = split_part(_name, '/', 1)
    ) < 10
$$;

GRANT EXECUTE ON FUNCTION public.can_upload_application_document(text) TO anon, authenticated;

CREATE POLICY "Applicants upload documents to their new application"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'application-documents'
  AND public.can_upload_application_document(name)
);

CREATE POLICY "Admins view application documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'application-documents'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins delete application documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'application-documents'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);