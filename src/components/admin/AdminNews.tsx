import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  image_url: string | null; category: string | null; published: boolean | null;
  published_at: string | null; created_at: string;
}
const empty = { title: '', excerpt: '', content: '', image_url: '', category: '', published: true };

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  + '-' + Date.now().toString(36);

export const AdminNews = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data as Post[]) || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({ title: p.title, excerpt: p.excerpt || '', content: p.content, image_url: p.image_url || '', category: p.category || '', published: !!p.published });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: 'Titre et contenu obligatoires', variant: 'destructive' }); return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(), excerpt: form.excerpt || null, content: form.content,
      image_url: form.image_url || null, category: form.category || null, published: form.published,
      published_at: form.published ? (editing?.published_at || new Date().toISOString()) : null,
    };
    const { error } = editing
      ? await supabase.from('blog_posts').update(payload).eq('id', editing.id)
      : await supabase.from('blog_posts').insert({ ...payload, slug: slugify(form.title) });
    setSaving(false);
    if (error) { toast({ title: 'Erreur', description: error.message, variant: 'destructive' }); return; }
    toast({ title: editing ? 'Actualité modifiée' : 'Actualité publiée' });
    setOpen(false); load();
  };

  const remove = async (p: Post) => {
    if (!confirm(`Supprimer « ${p.title} » ?`)) return;
    await supabase.from('blog_posts').delete().eq('id', p.id);
    load();
  };

  return (
    <div className="space-y-4">
      <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nouvelle actualité</Button>
      {posts.length === 0 && <p className="text-muted-foreground">Aucune actualité pour le moment.</p>}
      <div className="grid gap-3">
        {posts.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            {p.image_url && <img src={p.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{p.title}</p>
              <p className="text-sm text-muted-foreground truncate">{p.excerpt || p.content}</p>
            </div>
            <Badge variant={p.published ? 'default' : 'secondary'}>
              {p.published ? <><Eye className="w-3 h-3 mr-1" />Publiée</> : <><EyeOff className="w-3 h-3 mr-1" />Brouillon</>}
            </Badge>
            <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => remove(p)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Modifier l'actualité" : 'Nouvelle actualité'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Titre *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Catégorie (ex : Événement, Réussite)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Lien d'une image (optionnel)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <Input placeholder="Résumé court" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            <Textarea rows={8} placeholder="Contenu *" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Publier sur le site
            </label>
            <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
