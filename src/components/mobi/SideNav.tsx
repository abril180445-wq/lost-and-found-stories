import { Compass } from "lucide-react";

const SideNav = () => {
  const navItems = [
    { label: "Início", href: "#inicio", hasIcon: true },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Projetos", href: "#projetos" },
    { label: "Blog", href: "#blog" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center py-8 px-4 bg-background/80 backdrop-blur-md border-r border-border/30 rounded-r-2xl">
      {navItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="flex flex-col items-center gap-1 py-3 px-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
        >
          {item.hasIcon && (
            <Compass 
              size={20} 
              className="text-primary mb-1 group-hover:rotate-45 transition-transform duration-300" 
            />
          )}
          <span className="text-sm font-medium tracking-wide">{item.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default SideNav;
