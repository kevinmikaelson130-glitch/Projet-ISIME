import { useEffect, useState } from "react";
import { FileText, ExternalLink, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  APPLICATION_DOCUMENTS_BUCKET,
  documentLabelFromPath,
  fileExtension,
} from "@/lib/applicationDocuments";

interface Doc {
  path: string;
  url: string;
}

export const ApplicationDocuments = ({ applicationId }: { applicationId: string }) => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const bucket = supabase.storage.from(APPLICATION_DOCUMENTS_BUCKET);
      const { data: files } = await bucket.list(applicationId, { limit: 20 });
      const paths = (files ?? []).filter((f) => f.id).map((f) => `${applicationId}/${f.name}`);
      let result: Doc[] = [];
      if (paths.length) {
        const { data: signed } = await bucket.createSignedUrls(paths, 3600);
        result = (signed ?? [])
          .filter((s) => s.signedUrl && s.path)
          .map((s) => ({ path: s.path as string, url: s.signedUrl }));
      }
      if (!cancelled) {
        setDocs(result);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium flex items-center gap-2">
        <Paperclip className="w-4 h-4 text-primary" />
        Pièces du dossier
      </p>
      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement des pièces...</p>
      ) : docs.length === 0 ? (
        <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
          Aucune pièce envoyée en ligne pour ce dossier.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {docs.map((doc) => {
            const isImage = ["jpg", "jpeg", "png", "webp"].includes(fileExtension(doc.path));
            return (
              <a
                key={doc.path}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                {isImage ? (
                  <img src={doc.url} alt={documentLabelFromPath(doc.path)} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{documentLabelFromPath(doc.path)}</p>
                  <p className="text-xs text-muted-foreground uppercase">{fileExtension(doc.path)}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
