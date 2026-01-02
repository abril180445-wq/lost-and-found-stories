import { Globe, Smartphone, Code, Cloud, ArrowRight, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Services = () => {
  const headerAnimation = useScrollAnimation();
  const gridAnimation = useScrollAnimation();

  const services = [
    {
      icon: Globe,
      title: "Desenvolvimento Web",
      description: "Sites, e-commerces e plataformas web robustas com as melhores tecnologias do mercado.",
      features: ["React", "Node.js", "TypeScript", "Next.js"],
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Smartphone,
      title: "Aplicações Mobile",
      description: "Apps iOS e Android nativos e híbridos com experiência de usuário excepcional.",
      features: ["React Native", "Flutter", "iOS", "Android"],
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Code,
      title: "APIs e Integrações",
      description: "APIs RESTful, microserviços e integrações com sistemas externos de forma segura.",
      features: ["REST API", "GraphQL", "Webhooks", "OAuth"],
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Cloud,
      title: "DevOps e Cloud",
      description: "Infraestrutura escalável, deploy automatizado e CI/CD para suas aplicações.",
      features: ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section id="servicos" className="section-padding bg-background/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-30" />
      <div className="absolute top-1/2 -translate-y-1/2 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

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
            <Sparkles size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Nossos Serviços
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Soluções <span className="text-gradient">sob medida</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Oferecemos um portfólio completo de serviços de desenvolvimento
            para transformar suas ideias em sistemas robustos.
          </p>
        </div>

        <div ref={gridAnimation.ref} className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group glass border-gradient rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-500 card-hover card-shine border-glow ${
                gridAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.color} p-0.5 flex-shrink-0 group-hover:shadow-lg group-hover:scale-105 transition-all duration-500`}
                >
                  <div className="w-full h-full rounded-xl sm:rounded-2xl bg-background/90 flex items-center justify-center group-hover:bg-background/70 transition-colors duration-300">
                    <service.icon className="text-foreground group-hover:scale-110 transition-transform duration-300 w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 flex justify-end">
                <a
                  href="#contato"
                  className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all duration-300"
                >
                  Saiba mais
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
