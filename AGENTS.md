# AGENTS.md

- Application documents live in the private `application-documents` storage bucket under `<application_id>/<type>-<timestamp>.<ext>`; the form generates the application id client-side so anonymous applicants can upload without reading the row back. Why: anon has no SELECT on applications, and the storage INSERT policy (`can_upload_application_document`) only accepts folders of applications created within the last hour.
- Admins read application documents through short-lived signed URLs, never public URLs. Why: the files are personal ID documents.
- Document types, size and format rules are defined once in `src/lib/applicationDocuments.ts` and covered by its test. Why: the form, the admin view and the storage policy must agree.
