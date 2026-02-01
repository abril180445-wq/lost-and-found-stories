import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import heroBgVideo from "@/assets/hero-bg.mp4";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Blog", href: "#blog" },
  { label: "Contato", href: "#contato" },
];

const Hero = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const yearsCount = useCountAnimation({ end: 8, duration: 2000 });
  const projectsCount = useCountAnimation({ end: 150, duration: 2500 });
  const clientsCount = useCountAnimation({ end: 50, duration: 2200 });

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace("#", ""));
      
      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { value: yearsCount.count, suffix: "+", label: "Anos de Experiência", ref: yearsCount.ref },
    { value: projectsCount.count, suffix: "+", label: "Projetos Entregues", ref: projectsCount.ref },
    { value: clientsCount.count, suffix: "+", label: "Clientes Satisfeitos", ref: clientsCount.ref },
  ];

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src={heroBgVideo} type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60" />
      
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-float-blob-1" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[150px] animate-float-blob-2" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Hero Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10 animate-fade-up">
            {navItems.map((item, index) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              
              return (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative text-sm font-medium tracking-wide transition-all duration-300 py-1
                    ${isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-primary"
                    }
                    after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 
                    after:bg-primary after:transition-transform after:duration-300 after:origin-left
                    ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
                  `}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-8 animate-fade-up delay-50">
            <Sparkles size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Desenvolvimento de Software
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-up delay-100">
            Transformamos suas{" "}
            <span className="text-gradient relative">
              ideias
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 animate-draw-line"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(185 80% 45%)" />
                    <stop offset="100%" stopColor="hsl(195 85% 55%)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            em sistemas
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            Há mais de 8 anos desenvolvendo sistemas web, aplicativos mobile e
            soluções tecnológicas que impulsionam negócios.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <a
              href="#contato"
              className="btn-premium flex items-center gap-2 group"
            >
              Iniciar Projeto
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>
            <a
              href="#projetos"
              className="px-6 py-3 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground font-semibold hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
            >
              Ver Portfólio
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-up delay-400">
            {stats.map((stat, index) => (
              <div
                key={index}
                ref={stat.ref}
                className="text-center p-4 rounded-2xl glass-primary border-glow"
              >
                <div className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-1">
                  {stat.value}
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500">
        <span className="text-muted-foreground text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-float" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
