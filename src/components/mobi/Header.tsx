import { useState, useEffect } from "react";
import { Menu, X, Instagram, Linkedin, Globe } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "#inicio" },
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços", href: "#servicos" },
    { name: "Projetos", href: "#projetos" },
    { name: "Contato", href: "#contato" },
  ];

  const socialLinks = [
    { icon: Instagram, href: settings.instagram_url, label: "Instagram" },
    { icon: Linkedin, href: settings.linkedin_url, label: "LinkedIn" },
    { icon: Globe, href: settings.website_url, label: "Website" },
  ].filter(link => link.href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 glass border-b border-border/30"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-400 rounded-xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
              <span className="text-primary-foreground font-heading font-bold text-lg">
                R
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-heading font-bold text-base tracking-tight leading-none">
                RORSCHACH
              </span>
              <span className="text-primary font-heading font-semibold text-xs tracking-widest">
                MOTION
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors duration-300 line-reveal"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA & Social */}
          <div className="hidden lg:flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </a>
            ))}
            <a
              href="#contato"
              className="btn-premium text-sm"
            >
              Solicite um Orçamento
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl glass-primary flex items-center justify-center text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-6 glass rounded-2xl animate-scale-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground font-medium py-2 hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-3 pt-4 border-t border-border/30">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
              <a
                href="#contato"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-premium text-center mt-2"
              >
                Solicite um Orçamento
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
