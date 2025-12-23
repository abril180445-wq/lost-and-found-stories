import { ArrowUp, Heart, Instagram, Linkedin, Globe, Youtube, Facebook } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Início", href: "#inicio" },
    { name: "Sobre", href: "#sobre" },
    { name: "Projetos", href: "#projetos" },
    { name: "Contato", href: "#contato" },
  ];

  const services = [
    "Sistemas Web",
    "Aplicativos Mobile",
    "APIs e Integrações",
    "E-commerce",
    "Consultoria em TI",
  ];

  const socialLinks = [
    { icon: Instagram, href: settings.instagram_url, label: "Instagram" },
    { icon: Facebook, href: settings.facebook_url, label: "Facebook" },
    { icon: Linkedin, href: settings.linkedin_url, label: "LinkedIn" },
    { icon: Youtube, href: settings.youtube_url, label: "YouTube" },
    { icon: Globe, href: settings.website_url, label: "Website" },
  ].filter(link => link.href);

  return (
    <footer className="bg-secondary/60 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container-custom relative z-10 pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#inicio" className="flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-cyan-400 rounded-xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
                <span className="text-primary-foreground font-heading font-bold text-xl">
                  R
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-heading font-bold text-lg tracking-tight leading-none">
                  RORSCHACH
                </span>
                <span className="text-primary font-heading font-semibold text-sm tracking-widest">
                  MOTION
                </span>
              </div>
            </a>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Há mais de 8 anos transformando ideias em soluções digitais
              inovadoras e escaláveis.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-glow transition-all duration-300"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-foreground font-bold text-lg mb-6">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 line-reveal inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-foreground font-bold text-lg mb-6">
              Serviços
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-foreground font-bold text-lg mb-6">
              Contato
            </h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>{settings.email}</li>
              <li>{settings.phone}</li>
              <li>{settings.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/30 gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            © {new Date().getFullYear()} Rorschach Motion. Feito com{" "}
            <Heart size={14} className="text-destructive" /> no Brasil.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
