import { useState, useEffect, useCallback } from "react";
import { Menu, X, Instagram, Linkedin, Globe } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const { settings } = useSiteSettings();

  const navLinks = [
    { name: "Início", href: "#inicio" },
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços", href: "#servicos" },
    { name: "Projetos", href: "#projetos" },
    { name: "Blog", href: "#blog" },
    { name: "Contato", href: "#contato" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navLinks.map(l => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const socialLinks = [
    { icon: Instagram, href: settings.instagram_url, label: "Instagram" },
    { icon: Linkedin, href: settings.linkedin_url, label: "LinkedIn" },
    { icon: Globe, href: settings.website_url, label: "Website" },
  ].filter(link => link.href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 glass border-b border-border/30 shadow-lg shadow-background/20"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="#inicio" onClick={(e) => handleNavClick(e, "#inicio")} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-400 rounded-xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
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

          {/* Desktop Navigation with active indicator */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative font-medium text-sm transition-colors duration-300 py-1
                    ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                    after:bg-primary after:transition-transform after:duration-300 after:origin-left
                    ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
                  `}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA & Social */}
          <div className="hidden lg:flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </a>
            ))}
            <a
              href="#contato"
              onClick={(e) => handleNavClick(e, "#contato")}
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
            <div className="relative w-5 h-5">
              <span className={`absolute left-0 w-5 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'top-[9px] rotate-45' : 'top-1'}`} />
              <span className={`absolute left-0 top-[9px] w-5 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 w-5 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-[17px]'}`} />
            </div>
          </button>
        </nav>

        {/* Mobile Menu with smooth animation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 glass rounded-2xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`font-medium py-3 px-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="flex gap-3 pt-4 mt-2 border-t border-border/30">
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
                onClick={(e) => handleNavClick(e, "#contato")}
                className="btn-premium text-center mt-4"
              >
                Solicite um Orçamento
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
