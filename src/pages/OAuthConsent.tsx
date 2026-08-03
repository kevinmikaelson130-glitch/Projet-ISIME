import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import isimeLogo from "@/assets/isime-logo.jpeg";

type AuthorizationDetails = {
  client?: { name?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Paramètre authorization_id manquant.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: decideError } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (decideError) {
      setBusy(false);
      setError(decideError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Aucune redirection renvoyée par le serveur d'autorisation.");
      return;
    }
    window.location.href = target;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="premium-card p-8 w-full max-w-md text-center">
        <img src={isimeLogo} alt="ISIME" className="w-16 h-16 mx-auto mb-4 rounded-xl object-cover" />
        {error ? (
          <>
            <h1 className="text-xl font-bold mb-2">Autorisation impossible</h1>
            <p className="text-sm text-destructive">{error}</p>
          </>
        ) : !details ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-2">
              Connecter {details.client?.name ?? "une application"} à votre compte
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {details.client?.name ?? "Cette application"} pourra accéder aux outils ISIME en votre nom.
            </p>
            <div className="flex gap-3 justify-center">
              <Button disabled={busy} onClick={() => decide(true)}>Autoriser</Button>
              <Button variant="outline" disabled={busy} onClick={() => decide(false)}>Refuser</Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthConsent;
