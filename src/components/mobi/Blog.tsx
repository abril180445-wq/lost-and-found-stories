import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Newspaper, ArrowRight, Calendar, Clock, User } from "lucide-react";

const Blog = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();

  const posts = [
    {
      id: 1,
      title: "Tendências de Motion Design para 2025",
      excerpt: "Descubra as principais tendências que estão moldando o futuro do motion design e como aplicá-las em seus projetos.",
      category: "Tendências",
      author: "Lucas Rorschach",
      date: "20 Dez 2024",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop"
    },
    {
      id: 2,
      title: "Cinema 4D vs Blender: Qual escolher?",
      excerpt: "Uma análise comparativa entre as duas ferramentas 3D mais populares do mercado para motion designers.",
      category: "Ferramentas",
      author: "Rafael Santos",
      date: "15 Dez 2024",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop"
    },
    {
      id: 3,
      title: "Como criar animações de marca impactantes",
      excerpt: "Guia completo para desenvolver animações de logo e identidade visual que fortalecem a presença da marca.",
      category: "Tutorial",
      author: "Marina Costa",
      date: "10 Dez 2024",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop"
    }
  ];

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
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`group glass border-gradient rounded-2xl overflow-hidden card-hover transition-all duration-500 ${
                gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-muted-foreground text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
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
                    {post.author}
                  </span>
                  <button className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Ler mais
                    <ArrowRight size={14} />
                  </button>
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
