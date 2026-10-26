import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Loader2, ArrowLeft, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApplicationResult = {
  kind: "application";
  first_name: string;
  program: string;
  status: string | null;
  admin_response: string | null;
  created_at: string;
  responded_at: string | null;
};

type MessageResult = {
  kind: "message";
  name: string;
  subject: string;
  message: string;
  status: string | null;
  admin_response: string | null;
  created_at: string;
  responded_at: string | null;
};

type Result = ApplicationResult | MessageResult;

const statusLabels: Record<string, string> = {
  pending: "En attente d'examen",
  reviewing: "En cours d'examen",
  accepted: "Acceptée",
  rejected: "Refusée",
  responded: "Réponse envoyée",
};

const messageStatusLabels: Record<string, string> = {
  pending: "En attente de réponse",
  responded: "Réponse disponible",
};

const subjectLabels: Record<string, string> = {
  admission: "Demande d'admission",
  information: "Demande d'information",
  visite: "Visite du campus",
  autre: "Autre",
};

const Track = () => {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [notFound, setNotFound] = useState(false);

  const search = async (value: string) => {
    const clean = value.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);

    if (clean.startsWith("MSG-")) {
      const { data } = await supabase.rpc("track_message", { _code: clean });
      const row = Array.isArray(data) ? data[0] : null;
      setLoading(false);
      if (row) setResult({ kind: "message", ...(row as Omit<MessageResult, "kind">) });
      else setNotFound(true);
      return;
    }

    const { data } = await supabase.rpc("track_application", { _code: clean });
    const row = Array.isArray(data) ? data[0] : null;
    setLoading(false);
    if (row) setResult({ kind: "application", ...(row as Omit<ApplicationResult, "kind">) });
    else setNotFound(true);
  };

  useEffect(() => {
    if (params.get("code")) search(params.get("code")!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-20 px-4">
      <div className="max-w-xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Suivi de candidature et de message</h1>
        <p className="text-muted-foreground mb-8">
          Saisissez le numéro reçu après l'envoi de votre candidature (ex. ISIME-1A2B3C4D) ou de votre message (ex. MSG-1A2B3C4D).
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(code);
          }}
          className="flex gap-3 mb-8"
        >
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ISIME-XXXXXXXX ou MSG-XXXXXXXX" className="font-mono" aria-label="Numéro de suivi" />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="ml-2">Rechercher</span>
          </Button>
        </form>

        {notFound && (
          <p className="bg-destructive/10 text-destructive rounded-xl p-4">
            Aucun dossier trouvé avec ce numéro. Vérifiez qu'il est bien recopié.
          </p>
        )}

        {result?.kind === "application" && (
          <div className="bg-card rounded-2xl shadow-xl p-6 space-y-4">
            <p className="text-lg">Bonjour <strong>{result.first_name}</strong>,</p>
            <div>
              <p className="text-sm text-muted-foreground">Programme</p>
              <p className="font-medium">{result.program}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Déposée le</p>
              <p className="font-medium">{new Date(result.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <p className="font-semibold text-primary">{statusLabels[result.status ?? "pending"] ?? result.status}</p>
            </div>
            {result.admin_response && (
              <div>
                <p className="text-sm text-muted-foreground">Réponse de l'ISIME</p>
                <p className="whitespace-pre-wrap">{result.admin_response}</p>
              </div>
            )}
          </div>
        )}

        {result?.kind === "message" && (
          <div className="bg-card rounded-2xl shadow-xl p-6 space-y-4">
            <p className="text-lg">Bonjour <strong>{result.name}</strong>,</p>
            <div>
              <p className="text-sm text-muted-foreground">Sujet</p>
              <p className="font-medium">{subjectLabels[result.subject] ?? result.subject}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Votre message du {new Date(result.created_at).toLocaleDateString("fr-FR")}</p>
              <p className="whitespace-pre-wrap text-muted-foreground">{result.message}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <p className="font-semibold text-primary">
                {result.admin_response ? messageStatusLabels.responded : messageStatusLabels.pending}
              </p>
            </div>
            {result.admin_response ? (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Réponse de l'ISIME</p>
                <p className="whitespace-pre-wrap">{result.admin_response}</p>
                {result.responded_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Répondu le {new Date(result.responded_at).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nous n'avons pas encore répondu. Revenez bientôt avec le même numéro.</p>
            )}
          </div>
        )}

        <div className="bg-card rounded-2xl shadow-xl p-6 mt-8 flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Une question sur votre dossier ?</p>
            <p className="text-sm text-muted-foreground mb-3">
              Appelez l'ISIME au 038 93 946 11 (lun - ven, 8h00 - 17h00) et indiquez votre numéro de suivi.
            </p>
            <a href="tel:0389394611" className="btn-primary">
              <Phone className="w-4 h-4" />
              <span>Appeler le 038 93 946 11</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Track;
