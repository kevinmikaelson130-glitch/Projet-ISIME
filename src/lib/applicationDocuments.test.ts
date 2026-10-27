import { describe, it, expect } from "vitest";
import { validateDocumentFile, documentLabelFromPath, documentPath } from "./applicationDocuments";

describe("validateDocumentFile", () => {
  it("accepts a PDF of exactly 5 MB", () => {
    expect(validateDocumentFile({ name: "bacc.PDF", size: 5 * 1024 * 1024 })).toBeNull();
  });

  it("rejects a file over 5 MB", () => {
    expect(validateDocumentFile({ name: "photo.jpg", size: 5 * 1024 * 1024 + 1 })).toMatch(/5 Mo/);
  });

  it("rejects a Word document", () => {
    expect(validateDocumentFile({ name: "cin.docx", size: 1000 })).toMatch(/Format/);
  });
});

describe("document paths", () => {
  it("stores files in the application's folder and reads back the label", () => {
    const path = documentPath("abc-123", "residence", "scan.png");
    expect(path.startsWith("abc-123/residence-")).toBe(true);
    expect(path.endsWith(".png")).toBe(true);
    expect(documentLabelFromPath(path)).toBe("Certificat de résidence");
  });
});
