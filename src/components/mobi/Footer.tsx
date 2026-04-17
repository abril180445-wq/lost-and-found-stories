import { ArrowUp, Instagram, Linkedin, Globe, Youtube, Facebook, Lock, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const quickLinks = [
    { name: "Início", href: "#inicio" },
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços", href: "#servicos" },
    { name: "Projetos", href: "#projetos" },
    { name: "Contato", href: "#contato" },
  ];

  const socialLinks = [
    { icon: Instagram, href: settings.instagram_url, label: "Instagram" },
    { icon: Facebook, href: settings.facebook_url, label: "Facebook" },
    { icon: Linkedin, href: settings.linkedin_url, label: "LinkedIn" },
    { icon: Youtube, href: settings.youtube_url, label: "YouTube" },
    { icon: Globe, href: settings.website_url, label: "Website" },
  ].filter(link => link.href);

  return (
    <footer className="border-t border-border/30">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">
              RORSCHACH<span className="text-primary">.</span>
            </span>
            <p className="text-muted-foreground text-sm mt-3 mb-5 leading-relaxed">
              Há mais de 8 anos desenvolvendo sistemas e soluções tecnológicas que impulsionam negócios.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-foreground font-semibold text-sm uppercase tracking-wider mb-4">Navegação</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-foreground font-semibold text-sm uppercase tracking-wider mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Desenvolvimento Web", "Aplicações Mobile", "APIs e Integrações", "DevOps e Cloud"].map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-foreground font-semibold text-sm uppercase tracking-wider mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {settings.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-primary/60 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-foreground transition-colors">{settings.email}</a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-primary/60 flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-foreground transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-primary/60 flex-shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/30 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Rorschach Motion
            </p>
            <Link to="/politica-privacidade" className="text-muted-foreground/70 hover:text-foreground text-xs transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="text-muted-foreground/70 hover:text-foreground text-xs transition-colors">
              Termos
            </Link>
            <Link to="/orcamento" className="text-muted-foreground/70 hover:text-foreground text-xs transition-colors">
              Orçamento
            </Link>
            <Link to="/admin/login" className="text-muted-foreground/40 hover:text-muted-foreground text-xs flex items-center gap-1 transition-colors">
              <Lock size={10} />
              Admin
            </Link>
          </div>
          <button onClick={scrollToTop} className="w-8 h-8 rounded-md border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all" aria-label="Voltar ao topo">
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
