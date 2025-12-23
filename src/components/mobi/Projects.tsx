import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Briefcase, ExternalLink } from "lucide-react";

const Projects = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();

  const projects = [
    { title: "E-commerce Platform", category: "Web", status: "Concluído" },
    { title: "App de Delivery", category: "Mobile", status: "Concluído" },
    { title: "Dashboard Analytics", category: "Web", status: "Concluído" },
    { title: "Sistema de Gestão", category: "Web", status: "Em andamento" },
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
        </div>
        <div ref={gridAnimation.ref} className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={project.title} className={`glass border-gradient rounded-2xl p-6 card-hover transition-all duration-500 ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="aspect-video bg-muted/50 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-muted-foreground">Preview</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-foreground">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.category}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${project.status === "Concluído" ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"}`}>{project.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
