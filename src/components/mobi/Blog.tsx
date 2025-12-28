import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Newspaper, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  author: string | null;
  created_at: string;
}

const Blog = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Static fallback posts
  const staticPosts = [
    {
      id: "static-1",
      title: "Tendências de Motion Design para 2025",
      slug: "tendencias-motion-design-2025",
      excerpt: "Descubra as principais tendências que estão moldando o futuro do motion design e como aplicá-las em seus projetos.",
      category: "Tendências",
      author: "Rorschach Motion",
      created_at: "2024-12-20",
      image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop"
    },
    {
      id: "static-2",
      title: "Cinema 4D vs Blender: Qual escolher?",
      slug: "cinema-4d-vs-blender",
      excerpt: "Uma análise comparativa entre as duas ferramentas 3D mais populares do mercado para motion designers.",
      category: "Ferramentas",
      author: "Rorschach Motion",
      created_at: "2024-12-15",
      image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop"
    },
    {
      id: "static-3",
      title: "Como criar animações de marca impactantes",
      slug: "animacoes-marca-impactantes",
      excerpt: "Guia completo para desenvolver animações de logo e identidade visual que fortalecem a presença da marca.",
      category: "Tutorial",
      author: "Rorschach Motion",
      created_at: "2024-12-10",
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop"
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, image_url, category, author, created_at')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(staticPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts(staticPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const displayPosts = posts.length > 0 ? posts : staticPosts;

  return (
    <section id="blog" className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-10" />
      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Newspaper size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">Blog</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Insights & <span className="text-gradient">Artigos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fique por dentro das últimas novidades, tutoriais e tendências do mundo do motion design
          </p>
        </div>

        <div
          ref={gridAnimation.ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayPosts.map((post, index) => (
            <article
              key={post.id}
              className={`group glass border-gradient rounded-2xl overflow-hidden card-hover transition-all duration-500 ${
                gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <img
                  src={post.image_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                  {post.category || 'Motion Design'}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-muted-foreground text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    5 min
                  </span>
                </div>

                <h3 className="font-heading font-bold text-foreground text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground text-xs">
                    <User size={12} />
                    {post.author || 'Rorschach Motion'}
                  </span>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all"
                  >
                    Ler mais
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 btn-premium"
          >
            Ver todos os artigos
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
