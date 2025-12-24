import { useState } from 'react';
import { ExternalLink, X, Eye } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

interface Site {
  id: number;
  name: string;
  category: string;
  image: string;
  url: string;
  description: string;
}

const DeliveredSites = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState<'institucional' | 'landing'>('institucional');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const institucionalSites: Site[] = [
    {
      id: 1,
      name: "TechCorp Solutions",
      category: "Tecnologia",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      url: "#",
      description: "Site institucional completo para empresa de tecnologia com área de clientes e blog integrado."
    },
    {
      id: 2,
      name: "Clínica Vida",
      category: "Saúde",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
      url: "#",
      description: "Portal médico com agendamento online e prontuário eletrônico."
    },
    {
      id: 3,
      name: "Construtora Horizonte",
      category: "Construção",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      url: "#",
      description: "Site institucional com galeria de empreendimentos e tour virtual."
    },
    {
      id: 4,
      name: "Advocacia Martins",
      category: "Jurídico",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
      url: "#",
      description: "Portal jurídico com área do cliente e consulta processual."
    },
    {
      id: 5,
      name: "Escola Futuro",
      category: "Educação",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
      url: "#",
      description: "Plataforma educacional com área do aluno e portal de matrículas."
    },
    {
      id: 6,
      name: "Hotel Paradise",
      category: "Hotelaria",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      url: "#",
      description: "Site de hotel com sistema de reservas e tour 360°."
    }
  ];

  const landingPages: Site[] = [
    {
      id: 7,
      name: "Curso de Marketing Digital",
      category: "Infoproduto",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1b9?w=600&h=400&fit=crop",
      url: "#",
      description: "Landing page de alta conversão para curso online com checkout integrado."
    },
    {
      id: 8,
      name: "App Fintech",
      category: "Aplicativo",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
      url: "#",
      description: "Página de lançamento de aplicativo financeiro com waitlist."
    },
    {
      id: 9,
      name: "Evento Tech Summit",
      category: "Evento",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      url: "#",
      description: "Landing page para evento de tecnologia com venda de ingressos."
    },
    {
      id: 10,
      name: "SaaS Analytics",
      category: "Software",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      url: "#",
      description: "Página de produto SaaS com trial gratuito e planos de assinatura."
    },
    {
      id: 11,
      name: "E-book Investimentos",
      category: "Infoproduto",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
      url: "#",
      description: "Landing page para captura de leads com download de e-book gratuito."
    },
    {
      id: 12,
      name: "Mentoria Empresarial",
      category: "Serviço",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      url: "#",
      description: "Página de vendas para programa de mentoria com depoimentos e cases."
    }
  ];

  const currentSites = activeTab === 'institucional' ? institucionalSites : landingPages;

  return (
    <section id="portfolio" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div
          ref={elementRef}
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sites <span className="text-primary">Entregues</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Confira alguns dos projetos que desenvolvemos para nossos clientes
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('institucional')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'institucional'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Sites Institucionais
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'landing'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Landing Pages
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSites.map((site, index) => (
            <div
              key={site.id}
              className={`group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={site.image}
                  alt={site.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setSelectedSite(site)}
                    className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-card text-foreground border border-border hover:border-primary hover:scale-110 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div className="p-4">
                <span className="text-xs text-primary font-medium">{site.category}</span>
                <h3 className="font-bold text-foreground mt-1">{site.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedSite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedSite(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden border border-border animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSite(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <img
              src={selectedSite.image}
              alt={selectedSite.name}
              className="w-full aspect-video object-cover"
            />
            
            <div className="p-6">
              <span className="text-sm text-primary font-medium">{selectedSite.category}</span>
              <h3 className="text-2xl font-bold text-foreground mt-1 mb-3">{selectedSite.name}</h3>
              <p className="text-muted-foreground mb-4">{selectedSite.description}</p>
              <a
                href={selectedSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              >
                Visitar Site <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeliveredSites;
