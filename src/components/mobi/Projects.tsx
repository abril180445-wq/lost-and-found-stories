import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { ExternalLink, Loader2, ArrowRight } from "lucide-react";
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
  
  const [screenshots, setScreenshots] = useState<Record<string, string[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    { title: "AgendaGlas", subtitle: "Sistema de Agendamentos", clientOrSegment: "Salões de Beleza e Clínicas", type: "SaaS", url: "https://agendaglas.lovable.app", screens: [{ url: "https://agendaglas.lovable.app", label: "Dashboard" }, { url: "https://agendaglas.lovable.app/agendamentos", label: "Agendamentos" }, { url: "https://agendaglas.lovable.app/clientes", label: "Clientes" }] },
    { title: "Tefilin", subtitle: "Sistema de Gestão para Igrejas", clientOrSegment: "Igrejas e Ministérios", type: "Web App", url: "https://tefilin-53pv.vercel.app", screens: [{ url: "https://tefilin-53pv.vercel.app", label: "Dashboard" }, { url: "https://tefilin-53pv.vercel.app/membros", label: "Membros" }, { url: "https://tefilin-53pv.vercel.app/financeiro", label: "Financeiro" }] },
    { title: "Seminário Teológico", subtitle: "Plataforma EAD Completa", clientOrSegment: "Instituições de Ensino", type: "LMS", url: "https://seminarioteologico.lovable.app", screens: [{ url: "https://seminarioteologico.lovable.app", label: "Home" }, { url: "https://seminarioteologico.lovable.app/cursos", label: "Cursos" }, { url: "https://seminarioteologico.lovable.app/aulas", label: "Aulas" }] },
    { title: "Bíblia Tefilin", subtitle: "App de Estudo Bíblico", clientOrSegment: "Comunidade Cristã", type: "Web App", url: "https://bibliatefilin.lovable.app", screens: [{ url: "https://bibliatefilin.lovable.app", label: "Home" }, { url: "https://bibliatefilin.lovable.app/livros", label: "Livros" }, { url: "https://bibliatefilin.lovable.app/leitura", label: "Leitura" }] },
    { title: "Visual Kit Manager", subtitle: "Gestão de Identidade Visual", clientOrSegment: "Agências de Marketing", type: "SaaS", url: "https://visual-kit-manager.lovable.app", screens: [{ url: "https://visual-kit-manager.lovable.app", label: "Dashboard" }, { url: "https://visual-kit-manager.lovable.app/projetos", label: "Projetos" }, { url: "https://visual-kit-manager.lovable.app/biblioteca", label: "Biblioteca" }] },
    { title: "Insight Image Suite", subtitle: "Editor de Imagens com IA", clientOrSegment: "Designers e Criadores", type: "SaaS", url: "https://insight-image-suite.lovable.app", screens: [{ url: "https://insight-image-suite.lovable.app", label: "Editor" }, { url: "https://insight-image-suite.lovable.app/projetos", label: "Projetos" }, { url: "https://insight-image-suite.lovable.app/galeria", label: "Galeria" }] },
  ];

  useEffect(() => {
    const loadAllScreenshots = async () => {
      for (const project of projects) {
        if (screenshots[project.url]?.length > 0 || loadingStates[project.url]) continue;
        setLoadingStates(prev => ({ ...prev, [project.url]: true }));
        const projectScreenshots: string[] = [];
        for (const screen of project.screens) {
          try {
            const { data, error } = await supabase.functions.invoke('firecrawl-screenshot', { body: { url: screen.url } });
            if (!error && data?.success && data?.screenshot) {
              const raw = String(data.screenshot);
              const src = raw.startsWith("data:") ? raw : raw.startsWith("http") ? raw : `data:image/png;base64,${raw}`;
              projectScreenshots.push(src);
            } else {
              projectScreenshots.push('');
            }
          } catch {
            projectScreenshots.push('');
          }
        }
        setScreenshots(prev => ({ ...prev, [project.url]: projectScreenshots }));
        setLoadingStates(prev => ({ ...prev, [project.url]: false }));
      }
    };
    loadAllScreenshots();
  }, []);

  const getMainScreenshot = (url: string) => screenshots[url]?.[0] || '';
  const isLoading = (url: string) => loadingStates[url] || (!screenshots[url] && !loadingStates[url]);

  return (
    <section id="projetos" className="py-20 lg:py-28 border-t border-border/30 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-4">
            Portfólio
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Trabalhos entregues
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Projetos reais que transformaram negócios e ideias em soluções digitais
          </p>
        </div>

        <div ref={gridAnimation.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const mainScreenshot = getMainScreenshot(project.url);
            const loading = isLoading(project.url);
            
            return (
              <a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block rounded-2xl border border-border/50 overflow-hidden bg-card/30 hover:border-primary/20 transition-all duration-500 ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Screenshot */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                    </div>
                  )}
                  {!loading && mainScreenshot && (
                    <img
                      src={mainScreenshot}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground border border-border/50">
                    {project.type}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="#contato"
            className="group inline-flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors duration-300"
          >
            Quero meu projeto
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

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
