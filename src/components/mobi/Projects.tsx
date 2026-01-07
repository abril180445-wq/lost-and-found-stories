import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { ExternalLink, CheckCircle, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const Projects = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const gridAnimation = useScrollAnimation({ threshold: 0.1 });
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const projects = [
    { 
      title: "AgendaGlas", 
      subtitle: "Sistema de Agendamentos",
      clientOrSegment: "Salões de Beleza e Clínicas",
      type: "SaaS",
      url: "https://agendaglas.lovable.app",
    },
    { 
      title: "Tefilin", 
      subtitle: "Sistema de Gestão para Igrejas",
      clientOrSegment: "Igrejas e Ministérios",
      type: "Web App",
      url: "https://tefilin-53pv.vercel.app",
    },
    { 
      title: "Seminário Teológico", 
      subtitle: "Plataforma EAD Completa",
      clientOrSegment: "Instituições de Ensino",
      type: "LMS",
      url: "https://seminarioteologico.lovable.app",
    },
    { 
      title: "Bíblia Tefilin", 
      subtitle: "App de Estudo Bíblico",
      clientOrSegment: "Comunidade Cristã",
      type: "Web App",
      url: "https://bibliatefilin.lovable.app",
    },
    { 
      title: "Visual Kit Manager", 
      subtitle: "Gestão de Identidade Visual",
      clientOrSegment: "Agências de Marketing",
      type: "SaaS",
      url: "https://visual-kit-manager.lovable.app",
    },
    { 
      title: "Insight Image Suite", 
      subtitle: "Editor de Imagens com IA",
      clientOrSegment: "Designers e Criadores",
      type: "SaaS",
      url: "https://insight-image-suite.lovable.app",
    },
    { 
      title: "TatuagensStyle", 
      subtitle: "Portfólio de Estúdio",
      clientOrSegment: "Estúdios de Tatuagem",
      type: "Website",
      url: "https://tatuagen.lovable.app",
    },
    { 
      title: "Rorschach Motion", 
      subtitle: "Site Institucional",
      clientOrSegment: "Rorschach Motion",
      type: "Website",
      url: "https://rorschachmotion.vercel.app",
    },
  ];

  const loadImage = async (projectUrl: string) => {
    if (imageUrls[projectUrl] || imageLoading[projectUrl]) return;
    
    setImageLoading(prev => ({ ...prev, [projectUrl]: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('project-thumbnail', {
        body: { url: projectUrl }
      });
      
      if (error || !data) {
        throw new Error('Failed to load');
      }
      
      const blobUrl = URL.createObjectURL(data);
      setImageUrls(prev => ({ ...prev, [projectUrl]: blobUrl }));
    } catch (err) {
      console.error('Error loading screenshot:', err);
      setImageErrors(prev => ({ ...prev, [projectUrl]: true }));
    } finally {
      setImageLoading(prev => ({ ...prev, [projectUrl]: false }));
    }
  };

  return (
    <section id="projetos" className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Portfólio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Trabalhos Entregues
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Projetos reais que transformaram negócios e ideias em soluções digitais de sucesso
          </p>
        </div>

        {/* Projects Grid */}
        <div ref={gridAnimation.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => loadImage(project.url)}
              className={`group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} 
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Screenshot Area */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                {/* Loading State */}
                {imageLoading[project.url] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
                
                {/* Image */}
                {imageUrls[project.url] && !imageErrors[project.url] && (
                  <img
                    src={imageUrls[project.url]}
                    alt={`Preview de ${project.title}`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                
                {/* Fallback when no image loaded yet or error */}
                {!imageUrls[project.url] && !imageLoading[project.url] && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
                    <Globe className="w-12 h-12 text-muted-foreground/50" />
                    <span className="text-xs text-muted-foreground">Passe o mouse para carregar</span>
                  </div>
                )}
                
                {/* Error State */}
                {imageErrors[project.url] && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
                    <Globe className="w-12 h-12 text-muted-foreground/50" />
                    <span className="text-xs text-muted-foreground">{project.title}</span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="flex items-center gap-2 text-primary-foreground font-medium">
                    Ver projeto <ExternalLink className="w-4 h-4" />
                  </span>
                </div>

                {/* Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Entregue
                </div>
              </div>

              {/* Info Area - Clean solid background */}
              <div className="p-5 bg-card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <span className="shrink-0 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                    {project.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {project.subtitle}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {project.clientOrSegment}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            Quero meu projeto
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
