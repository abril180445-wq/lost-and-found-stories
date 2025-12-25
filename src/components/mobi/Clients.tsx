import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Building2 } from "lucide-react";

const Clients = () => {
  const headerAnimation = useScrollAnimation();

  const clients = [
    { name: "Netflix", initial: "N" },
    { name: "Spotify", initial: "S" },
    { name: "Nike", initial: "NK" },
    { name: "Adobe", initial: "A" },
    { name: "Apple", initial: "AP" },
    { name: "Google", initial: "G" },
    { name: "Meta", initial: "M" },
    { name: "Amazon", initial: "AZ" },
  ];

  return (
    <section className="py-16 bg-background/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-20" />

      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 transition-all duration-700 ${
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Building2 size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              Nossos Clientes
            </span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
            Empresas que <span className="text-gradient">confiam</span> em nós
          </h2>
        </div>

        <div className="glass-primary border-glow card-shine rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background/70 via-background/10 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background/70 via-background/10 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 group"
              >
                <div className="w-32 h-20 glass-primary-strong border-glow card-shine rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:brightness-110">
                  <div className="text-center">
                    <span className="font-heading font-bold text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
                      {client.initial}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {client.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
