import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Briefcase, ExternalLink, Building2, Globe, Loader2 } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const getScreenshotUrl = (siteUrl: string) => {
  return `${SUPABASE_URL}/functions/v1/project-thumbnail?url=${encodeURIComponent(siteUrl)}`;
};

const Projects = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>(() => 
    Object.fromEntries([
      "https://agendaglas.lovable.app",
      "https://tefilin-53pv.vercel.app",
      "https://seminarioteologico.lovable.app",
      "https://bibliatefilin.lovable.app",
      "https://visual-kit-manager.lovable.app",
      "https://insight-image-suite.lovable.app",
      "https://tatuagen.lovable.app",
      "https://rorschachmotion.vercel.app"
    ].map(url => [url, true]))
  );

  const projects = [
    { 
      title: "AgendaGlas - Sistema de Agendamentos", 
      clientOrSegment: "Salões de Beleza e Clínicas",
      type: "SaaS",
      url: "https://agendaglas.lovable.app",
      color: "from-violet-500 to-purple-600"
    },
    { 
      title: "Tefilin - Sistema de Gestão para Igrejas", 
      clientOrSegment: "Igrejas e Ministérios",
      type: "Web App",
      url: "https://tefilin-53pv.vercel.app",
      color: "from-blue-500 to-cyan-600"
    },
    { 
      title: "Seminário Teológico - Plataforma EAD", 
      clientOrSegment: "Instituições de Ensino",
      type: "LMS",
      url: "https://seminarioteologico.lovable.app",
      color: "from-amber-500 to-orange-600"
    },
    { 
      title: "Bíblia Tefilin - App de Estudo Bíblico", 
      clientOrSegment: "Comunidade Cristã",
      type: "Web App",
      url: "https://bibliatefilin.lovable.app",
      color: "from-emerald-500 to-teal-600"
    },
    { 
      title: "Visual Kit Manager", 
      clientOrSegment: "Agências de Marketing",
      type: "SaaS",
      url: "https://visual-kit-manager.lovable.app",
      color: "from-rose-500 to-pink-600"
    },
    { 
      title: "Insight Image Suite - Editor com IA", 
      clientOrSegment: "Designers e Criadores",
      type: "SaaS",
      url: "https://insight-image-suite.lovable.app",
      color: "from-indigo-500 to-blue-600"
    },
    { 
      title: "TatuagensStyle - Portfólio de Estúdio", 
      clientOrSegment: "Estúdios de Tatuagem",
      type: "Website",
      url: "https://tatuagen.lovable.app",
      color: "from-slate-600 to-zinc-700"
    },
    { 
      title: "Rorschach Motion - Site Institucional", 
      clientOrSegment: "Rorschach Motion",
      type: "Website",
      url: "https://rorschachmotion.vercel.app",
      color: "from-primary to-purple-600"
    },
  ];

  return (
    <section id="projetos" className="section-padding bg-background/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-20" />
      <div className="container-custom relative z-10">
        <div ref={headerAnimation.ref} className={`text-center mb-16 transition-all duration-700 ${headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Briefcase size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">Portfólio</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Nossos <span className="text-gradient">Projetos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Soluções tecnológicas que transformam negócios e impulsionam resultados
          </p>
        </div>
        
        <div ref={gridAnimation.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.title}
              className={`relative rounded-3xl overflow-hidden transition-all duration-500 group ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Blurred background layer */}
              <div className="absolute inset-0 overflow-hidden">
                {!imageErrors[project.url] ? (
                  <img 
                    src={getScreenshotUrl(project.url)}
                    alt=""
                    className="w-full h-full object-cover scale-110 blur-xl opacity-40"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${project.color} opacity-40`} />
                )}
              </div>
              
              {/* Card content */}
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-5 h-full flex flex-col">
                {/* Status badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                    Entregue
                  </span>
                </div>
                
                {/* Screenshot preview */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-border/30 shadow-2xl">
                  {imageLoading[project.url] && !imageErrors[project.url] && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                      <Loader2 className="w-8 h-8 text-white/80 animate-spin" />
                    </div>
                  )}
                  {!imageErrors[project.url] && (
                    <img 
                      src={getScreenshotUrl(project.url)}
                      alt={`Screenshot de ${project.title}`}
                      className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${imageLoading[project.url] ? 'opacity-0' : 'opacity-100'}`}
                      loading="lazy"
                      onLoad={() => setImageLoading(prev => ({ ...prev, [project.url]: false }))}
                      onError={() => {
                        setImageErrors(prev => ({ ...prev, [project.url]: true }));
                        setImageLoading(prev => ({ ...prev, [project.url]: false }));
                      }}
                    />
                  )}
                  {imageErrors[project.url] && (
                    <div className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                      <span className="text-white/90 font-heading font-bold text-lg text-center px-4">
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Project info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-foreground text-lg mb-3 pr-20 leading-tight">
                    {project.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Building2 size={14} className="text-primary shrink-0" />
                      <span className="truncate">{project.clientOrSegment}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Globe size={14} className="text-primary shrink-0" />
                      <span>{project.type}</span>
                    </div>
                  </div>
                  
                  {/* CTA Link */}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors group/link"
                  >
                    <span>Ver projeto</span>
                    <ExternalLink size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
