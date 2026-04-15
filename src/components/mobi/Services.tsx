import { Globe, Smartphone, Code, Cloud, ArrowUpRight } from "lucide-react";
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
    },
    {
      icon: Smartphone,
      title: "Aplicações Mobile",
      description: "Apps iOS e Android nativos e híbridos com experiência de usuário excepcional.",
      features: ["React Native", "Flutter", "iOS", "Android"],
    },
    {
      icon: Code,
      title: "APIs e Integrações",
      description: "APIs RESTful, microserviços e integrações com sistemas externos de forma segura.",
      features: ["REST API", "GraphQL", "Webhooks", "OAuth"],
    },
    {
      icon: Cloud,
      title: "DevOps e Cloud",
      description: "Infraestrutura escalável, deploy automatizado e CI/CD para suas aplicações.",
      features: ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
    },
  ];

  return (
    <section id="servicos" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-4">
            Nossos Serviços
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Soluções <span className="text-primary">sob medida</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Oferecemos um portfólio completo de serviços para transformar suas ideias em sistemas robustos.
          </p>
        </div>

        <div ref={gridAnimation.ref} className="grid md:grid-cols-2 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group bg-background p-8 lg:p-10 transition-all duration-500 hover:bg-card/80 ${
                gridAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <service.icon className="text-primary w-5 h-5" />
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-muted-foreground/0 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                />
              </div>

              <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
