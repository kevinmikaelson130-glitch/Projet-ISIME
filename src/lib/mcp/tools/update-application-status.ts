import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_application_status",
  title: "Mettre à jour une candidature",
  description: "Update the status and optional admin response of an ISIME application.",
  inputSchema: {
    id: z.string().uuid().describe("Application id."),
    status: z.enum(["pending", "reviewing", "accepted", "rejected"]).describe("New status."),
    admin_response: z.string().optional().describe("Optional message to record for the applicant."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ id, status, admin_response }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const patch: Record<string, unknown> = { status };
    if (admin_response) {
      patch.admin_response = admin_response;
      patch.responded_at = new Date().toISOString();
    }
    const { data, error } = await supabase.from("applications").update(patch).eq("id", id).select().maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Application not found or not permitted" }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { application: data } };
  },
});
