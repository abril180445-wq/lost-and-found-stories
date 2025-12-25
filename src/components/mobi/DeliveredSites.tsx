import { useState } from 'react';
import { ExternalLink, X, Eye, Play } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

import project1 from '@/assets/project-1.jpg';
import project2 from '@/assets/project-2.jpg';
import project3 from '@/assets/project-3.jpg';
import project4 from '@/assets/project-4.jpg';

interface Project {
  id: number;
  name: string;
  category: string;
  image: string;
  url: string;
  description: string;
}

const DeliveredSites = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState<'motion' | 'video'>('motion');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const motionProjects: Project[] = [
    {
      id: 1,
      name: "Nebula Brand Identity",
      category: "Brand Animation",
      image: project1,
      url: "#",
      description: "Animação completa de identidade visual para startup de tecnologia, incluindo logo animation e guidelines de movimento."
    },
    {
      id: 2,
      name: "Flow Campaign",
      category: "Motion Graphics",
      image: project2,
      url: "#",
      description: "Vídeo promocional com motion graphics fluido para campanha de marketing digital."
    },
    {
      id: 3,
      name: "Architecture Dreams",
      category: "3D Animation",
      image: project3,
      url: "#",
      description: "Visualização arquitetônica cinematográfica com tour virtual em 3D."
    },
    {
      id: 4,
      name: "Luxury Collection",
      category: "Product Video",
      image: project4,
      url: "#",
      description: "Campanha de lançamento para marca premium com visualização de produto em 3D."
    }
  ];

  const videoProjects: Project[] = [
    {
      id: 5,
      name: "Tech Summit 2024",
      category: "Event Video",
      image: project1,
      url: "#",
      description: "Vídeo de abertura e encerramento para evento de tecnologia com VFX e motion."
    },
    {
      id: 6,
      name: "Fintech App Launch",
      category: "Explainer Video",
      image: project2,
      url: "#",
      description: "Vídeo explicativo animado para lançamento de aplicativo financeiro."
    },
    {
      id: 7,
      name: "Corporate Vision",
      category: "Institutional",
      image: project3,
      url: "#",
      description: "Vídeo institucional com narrativa visual e motion graphics integrados."
    },
    {
      id: 8,
      name: "Social Media Pack",
      category: "Social Content",
      image: project4,
      url: "#",
      description: "Pacote de conteúdo animado para redes sociais com templates reutilizáveis."
    }
  ];

  const currentProjects = activeTab === 'motion' ? motionProjects : videoProjects;

  return (
    <section id="portfolio" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-20" />
      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={elementRef}
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Play size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">Portfólio</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trabalhos <span className="text-gradient">Entregues</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Confira alguns dos projetos de motion design que desenvolvemos
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('motion')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'motion'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Motion Graphics
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'video'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Vídeos
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-xl glass border-gradient hover:border-primary/50 transition-all duration-500 card-hover ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <span className="text-xs text-primary font-medium">{project.category}</span>
                <h3 className="font-bold text-foreground mt-1">{project.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden border border-border animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <img
              src={selectedProject.image}
              alt={selectedProject.name}
              className="w-full aspect-video object-cover"
            />
            
            <div className="p-6">
              <span className="text-sm text-primary font-medium">{selectedProject.category}</span>
              <h3 className="text-2xl font-bold text-foreground mt-1 mb-3">{selectedProject.name}</h3>
              <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              >
                Ver Projeto <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeliveredSites;
