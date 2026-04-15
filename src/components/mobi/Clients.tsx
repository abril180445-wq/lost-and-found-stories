import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Clients = () => {
  const headerAnimation = useScrollAnimation();

  const clients = [
    "Salões & Clínicas",
    "Igrejas & Ministérios",
    "Estúdios Criativos",
    "Instituições de Ensino",
    "Agências de Marketing",
    "E-commerces",
    "Startups",
    "Escritórios de Advocacia",
  ];

  return (
    <section className="py-16 border-y border-border/50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`transition-all duration-700 ${
            headerAnimation.isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-center text-muted-foreground text-sm tracking-wide uppercase mb-8">
            Segmentos que atendemos
          </p>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex animate-scroll">
              {[...clients, ...clients].map((client, index) => (
                <div key={index} className="flex-shrink-0 mx-6">
                  <span className="text-foreground/60 font-heading font-semibold text-base whitespace-nowrap hover:text-foreground transition-colors duration-300">
                    {client}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
