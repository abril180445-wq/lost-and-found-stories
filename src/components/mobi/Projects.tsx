import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { ExternalLink, CheckCircle, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectModal from "./ProjectModal";

interface ProjectScreen {
  url: string;
  label: string;
}

interface Project {
  title: string;
  subtitle: string;
  clientOrSegment: string;
  type: string;
  url: string;
  screens: ProjectScreen[];
}

const Projects = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const gridAnimation = useScrollAnimation({ threshold: 0.1 });
  
  // State for screenshots: { [projectUrl]: [screenshot1, screenshot2, screenshot3] }
  const [screenshots, setScreenshots] = useState<Record<string, string[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    { 
      title: "AgendaGlas", 
      subtitle: "Sistema de Agendamentos",
      clientOrSegment: "Salões de Beleza e Clínicas",
      type: "SaaS",
      url: "https://agendaglas.lovable.app",
      screens: [
        { url: "https://agendaglas.lovable.app", label: "Dashboard" },
        { url: "https://agendaglas.lovable.app/agendamentos", label: "Agendamentos" },
        { url: "https://agendaglas.lovable.app/clientes", label: "Clientes" },
      ]
    },
    { 
      title: "Tefilin", 
      subtitle: "Sistema de Gestão para Igrejas",
      clientOrSegment: "Igrejas e Ministérios",
      type: "Web App",
      url: "https://tefilin-53pv.vercel.app",
      screens: [
        { url: "https://tefilin-53pv.vercel.app", label: "Dashboard" },
        { url: "https://tefilin-53pv.vercel.app/membros", label: "Membros" },
        { url: "https://tefilin-53pv.vercel.app/financeiro", label: "Financeiro" },
      ]
    },
    { 
      title: "Seminário Teológico", 
      subtitle: "Plataforma EAD Completa",
      clientOrSegment: "Instituições de Ensino",
      type: "LMS",
      url: "https://seminarioteologico.lovable.app",
      screens: [
        { url: "https://seminarioteologico.lovable.app", label: "Home" },
        { url: "https://seminarioteologico.lovable.app/cursos", label: "Cursos" },
        { url: "https://seminarioteologico.lovable.app/aulas", label: "Aulas" },
      ]
    },
    { 
      title: "Bíblia Tefilin", 
      subtitle: "App de Estudo Bíblico",
      clientOrSegment: "Comunidade Cristã",
      type: "Web App",
      url: "https://bibliatefilin.lovable.app",
      screens: [
        { url: "https://bibliatefilin.lovable.app", label: "Home" },
        { url: "https://bibliatefilin.lovable.app/livros", label: "Livros" },
        { url: "https://bibliatefilin.lovable.app/leitura", label: "Leitura" },
      ]
    },
    { 
      title: "Visual Kit Manager", 
      subtitle: "Gestão de Identidade Visual",
      clientOrSegment: "Agências de Marketing",
      type: "SaaS",
      url: "https://visual-kit-manager.lovable.app",
      screens: [
        { url: "https://visual-kit-manager.lovable.app", label: "Dashboard" },
        { url: "https://visual-kit-manager.lovable.app/projetos", label: "Projetos" },
        { url: "https://visual-kit-manager.lovable.app/biblioteca", label: "Biblioteca" },
      ]
    },
    { 
      title: "Insight Image Suite", 
      subtitle: "Editor de Imagens com IA",
      clientOrSegment: "Designers e Criadores",
      type: "SaaS",
      url: "https://insight-image-suite.lovable.app",
      screens: [
        { url: "https://insight-image-suite.lovable.app", label: "Editor" },
        { url: "https://insight-image-suite.lovable.app/projetos", label: "Projetos" },
        { url: "https://insight-image-suite.lovable.app/galeria", label: "Galeria" },
      ]
    },
    { 
      title: "TatuagensStyle", 
      subtitle: "Portfólio de Estúdio",
      clientOrSegment: "Estúdios de Tatuagem",
      type: "Website",
      url: "https://tatuagen.lovable.app",
      screens: [
        { url: "https://tatuagen.lovable.app", label: "Home" },
        { url: "https://tatuagen.lovable.app/portfolio", label: "Portfólio" },
        { url: "https://tatuagen.lovable.app/artistas", label: "Artistas" },
      ]
    },
    { 
      title: "Rorschach Motion", 
      subtitle: "Site Institucional",
      clientOrSegment: "Rorschach Motion",
      type: "Website",
      url: "https://rorschachmotion.vercel.app",
      screens: [
        { url: "https://rorschachmotion.vercel.app", label: "Home" },
        { url: "https://rorschachmotion.vercel.app/portfolio", label: "Portfólio" },
        { url: "https://rorschachmotion.vercel.app/servicos", label: "Serviços" },
      ]
    },
  ];

  // Load screenshots for all projects on mount
  useEffect(() => {
    const loadAllScreenshots = async () => {
      for (const project of projects) {
        if (screenshots[project.url]?.length > 0 || loadingStates[project.url]) continue;
        
        setLoadingStates(prev => ({ ...prev, [project.url]: true }));
        
        const projectScreenshots: string[] = [];
        
        // Load each screen using its full URL
        for (const screen of project.screens) {
          const fullUrl = screen.url;
          try {
            const { data, error } = await supabase.functions.invoke('firecrawl-screenshot', {
              body: { url: fullUrl }
            });
            
            if (!error && data?.success && data?.screenshot) {
              const raw = String(data.screenshot);

              // Firecrawl can return either a public URL OR a base64 payload.
              const screenshotSrc = raw.startsWith("data:")
                ? raw
                : raw.startsWith("http://") || raw.startsWith("https://")
                  ? raw
                  : `data:image/png;base64,${raw}`;

              projectScreenshots.push(screenshotSrc);
            } else {
              console.error('Failed to load screenshot for', fullUrl, error || data?.error);
              projectScreenshots.push(''); // Empty string for failed screenshots
            }
          } catch (err) {
            console.error('Error loading screenshot:', fullUrl, err);
            projectScreenshots.push('');
          }
        }
        
        setScreenshots(prev => ({ ...prev, [project.url]: projectScreenshots }));
        setLoadingStates(prev => ({ ...prev, [project.url]: false }));
      }
    };
    
    loadAllScreenshots();
  }, []);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const getMainScreenshot = (projectUrl: string) => {
    return screenshots[projectUrl]?.[0] || '';
  };

  const isLoading = (projectUrl: string) => {
    return loadingStates[projectUrl] || (!screenshots[projectUrl] && !loadingStates[projectUrl]);
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
          {projects.map((project, index) => {
            const mainScreenshot = getMainScreenshot(project.url);
            const projectScreenshots = screenshots[project.url] || [];
            const loading = isLoading(project.url);
            const hasValidScreenshots = projectScreenshots.some(s => s);
            
            return (
              <div
                key={project.title}
                className={`group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-xl hover:shadow-black/10 ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} 
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Main Screenshot Area */}
                <div 
                  className="relative aspect-video bg-muted overflow-hidden cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  {/* Loading State */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  )}
                  
                  {/* Main Image */}
                  {!loading && mainScreenshot && (
                    <img
                      src={mainScreenshot}
                      alt={`Preview de ${project.title}`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Fallback */}
                  {!loading && !mainScreenshot && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/80">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{project.title.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{project.title}</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="flex items-center gap-2 text-white font-medium">
                      <Eye className="w-5 h-5" /> Ver telas
                    </span>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Entregue
                  </div>
                </div>

                {/* Thumbnail strip - 3 small previews */}
                {!loading && hasValidScreenshots && (
                  <div className="flex gap-1 p-2 bg-muted/50">
                    {project.screens.map((screen, screenIndex) => {
                      const screenshot = projectScreenshots[screenIndex];
                      return (
                        <button
                          key={screenIndex}
                          onClick={() => {
                            setSelectedProject(project);
                            setModalOpen(true);
                          }}
                          className="flex-1 aspect-video rounded overflow-hidden border border-border hover:border-white/30 transition-colors"
                        >
                          {screenshot ? (
                            <img
                              src={screenshot}
                              alt={screen.label}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-[8px] text-muted-foreground">{screen.label}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
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

      {/* Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={selectedProject}
        screenshots={selectedProject ? (screenshots[selectedProject.url] || []) : []}
        screenshotLabels={selectedProject ? selectedProject.screens.map(s => s.label) : []}
        isLoading={selectedProject ? loadingStates[selectedProject.url] : false}
      />
    </section>
  );
};

export default Projects;
