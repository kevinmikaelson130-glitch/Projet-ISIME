import { useEffect, useState } from 'react';
import { Newspaper, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

interface Post {
  id: string; title: string; excerpt: string | null; content: string;
  image_url: string | null; category: string | null;
  published_at: string | null; created_at: string;
}

export const News = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState<Post | null>(null);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published', true)
      .order('published_at', { ascending: false }).limit(6)
      .then(({ data }) => setPosts((data as Post[]) || []));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="actualites" className="section-padding bg-muted/40">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
            <Newspaper className="w-4 h-4" /> Actualités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Les dernières nouvelles d'ISIME</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <button key={p.id} onClick={() => setOpen(p)}
              className="text-left bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              {p.image_url && <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-48 object-cover" />}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  {p.category && <span className="text-primary font-semibold">{p.category}</span>}
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                    {format(new Date(p.published_at || p.created_at), 'd MMMM yyyy', { locale: fr })}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3">{p.excerpt || p.content}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{open?.title}</DialogTitle></DialogHeader>
          {open?.image_url && <img src={open.image_url} alt={open.title} className="w-full rounded-xl" />}
          <p className="whitespace-pre-line text-muted-foreground">{open?.content}</p>
        </DialogContent>
      </Dialog>
    </section>
  );
};
