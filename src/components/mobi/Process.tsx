import { Search, Palette, Code, TestTube, Rocket, Workflow } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Process = () => {
  const headerAnimation = useScrollAnimation();
  const timelineAnimation = useScrollAnimation();

  const steps = [
    {
      icon: Search,
      title: "Discovery",
      description: "Entendemos seu negócio, objetivos e requisitos. Definimos escopo, funcionalidades e métricas de sucesso.",
      duration: "1-2 semanas",
    },
    {
      icon: Palette,
      title: "Design",
      description: "Criamos wireframes e protótipos interativos. Validamos a experiência do usuário antes de desenvolver.",
      duration: "1-2 semanas",
    },
    {
      icon: Code,
      title: "Desenvolvimento",
      description: "Codificamos com qualidade usando metodologias ágeis. Entregas semanais para acompanhamento em tempo real.",
      duration: "4-12 semanas",
    },
    {
      icon: TestTube,
      title: "Testes",
      description: "Testes automatizados e manuais garantem qualidade. QA rigoroso antes de cada entrega.",
      duration: "Contínuo",
    },
    {
      icon: Rocket,
      title: "Deploy",
      description: "Publicação em ambiente de produção com CI/CD. Monitoramento e otimização de performance.",
      duration: "1 semana",
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
            Um processo estruturado e transparente para garantir o sucesso do seu projeto.
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
