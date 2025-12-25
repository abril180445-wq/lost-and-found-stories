import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Briefcase, Play, ExternalLink } from "lucide-react";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const Projects = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();

  const projects = [
    { 
      title: "Nebula Brand Identity", 
      category: "Motion Design", 
      status: "Concluído",
      description: "Animação de identidade visual para startup de tecnologia",
      image: project1
    },
    { 
      title: "Flow Motion Graphics", 
      category: "Motion Graphics", 
      status: "Concluído",
      description: "Vídeo institucional com motion graphics fluido",
      image: project2
    },
    { 
      title: "Architecture Visualization", 
      category: "3D Animation", 
      status: "Concluído",
      description: "Visualização arquitetônica cinematográfica",
      image: project3
    },
    { 
      title: "Luxury Product Launch", 
      category: "Brand Animation", 
      status: "Em andamento",
      description: "Campanha de lançamento para marca premium",
      image: project4
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
            Criações que transformam marcas e contam histórias através do movimento
          </p>
        </div>
        <div ref={gridAnimation.ref} className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div 
              key={project.title} 
              className={`glass border-gradient rounded-2xl overflow-hidden card-hover group transition-all duration-500 ${gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground hover:bg-primary transition-colors">
                    <Play size={24} fill="currentColor" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{project.description}</p>
                    <span className="text-primary text-xs font-medium">{project.category}</span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full shrink-0 ${project.status === "Concluído" ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"}`}>
                    {project.status}
                  </span>
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
