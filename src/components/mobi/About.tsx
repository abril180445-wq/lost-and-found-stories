import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, Eye, Heart, CheckCircle, Users } from "lucide-react";

const About = () => {
  const headerAnimation = useScrollAnimation();
  const contentAnimation = useScrollAnimation();

  const values = [
    {
      icon: Target,
      title: "Missão",
      description: "Criar experiências visuais memoráveis que elevam marcas e conectam audiências através do movimento.",
    },
    {
      icon: Eye,
      title: "Visão",
      description: "Ser a referência em motion design e animação de alta qualidade no Brasil e América Latina.",
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Criatividade, excelência técnica, inovação constante e paixão por contar histórias visuais.",
    },
  ];

  const features = [
    "Animações 2D e 3D de alta qualidade",
    "Motion graphics para marcas",
    "Vídeos promocionais e institucionais",
    "Direção de arte visual",
    "Composição e VFX",
    "Color grading profissional",
  ];

  return (
    <section id="sobre" className="section-padding bg-secondary/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />

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
            <Users size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Sobre Nós
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Quem é a <span className="text-gradient">Rorschach Motion</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Somos um estúdio especializado em motion design e animação,
            focado em criar experiências visuais que impactam e inspiram.
          </p>
        </div>

        <div
          ref={contentAnimation.ref}
          className={`transition-all duration-700 ${
            contentAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="glass border-gradient rounded-2xl p-6 card-hover card-shine"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mb-4 border border-primary/20">
                  <value.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="glass border-gradient rounded-2xl p-8">
            <h3 className="font-heading font-bold text-xl text-foreground mb-6 text-center">
              Por que nos escolher?
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                >
                  <CheckCircle className="text-primary flex-shrink-0" size={20} />
                  <span className="text-foreground font-medium">{feature}</span>
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
