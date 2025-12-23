import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const headerAnimation = useScrollAnimation();
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso!");
    setFormData({ name: "", email: "", message: "" });
  };

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
        </div>
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="glass border-gradient rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><Mail className="text-primary" size={20} /></div>
              <div><p className="text-muted-foreground text-sm">Email</p><p className="text-foreground font-medium">{settings.email}</p></div>
            </div>
            <div className="glass border-gradient rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><Phone className="text-primary" size={20} /></div>
              <div><p className="text-muted-foreground text-sm">Telefone</p><p className="text-foreground font-medium">{settings.phone}</p></div>
            </div>
            <div className="glass border-gradient rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><MapPin className="text-primary" size={20} /></div>
              <div><p className="text-muted-foreground text-sm">Localização</p><p className="text-foreground font-medium">{settings.address}</p></div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="glass border-gradient rounded-2xl p-8 space-y-6">
            <input type="text" placeholder="Seu nome" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <input type="email" placeholder="Seu email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <textarea placeholder="Sua mensagem" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={4} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />
            <button type="submit" className="btn-premium w-full flex items-center justify-center gap-2">Enviar Mensagem <Send size={18} /></button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
