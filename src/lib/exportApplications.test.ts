import { describe, it, expect } from "vitest";
import { applicationToRow, EXPORT_COLUMNS, exportFileName } from "./exportApplications";

const app = {
  tracking_code: "ISIME-AB12CD34",
  created_at: "2026-10-20T09:00:00Z",
  last_name: "Rakoto",
  first_name: "Hery",
  email: "hery@example.com",
  phone: "+261340000000",
  date_of_birth: "2005-03-14",
  nationality: "Malagasy",
  address: "Behoririka",
  program: "Licence en Informatique",
  education_level: "Baccalauréat",
  previous_school: null,
  status: "accepted",
  admin_response: null,
  responded_at: null,
};

describe("applications Excel export", () => {
  it("has one value per column, tracking code first", () => {
    const row = applicationToRow(app);
    expect(row).toHaveLength(EXPORT_COLUMNS.length);
    expect(row[0]).toBe("ISIME-AB12CD34");
  });

  it("writes the status in French", () => {
    expect(applicationToRow(app)[12]).toBe("Accepté");
    expect(applicationToRow({ ...app, status: null })[12]).toBe("En attente");
  });

  it("names the file with the export date", () => {
    expect(exportFileName(new Date(2026, 9, 27))).toBe("candidatures-ISIME-2026-10-27.xlsx");
  });
});
