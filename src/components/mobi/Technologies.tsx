import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Cpu } from "lucide-react";

const Technologies = () => {
  const { ref, isVisible } = useScrollAnimation();

  const technologies = [
    { name: "React", icon: "⚛️", category: "Frontend" },
    { name: "TypeScript", icon: "📘", category: "Language" },
    { name: "Node.js", icon: "🟢", category: "Backend" },
    { name: "PostgreSQL", icon: "🐘", category: "Database" },
    { name: "AWS", icon: "☁️", category: "Cloud" },
    { name: "Docker", icon: "🐳", category: "DevOps" },
    { name: "Next.js", icon: "▲", category: "Framework" },
    { name: "Tailwind", icon: "🎨", category: "Styling" },
  ];

  return (
    <section className="py-20 bg-secondary/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container-custom relative z-10" ref={ref}>
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Cpu size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Tecnologias
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Stack <span className="text-gradient">Tecnológico</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Utilizamos as tecnologias mais modernas do mercado para construir
            soluções robustas, escaláveis e de alta performance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className={`group glass-dark rounded-2xl p-6 text-center transition-all duration-500 card-hover ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                {tech.icon}
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                {tech.name}
              </h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {tech.category}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
        />
      </div>
    </section>
  );
};

export default Technologies;
