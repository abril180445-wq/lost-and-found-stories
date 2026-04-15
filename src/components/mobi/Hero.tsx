import { ArrowRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";

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
  const yearsCount = useCountAnimation({ end: 8, duration: 2000 });
  const projectsCount = useCountAnimation({ end: 150, duration: 2500 });
  const clientsCount = useCountAnimation({ end: 50, duration: 2200 });
  const typedWord = useTypewriter(typingWords, 120, 80, 2500);

  const stats = [
    { value: yearsCount.count, suffix: "+", label: "Anos de experiência", ref: yearsCount.ref },
    { value: projectsCount.count, suffix: "+", label: "Projetos entregues", ref: projectsCount.ref },
    { value: clientsCount.count, suffix: "+", label: "Clientes satisfeitos", ref: clientsCount.ref },
  ];

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px]" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Overline */}
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-8 animate-fade-up">
            Software House — Desde 2016
          </p>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-8 leading-[1.05] tracking-tight animate-fade-up delay-100">
            Transformamos suas
            <br />
            <span className="text-primary relative inline-block min-w-[140px]">
              {typedWord}
              <span className="inline-block w-[2px] h-[0.8em] bg-primary/60 ml-0.5 animate-pulse align-middle" />
            </span>{" "}
            em sistemas
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up delay-200">
            Há mais de 8 anos desenvolvendo sistemas web, aplicativos mobile e
            soluções tecnológicas que impulsionam negócios.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-up delay-300">
            <a
              href="#contato"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-base hover:bg-foreground/90 transition-all duration-300"
            >
              Iniciar Projeto
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="#projetos"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-semibold text-base hover:bg-muted/50 transition-all duration-300"
            >
              Ver Portfólio
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-up delay-400">
            {stats.map((stat, index) => (
              <div key={index} ref={stat.ref} className="text-center">
                <div className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tabular-nums">
                  {stat.value}
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm mt-2 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-fade-in delay-500">
        <ChevronDown size={20} className="text-muted-foreground animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
