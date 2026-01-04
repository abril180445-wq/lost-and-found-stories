import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Briefcase, ExternalLink } from "lucide-react";

const getScreenshotUrl = (siteUrl: string) => {
  return `https://image.thum.io/get/width/640/crop/360/${encodeURIComponent(siteUrl)}`;
};

const Projects = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const projects = [
    { 
      title: "AgendaGlas", 
      category: "SaaS", 
      status: "Concluído",
      description: "Sistema de agendamentos inteligente para salões e clínicas com WhatsApp",
      url: "https://agendaglas.lovable.app",
      color: "from-violet-500 to-purple-600"
    },
    { 
      title: "Tefilin ERP", 
      category: "Web App", 
      status: "Concluído",
      description: "Sistema de gestão para igrejas com controle de membros e finanças",
      url: "https://tefilin-53pv.vercel.app",
      color: "from-blue-500 to-cyan-600"
    },
    { 
      title: "Seminário Teológico", 
      category: "LMS", 
      status: "Concluído",
      description: "Plataforma de cursos teológicos online com +50 cursos e certificados",
      url: "https://seminarioteologico.lovable.app",
      color: "from-amber-500 to-orange-600"
    },
    { 
      title: "Bíblia Tefilin", 
      category: "Web App", 
      status: "Concluído",
      description: "App de estudo bíblico com 2.300+ notas e Harpa Cristã",
      url: "https://bibliatefilin.lovable.app",
      color: "from-emerald-500 to-teal-600"
    },
    { 
      title: "Visual Kit Manager", 
      category: "SaaS", 
      status: "Concluído",
      description: "Sistema de gerenciamento de kits visuais e materiais de marketing",
      url: "https://visual-kit-manager.lovable.app",
      color: "from-rose-500 to-pink-600"
    },
    { 
      title: "Insight Image Suite", 
      category: "SaaS", 
      status: "Concluído",
      description: "Editor de imagens profissional com ferramentas de IA",
      url: "https://insight-image-suite.lovable.app",
      color: "from-indigo-500 to-blue-600"
    },
    { 
      title: "TatuagensStyle", 
      category: "Website", 
      status: "Concluído",
      description: "Portfólio para estúdio de tatuagem com gerador de arte via IA",
      url: "https://tatuagen.lovable.app",
      color: "from-slate-600 to-zinc-700"
    },
    { 
      title: "Rorschach Motion", 
      category: "Website", 
      status: "Concluído",
      description: "Site institucional da empresa com stack tecnológico e portfólio",
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
        <div ref={gridAnimation.ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <a 
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass border-gradient rounded-2xl overflow-hidden card-hover group transition-all duration-500 block ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video relative overflow-hidden bg-muted">
                {!imageErrors[project.url] && (
                  <img 
                    src={getScreenshotUrl(project.url)}
                    alt={`Screenshot de ${project.title}`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    onError={() => setImageErrors(prev => ({ ...prev, [project.url]: true }))}
                  />
                )}
                {imageErrors[project.url] && (
                  <div className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                    <span className="text-white/90 font-heading font-bold text-xl text-center px-4">
                      {project.title}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground">
                    <ExternalLink size={22} />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-base mb-1 truncate">{project.title}</h3>
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{project.description}</p>
                    <span className="text-primary text-xs font-medium">{project.category}</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full shrink-0 bg-green-500/20 text-green-400">
                    {project.status}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
