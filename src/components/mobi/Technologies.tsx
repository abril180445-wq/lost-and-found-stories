import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Technologies = () => {
  const { ref, isVisible } = useScrollAnimation();

  const categories = [
    {
      title: "Frontend",
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
    },
    {
      title: "Backend",
      techs: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL"],
    },
    {
      title: "Mobile",
      techs: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)"],
    },
    {
      title: "Infra & DevOps",
      techs: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Vercel"],
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container-custom relative z-10" ref={ref}>
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-4">
            Stack Tecnológica
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tecnologias que <span className="text-primary">dominamos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trabalhamos com as ferramentas mais modernas do mercado para entregar soluções robustas e escaláveis.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((category, catIndex) => (
            <div
              key={category.title}
              className={`rounded-2xl border border-border/50 bg-card/50 p-6 transition-all duration-500 hover:border-primary/20 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${catIndex * 100}ms` }}
            >
              <h3 className="font-heading font-bold text-foreground text-sm uppercase tracking-wider mb-4 pb-3 border-b border-border/50">
                {category.title}
              </h3>
              <ul className="space-y-2.5">
                {category.techs.map((tech) => (
                  <li
                    key={tech}
                    className="text-muted-foreground text-sm flex items-center gap-2 hover:text-foreground transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
