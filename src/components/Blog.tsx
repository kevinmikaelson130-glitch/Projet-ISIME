import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, image_url, category, published_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Placeholder posts for demonstration when no real posts exist
  const placeholderPosts = [
    {
      id: "1",
      title: "Rentrée académique 2024-2025",
      slug: "rentree-academique-2024",
      excerpt: "Découvrez les dates importantes et les nouveautés pour cette nouvelle année académique à l'ISIME.",
      image_url: null,
      category: "Actualités",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Partenariat avec Microsoft",
      slug: "partenariat-microsoft",
      excerpt: "L'ISIME signe un nouveau partenariat stratégique avec Microsoft pour renforcer la formation digitale.",
      image_url: null,
      category: "Partenariats",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Conférence sur l'Intelligence Artificielle",
      slug: "conference-ia",
      excerpt: "Participez à notre conférence exclusive sur l'IA et son impact sur le monde professionnel.",
      image_url: null,
      category: "Événements",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ];

  const displayPosts = posts.length > 0 ? posts : placeholderPosts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="actualites" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Blog & Actualités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Restez Informé
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Découvrez les dernières actualités, événements et opportunités de l'ISIME.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={cardVariants}
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-primary/40 text-6xl font-bold">
                      ISIME
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    {post.category && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(
                        new Date(post.published_at || post.created_at),
                        "d MMM yyyy",
                        { locale: fr }
                      )}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <button className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all">
                    Lire la suite
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Voir toutes les actualités
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
