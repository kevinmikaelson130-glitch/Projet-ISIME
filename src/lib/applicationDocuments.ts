export const APPLICATION_DOCUMENTS_BUCKET = "application-documents";

export const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_DOCUMENT_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp"] as const;

export const DOCUMENT_TYPES = [
  { key: "photo", label: "Photo d'identité" },
  { key: "bacc", label: "Diplôme BACC" },
  { key: "residence", label: "Certificat de résidence" },
  { key: "cin", label: "CIN ou acte de naissance" },
] as const;

export type DocumentTypeKey = (typeof DOCUMENT_TYPES)[number]["key"];

export function fileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/** Returns a French error message, or null when the file is accepted. */
export function validateDocumentFile(file: { name: string; size: number }): string | null {
  const ext = fileExtension(file.name);
  if (!(ALLOWED_DOCUMENT_EXTENSIONS as readonly string[]).includes(ext)) {
    return "Format non accepté. Utilisez PDF, JPG, PNG ou WEBP.";
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return "Fichier trop lourd : 5 Mo maximum.";
  }
  return null;
}

export function documentPath(applicationId: string, type: DocumentTypeKey, fileName: string): string {
  return `${applicationId}/${type}-${Date.now()}.${fileExtension(fileName)}`;
}

export function documentLabelFromPath(path: string): string {
  const fileName = path.split("/").pop() ?? path;
  const key = fileName.split("-")[0];
  return DOCUMENT_TYPES.find((d) => d.key === key)?.label ?? fileName;
}
