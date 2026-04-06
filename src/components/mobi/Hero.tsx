import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Blog", href: "#blog" },
  { label: "Contato", href: "#contato" },
];

const typingWords = ["ideias", "visões", "projetos", "negócios"];

const useTypewriter = (words: string[], typingSpeed = 100, deletingSpeed = 60, pauseTime = 2000) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.slice(0, text.length + 1));
        if (text.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setText(currentWord.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

const Hero = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const yearsCount = useCountAnimation({ end: 8, duration: 2000 });
  const projectsCount = useCountAnimation({ end: 150, duration: 2500 });
  const clientsCount = useCountAnimation({ end: 50, duration: 2200 });
  const typedWord = useTypewriter(typingWords, 120, 80, 2500);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace("#", ""));
      
      for (const sectionId of [...sections].reverse()) {
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

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const stats = [
    { value: yearsCount.count, suffix: "+", label: "Anos de Experiência", ref: yearsCount.ref },
    { value: projectsCount.count, suffix: "+", label: "Projetos Entregues", ref: projectsCount.ref },
    { value: clientsCount.count, suffix: "+", label: "Clientes Satisfeitos", ref: clientsCount.ref },
  ];

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-float-blob-1" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[150px] animate-float-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />

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
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Desenvolvimento de Software
            </span>
          </div>

          {/* Headline with typewriter */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-up delay-100">
            Transformamos suas{" "}
            <span className="text-gradient relative inline-block min-w-[120px]">
              {typedWord}
              <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 animate-pulse align-middle" />
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

          {/* Stats with hover effect */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-up delay-400">
            {stats.map((stat, index) => (
              <div
                key={index}
                ref={stat.ref}
                className="text-center p-4 rounded-2xl glass-primary border-glow group hover:scale-105 transition-transform duration-300"
              >
                <div className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-1">
                  {stat.value}
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-primary transition-colors duration-300">
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
