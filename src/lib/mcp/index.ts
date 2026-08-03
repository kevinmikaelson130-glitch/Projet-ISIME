import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listApplications from "./tools/list-applications";
import getApplication from "./tools/get-application";
import updateApplicationStatus from "./tools/update-application-status";
import listContactMessages from "./tools/list-contact-messages";
import respondToMessage from "./tools/respond-to-message";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "projet-isime",
  title: "Projet ISIME",
  version: "0.1.0",
  instructions:
    "Tools for the ISIME institute website. Read and triage student applications and website contact messages. All tools act as the signed-in ISIME account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listApplications, getApplication, updateApplicationStatus, listContactMessages, respondToMessage],
});
