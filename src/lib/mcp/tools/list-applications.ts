import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_applications",
  title: "Lister les candidatures",
  description: "List student applications submitted to ISIME, optionally filtered by status.",
  inputSchema: {
    status: z.string().optional().describe("Filter by status, e.g. pending, accepted, rejected."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("applications")
      .select("id, first_name, last_name, email, phone, program, education_level, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { applications: data ?? [] } };
  },
});
