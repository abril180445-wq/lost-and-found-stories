import { MessageSquare, Palette, Film, Wand2, Rocket, Workflow } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Process = () => {
  const headerAnimation = useScrollAnimation();
  const timelineAnimation = useScrollAnimation();

  const steps = [
    {
      icon: MessageSquare,
      title: "Briefing",
      description: "Entendemos sua marca, objetivos e mensagem. Definimos o conceito criativo e direção artística.",
      duration: "1-2 dias",
    },
    {
      icon: Palette,
      title: "Storyboard",
      description: "Criamos storyboards e styleframes. Visualizamos a narrativa antes de animar.",
      duration: "3-5 dias",
    },
    {
      icon: Film,
      title: "Animação",
      description: "Damos vida ao projeto com motion graphics 2D/3D. Iterações para garantir perfeição.",
      duration: "1-3 semanas",
    },
    {
      icon: Wand2,
      title: "Pós-Produção",
      description: "Color grading, sound design e composição final. Polimento de cada detalhe.",
      duration: "3-5 dias",
    },
    {
      icon: Rocket,
      title: "Entrega",
      description: "Exportação em múltiplos formatos. Arquivos otimizados para cada plataforma.",
      duration: "1-2 dias",
    },
  ];

  return (
    <section className="section-padding bg-secondary/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />

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
            <Workflow size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Nossa Metodologia
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Como <span className="text-gradient">trabalhamos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Um processo criativo estruturado para garantir resultados visuais impactantes.
          </p>
        </div>

        <div ref={timelineAnimation.ref} className="relative max-w-4xl mx-auto">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent hidden md:block" />

          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative flex items-start gap-6 mb-12 last:mb-0 transition-all duration-700 ${
                timelineAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              } ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                <div
                  className={`glass-dark border-gradient rounded-2xl p-6 card-hover ${
                    index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                  } max-w-md`}
                >
                  <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                    <div className="md:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center border border-primary/20">
                      <step.icon className="text-primary" size={22} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-foreground">
                        {step.title}
                      </h3>
                      <span className="text-primary text-xs font-medium">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Center Icon (desktop) */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 items-center justify-center shadow-glow z-10">
                <step.icon className="text-primary-foreground" size={24} />
              </div>

              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
