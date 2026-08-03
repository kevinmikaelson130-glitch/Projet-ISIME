import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "respond_to_contact_message",
  title: "Répondre à un message",
  description: "Record an admin response on a contact message and mark it as answered.",
  inputSchema: {
    id: z.string().uuid().describe("Contact message id."),
    admin_response: z.string().min(1).describe("The response text to record."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ id, admin_response }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ admin_response, status: "answered", responded_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Message not found or not permitted" }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { message: data } };
  },
});
