import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const headerAnimation = useScrollAnimation();
  const formAnimation = useScrollAnimation();
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.message.trim()) newErrors.message = "Mensagem é obrigatória";
    else if (formData.message.trim().length < 10) newErrors.message = "Mensagem muito curta (mín. 10 caracteres)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSending(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    setIsSending(false);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: settings.email },
    { icon: Phone, label: "Telefone", value: settings.phone },
    { icon: MapPin, label: "Localização", value: settings.address },
  ];

  return (
    <section id="contato" className="section-padding bg-secondary/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="container-custom relative z-10">
        <div ref={headerAnimation.ref} className={`text-center mb-16 transition-all duration-700 ${headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Mail size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">Contato</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Vamos <span className="text-gradient">conversar</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pronto para transformar sua ideia em realidade? Entre em contato conosco.
          </p>
        </div>

        <div ref={formAnimation.ref} className={`grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto transition-all duration-700 ${formAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="space-y-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="glass border-gradient rounded-xl p-6 flex items-center gap-4 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{item.label}</p>
                  <p className="text-foreground font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="glass border-gradient rounded-2xl p-8 space-y-5" noValidate>
            <div>
              <input
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => { setFormData({...formData, name: e.target.value}); if (errors.name) setErrors(prev => ({...prev, name: ''})); }}
                aria-label="Seu nome"
                aria-invalid={!!errors.name}
                className={`w-full px-4 py-3 rounded-xl bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors ${errors.name ? 'border-destructive' : 'border-border/50'}`}
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Seu email"
                value={formData.email}
                onChange={(e) => { setFormData({...formData, email: e.target.value}); if (errors.email) setErrors(prev => ({...prev, email: ''})); }}
                aria-label="Seu email"
                aria-invalid={!!errors.email}
                className={`w-full px-4 py-3 rounded-xl bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-destructive' : 'border-border/50'}`}
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <textarea
                placeholder="Sua mensagem"
                value={formData.message}
                onChange={(e) => { setFormData({...formData, message: e.target.value}); if (errors.message) setErrors(prev => ({...prev, message: ''})); }}
                rows={4}
                aria-label="Sua mensagem"
                aria-invalid={!!errors.message}
                className={`w-full px-4 py-3 rounded-xl bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none transition-colors ${errors.message ? 'border-destructive' : 'border-border/50'}`}
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              <p className="text-xs text-muted-foreground mt-1 text-right">{formData.message.length}/500</p>
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="btn-premium w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Mensagem
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
