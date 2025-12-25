import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Calendar } from "lucide-react";

const Timeline = () => {
  const headerAnimation = useScrollAnimation();
  const timelineAnimation = useScrollAnimation();

  const milestones = [
    {
      year: "2016",
      title: "O Início",
      description: "Fundação da Rorschach Motion com foco em motion graphics freelance.",
    },
    {
      year: "2018",
      title: "Expansão",
      description: "Primeiros grandes projetos de brand animation para empresas nacionais.",
    },
    {
      year: "2020",
      title: "Era 3D",
      description: "Integração de animação 3D e VFX ao portfólio de serviços.",
    },
    {
      year: "2022",
      title: "Consolidação",
      description: "Mais de 150 projetos entregues e parcerias com agências internacionais.",
    },
    {
      year: "2024",
      title: "Inovação",
      description: "Adoção de IA generativa e novas tecnologias de produção visual.",
    },
  ];

  return (
    <section className="section-padding bg-background/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-20" />

      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Calendar size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Nossa História
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Uma jornada de <span className="text-gradient">evolução</span>
          </h2>
        </div>

        <div ref={timelineAnimation.ref} className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          {milestones.map((milestone, index) => (
            <div
              key={milestone.year}
              className={`relative flex gap-8 mb-12 last:mb-0 transition-all duration-700 ${
                timelineAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              } ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"} pl-12 md:pl-0`}>
                <div className="glass border-gradient rounded-xl p-5 card-hover inline-block">
                  <span className="text-primary font-heading font-bold text-2xl">
                    {milestone.year}
                  </span>
                  <h3 className="font-heading font-bold text-foreground mt-2 mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {milestone.description}
                  </p>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-glow" />

              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
