import { useEffect, useState } from 'react';
import { ShieldCheck, Trash2, UserPlus, Copy, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface AdminRow {
  user_id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

const ERRORS: Record<string, string> = {
  account_not_found:
    "Aucun compte n'existe avec cet email. La personne doit d'abord créer son compte sur la page de connexion admin.",
  already_admin: 'Cette personne est déjà administrateur.',
  cannot_remove_self: 'Vous ne pouvez pas retirer vos propres droits.',
  last_admin: 'Impossible : il doit toujours rester au moins un administrateur.',
  not_admin: "Votre compte n'a pas les droits administrateur.",
};

const errorText = (message: string) =>
  Object.entries(ERRORS).find(([code]) => message.includes(code))?.[1] ?? message;

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Jamais';

export const AdminAccounts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [toRemove, setToRemove] = useState<AdminRow | null>(null);

  const loginUrl = `${window.location.origin}/admin/login`;

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('list_admins');
    if (error) toast({ title: 'Erreur', description: errorText(error.message), variant: 'destructive' });
    setAdmins((data as AdminRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast({ title: 'Email invalide', description: 'Vérifiez l’adresse saisie.', variant: 'destructive' });
      return;
    }
    setAdding(true);
    const { error } = await supabase.rpc('add_admin_by_email', { _email: value });
    setAdding(false);
    if (error) {
      toast({ title: "Impossible d'ajouter", description: errorText(error.message), variant: 'destructive' });
      return;
    }
    toast({ title: 'Administrateur ajouté', description: `${value} peut maintenant se connecter à l’admin.` });
    setEmail('');
    load();
  };

  const confirmRemove = async () => {
    if (!toRemove) return;
    const { error } = await supabase.rpc('remove_admin', { _user_id: toRemove.user_id });
    if (error) {
      toast({ title: 'Impossible de retirer', description: errorText(error.message), variant: 'destructive' });
    } else {
      toast({ title: 'Droits retirés', description: `${toRemove.email} n’a plus accès à l’admin.` });
      load();
    }
    setToRemove(null);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(loginUrl);
    toast({ title: 'Lien copié' });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Comment ajouter un administrateur ?</p>
            <p>1. La personne crée son compte sur la page de connexion admin (« Pas encore de compte ? S'inscrire »).</p>
            <p>2. Vous saisissez ici son email puis cliquez sur « Ajouter ».</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-xs bg-muted px-3 py-2 rounded-lg break-all">{loginUrl}</code>
          <Button type="button" size="sm" variant="outline" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" />Copier le lien
          </Button>
        </div>
        <form onSubmit={add} className="space-y-2">
          <Label htmlFor="new-admin-email">Email du nouvel administrateur</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="new-admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom.nom@gmail.com"
              required
            />
            <Button type="submit" disabled={adding}>
              <UserPlus className="w-4 h-4 mr-2" />{adding ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Administrateurs actuels ({admins.length})</h2>
        {loading && <p className="text-muted-foreground text-sm">Chargement...</p>}
        {admins.map((a) => {
          const isMe = a.user_id === user?.id;
          return (
            <div key={a.user_id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{a.email}</p>
                <p className="text-xs text-muted-foreground">
                  Dernière connexion : {formatDate(a.last_sign_in_at)}
                </p>
              </div>
              {isMe ? (
                <Badge variant="secondary">Vous</Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setToRemove(a)}
                  disabled={admins.length <= 1}
                >
                  <Trash2 className="w-4 h-4 mr-1" />Retirer
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <AlertDialog open={!!toRemove} onOpenChange={(o) => !o && setToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer cet administrateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toRemove?.email} ne pourra plus ouvrir l’admin. Son compte n’est pas supprimé : vous pourrez le rajouter plus tard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
