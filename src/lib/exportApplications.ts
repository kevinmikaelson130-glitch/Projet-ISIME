export interface ExportableApplication {
  tracking_code: string | null;
  created_at: string;
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  address: string;
  program: string;
  education_level: string;
  previous_school: string | null;
  status: string | null;
  admin_response: string | null;
  responded_at: string | null;
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  reviewing: "En cours d'examen",
  accepted: "Accepté",
  rejected: "Refusé",
  responded: "Réponse envoyée",
};

export const EXPORT_COLUMNS = [
  { header: "N° de suivi", width: 16 },
  { header: "Date de candidature", width: 18 },
  { header: "Nom", width: 18 },
  { header: "Prénom", width: 18 },
  { header: "Email", width: 28 },
  { header: "Téléphone", width: 18 },
  { header: "Date de naissance", width: 16 },
  { header: "Nationalité", width: 14 },
  { header: "Adresse", width: 30 },
  { header: "Programme", width: 24 },
  { header: "Niveau d'études", width: 18 },
  { header: "Établissement précédent", width: 26 },
  { header: "Statut", width: 16 },
  { header: "Réponse de l'administration", width: 40 },
  { header: "Date de réponse", width: 16 },
] as const;

type CellValue = string | Date | null;

function toDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** One row per application, in the same order as EXPORT_COLUMNS. */
export function applicationToRow(a: ExportableApplication): CellValue[] {
  return [
    a.tracking_code ?? "",
    toDate(a.created_at),
    a.last_name,
    a.first_name,
    a.email,
    a.phone,
    toDate(a.date_of_birth),
    a.nationality,
    a.address,
    a.program,
    a.education_level,
    a.previous_school ?? "",
    STATUS_LABELS[a.status ?? "pending"] ?? a.status ?? "",
    a.admin_response ?? "",
    toDate(a.responded_at),
  ];
}

export function exportFileName(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `candidatures-ISIME-${y}-${m}-${d}.xlsx`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function exportApplicationsToExcel(applications: ExportableApplication[]) {
  const { default: writeExcelFile } = await import("write-excel-file/browser");
  const header = EXPORT_COLUMNS.map((c) => ({
    value: c.header,
    fontWeight: "bold" as const,
    backgroundColor: "#1A1F2C",
    textColor: "#FFFFFF",
  }));
  const rows = applications.map((a) =>
    applicationToRow(a).map((value) =>
      value instanceof Date
        ? { value, type: Date, format: "dd/mm/yyyy" }
        : { value: value ?? "", type: String },
    ),
  );
  const blob = await writeExcelFile([header, ...rows] as never, {
    columns: EXPORT_COLUMNS.map((c) => ({ width: c.width })),
    stickyRowsCount: 1,
  } as never).toBlob();
  downloadBlob(blob, exportFileName());
}
