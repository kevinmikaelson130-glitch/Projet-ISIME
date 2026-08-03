import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_application",
  title: "Détail d'une candidature",
  description: "Get the full detail of one ISIME application by its id.",
  inputSchema: { id: z.string().uuid().describe("Application id.") },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Application not found" }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { application: data } };
  },
});
