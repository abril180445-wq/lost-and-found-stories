import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Timeline = () => {
  const headerAnimation = useScrollAnimation();
  const timelineAnimation = useScrollAnimation();

  const milestones = [
    { year: "2016", title: "O Início", description: "Fundação da Rorschach Motion com foco em desenvolvimento freelance." },
    { year: "2018", title: "Expansão", description: "Primeiros grandes projetos de sistemas para empresas nacionais." },
    { year: "2020", title: "Consolidação", description: "Estruturação da equipe e processos ágeis." },
    { year: "2022", title: "Escala", description: "Mais de 150 projetos entregues e parcerias com agências." },
    { year: "2024", title: "Inovação", description: "Adoção de IA e novas tecnologias de desenvolvimento." },
  ];

  return (
    <section className="py-20 lg:py-28 border-t border-border/30 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-4">
            Nossa História
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Uma jornada de <span className="text-primary">evolução</span>
          </h2>
        </div>

        <div ref={timelineAnimation.ref} className="max-w-2xl mx-auto">
          <div className="flex flex-col">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`group flex items-start gap-6 transition-all duration-700 ${
                  timelineAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Year column */}
                <div className="flex flex-col items-center flex-shrink-0 w-16">
                  <span className="font-heading font-bold text-primary text-lg">
                    {milestone.year}
                  </span>
                  {index < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-border/50 min-h-[40px] mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <h3 className="font-heading font-bold text-foreground text-base mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
