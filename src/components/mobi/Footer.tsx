import { ArrowUp, Heart, Instagram, Linkedin, Globe, Youtube, Facebook, Lock, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
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
    { name: "Blog", href: "#blog" },
    { name: "Contato", href: "#contato" },
  ];

  const services = [
    "Desenvolvimento Web",
    "Aplicações Mobile",
    "APIs e Integrações",
    "DevOps e Cloud",
    "Suporte e Manutenção",
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
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-cyan-400 rounded-xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
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
              Há mais de 8 anos desenvolvendo sistemas e soluções tecnológicas
              que impulsionam negócios.
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
                    className="w-10 h-10 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-glow hover:scale-110 transition-all duration-300"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-foreground font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-foreground font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              Serviços
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-muted-foreground hover:text-primary transition-colors duration-300 cursor-default">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact with icons */}
          <div>
            <h4 className="font-heading text-foreground font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              Contato
            </h4>
            <ul className="space-y-4 text-muted-foreground">
              {settings.email && (
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors duration-300">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors duration-300">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/30 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              © {new Date().getFullYear()} Rorschach Motion. Feito com{" "}
              <Heart size={14} className="text-destructive animate-pulse" /> no Brasil.
            </p>
            <Link
              to="/admin/login"
              className="text-muted-foreground/50 hover:text-primary text-xs flex items-center gap-1 transition-colors"
            >
              <Lock size={12} />
              Admin
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
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
