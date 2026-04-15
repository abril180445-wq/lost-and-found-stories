import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, Eye, Heart, CheckCircle } from "lucide-react";

const About = () => {
  const headerAnimation = useScrollAnimation();
  const contentAnimation = useScrollAnimation();

  const values = [
    {
      icon: Target,
      title: "Missão",
      description: "Desenvolver soluções de software inovadoras que resolvem problemas reais e impulsionam negócios.",
    },
    {
      icon: Eye,
      title: "Visão",
      description: "Ser referência em desenvolvimento de sistemas de alta qualidade no Brasil e América Latina.",
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Qualidade de código, metodologias ágeis, inovação constante e compromisso com resultados.",
    },
  ];

  const features = [
    "Desenvolvimento Web Full Stack",
    "Aplicações Mobile iOS e Android",
    "APIs e Integrações",
    "Arquitetura de Software",
    "DevOps e Cloud",
    "Suporte e Manutenção",
  ];

  return (
    <section id="sobre" className="py-20 lg:py-28 border-t border-border/30 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-4">
            Sobre Nós
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Quem é a <span className="text-primary">Rorschach Motion</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Somos uma software house especializada em desenvolvimento de sistemas,
            focada em criar soluções tecnológicas que impulsionam negócios.
          </p>
        </div>

        <div
          ref={contentAnimation.ref}
          className={`transition-all duration-700 ${
            contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border/50 bg-card/30 p-8 hover:border-primary/20 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <value.icon className="text-primary" size={20} />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-border/50 bg-card/30 p-8 lg:p-10">
            <h3 className="font-heading font-bold text-xl text-foreground mb-8 text-center">
              Por que nos escolher?
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
                >
                  <CheckCircle className="text-primary flex-shrink-0" size={18} />
                  <span className="text-foreground text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
