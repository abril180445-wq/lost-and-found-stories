import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Briefcase, ExternalLink, Building2, Globe, Loader2, CheckCircle2 } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const Projects = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  const projects = [
    { 
      title: "AgendaGlas", 
      subtitle: "Sistema de Agendamentos",
      clientOrSegment: "Salões de Beleza e Clínicas",
      type: "SaaS",
      url: "https://agendaglas.lovable.app",
      gradient: "from-violet-600 via-purple-600 to-indigo-700",
      accent: "violet"
    },
    { 
      title: "Tefilin", 
      subtitle: "Sistema de Gestão para Igrejas",
      clientOrSegment: "Igrejas e Ministérios",
      type: "Web App",
      url: "https://tefilin-53pv.vercel.app",
      gradient: "from-blue-600 via-cyan-600 to-teal-600",
      accent: "blue"
    },
    { 
      title: "Seminário Teológico", 
      subtitle: "Plataforma EAD Completa",
      clientOrSegment: "Instituições de Ensino",
      type: "LMS",
      url: "https://seminarioteologico.lovable.app",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      accent: "amber"
    },
    { 
      title: "Bíblia Tefilin", 
      subtitle: "App de Estudo Bíblico",
      clientOrSegment: "Comunidade Cristã",
      type: "Web App",
      url: "https://bibliatefilin.lovable.app",
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      accent: "emerald"
    },
    { 
      title: "Visual Kit Manager", 
      subtitle: "Gestão de Identidade Visual",
      clientOrSegment: "Agências de Marketing",
      type: "SaaS",
      url: "https://visual-kit-manager.lovable.app",
      gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
      accent: "rose"
    },
    { 
      title: "Insight Image Suite", 
      subtitle: "Editor de Imagens com IA",
      clientOrSegment: "Designers e Criadores",
      type: "SaaS",
      url: "https://insight-image-suite.lovable.app",
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      accent: "indigo"
    },
    { 
      title: "TatuagensStyle", 
      subtitle: "Portfólio de Estúdio",
      clientOrSegment: "Estúdios de Tatuagem",
      type: "Website",
      url: "https://tatuagen.lovable.app",
      gradient: "from-slate-700 via-zinc-700 to-neutral-800",
      accent: "slate"
    },
    { 
      title: "Rorschach Motion", 
      subtitle: "Site Institucional",
      clientOrSegment: "Rorschach Motion",
      type: "Website",
      url: "https://rorschachmotion.vercel.app",
      gradient: "from-primary via-purple-600 to-pink-600",
      accent: "primary"
    },
  ];

  const getScreenshotUrl = (siteUrl: string) => {
    return `${SUPABASE_URL}/functions/v1/project-thumbnail?url=${encodeURIComponent(siteUrl)}`;
  };

  return (
    <section id="projetos" className="section-padding bg-gradient-to-b from-background via-background/95 to-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 dots-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div ref={headerAnimation.ref} className={`text-center mb-16 transition-all duration-700 ${headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Briefcase size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">Portfólio</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trabalhos <span className="text-gradient">Entregues</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Projetos reais que transformaram negócios e impulsionaram resultados
          </p>
        </div>
        
        <div ref={gridAnimation.ref} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} 
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Card background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90`} />
              
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              
              {/* Screenshot preview */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {imageLoading[project.url] !== false && !imageErrors[project.url] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                
                {!imageErrors[project.url] && (
                  <img 
                    src={getScreenshotUrl(project.url)}
                    alt={`Screenshot de ${project.title}`}
                    className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110 ${imageLoading[project.url] === false ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                    onLoad={() => setImageLoading(prev => ({ ...prev, [project.url]: false }))}
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [project.url]: true }));
                      setImageLoading(prev => ({ ...prev, [project.url]: false }));
                    }}
                  />
                )}
                
                {imageErrors[project.url] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white/90 font-heading font-bold text-sm">
                        {project.title}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="relative p-4 bg-gradient-to-t from-black/60 to-transparent -mt-20 pt-24">
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/90 text-white shadow-lg">
                    <CheckCircle2 size={10} />
                    Entregue
                  </span>
                </div>
                
                {/* Project info */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-white text-lg leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-1">
                    {project.subtitle}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <Building2 size={12} />
                      <span className="truncate max-w-[100px]">{project.clientOrSegment}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white">
                      {project.type}
                    </span>
                  </div>
                </div>
                
                {/* Hover CTA */}
                <div className="mt-3 flex items-center gap-2 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Ver projeto</span>
                  <ExternalLink size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-muted-foreground mb-4">
            Quer um projeto assim para sua empresa?
          </p>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Fale Conosco
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;