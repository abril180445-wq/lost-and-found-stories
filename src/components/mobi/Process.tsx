import { Search, Palette, Code, TestTube, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Process = () => {
  const headerAnimation = useScrollAnimation();
  const stepsAnimation = useScrollAnimation();

  const steps = [
    { icon: Search, title: "Descoberta", description: "Levantamento de requisitos, análise de negócio e definição do escopo.", duration: "1-2 semanas" },
    { icon: Palette, title: "Design UX/UI", description: "Wireframes, protótipos e interfaces focadas na experiência do usuário.", duration: "1-2 semanas" },
    { icon: Code, title: "Desenvolvimento", description: "Codificação em sprints ágeis com entregas incrementais e feedback contínuo.", duration: "4-12 semanas" },
    { icon: TestTube, title: "Testes e QA", description: "Testes automatizados, manuais e de performance para garantir qualidade.", duration: "1-2 semanas" },
    { icon: Rocket, title: "Deploy", description: "Lançamento em produção com monitoramento, documentação e treinamento.", duration: "1 semana" },
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
            Nossa Metodologia
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Como <span className="text-primary">trabalhamos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Um processo ágil e estruturado para garantir entregas de qualidade no prazo.
          </p>
        </div>

        <div ref={stepsAnimation.ref} className="max-w-4xl mx-auto">
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`group relative flex items-start gap-6 transition-all duration-700 ${
                  stepsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Left line + number */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full border-2 border-border bg-background flex items-center justify-center text-sm font-heading font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors duration-300 z-10">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-full bg-border/50 min-h-[60px]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading font-bold text-lg text-foreground">
                      {step.title}
                    </h3>
                    <span className="text-xs text-primary/70 font-medium px-2 py-0.5 rounded-full bg-primary/5">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                    {step.description}
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

export default Process;
