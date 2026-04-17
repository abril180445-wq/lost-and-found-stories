import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { readUTMs } from "@/hooks/useUTMTracking";
import { track } from "@/lib/tracking";

const FormSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(120),
  email: z.string().trim().email("Email inválido").max(255),
  message: z.string().trim().min(10, "Mensagem muito curta (mín. 10 caracteres)").max(2000),
});

const Contact = () => {
  const headerAnimation = useScrollAnimation();
  const formAnimation = useScrollAnimation();
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = FormSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      Object.entries(result.error.flatten().fieldErrors).forEach(([k, v]) => {
        if (v?.[0]) errs[k] = v[0];
      });
      setErrors(errs);
      return;
    }
    setIsSending(true);
    try {
      const utms = readUTMs();
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          nome: formData.name,
          email: formData.email,
          mensagem: formData.message,
          ...utms,
          pagina_origem: window.location.href,
        },
      });
      if (error || (data as { error?: string })?.error) {
        throw new Error((data as { error?: string })?.error || error?.message || "Erro");
      }
      track.formSubmit("contato", {});
      track.conversion("lead");
      toast.success("Mensagem enviada com sucesso!");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: settings.email, onClick: () => track.emailClick() },
    { icon: Phone, label: "Telefone", value: settings.phone, onClick: () => track.phoneClick() },
    { icon: MapPin, label: "Localização", value: settings.address, onClick: undefined as undefined | (() => void) },
  ];

  return (
    <section id="contato" className="py-20 lg:py-28 border-t border-border/30 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-4">
            Contato
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Vamos <span className="text-primary">conversar</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pronto para transformar sua ideia em realidade? Entre em contato conosco.
          </p>
        </div>

        <div
          ref={formAnimation.ref}
          className={`grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto transition-all duration-700 ${formAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="space-y-4">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                onClick={item.onClick}
                className="flex items-center gap-4 p-5 rounded-xl border border-border/50 bg-card/30 hover:border-primary/20 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-foreground font-medium text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border/50 bg-card/30 p-8 space-y-5" noValidate>
            {[
              { key: "name", type: "text", placeholder: "Seu nome" },
              { key: "email", type: "email", placeholder: "Seu email" },
            ].map((field) => (
              <div key={field.key}>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => { setFormData({ ...formData, [field.key]: e.target.value }); if (errors[field.key]) setErrors(prev => ({ ...prev, [field.key]: '' })); }}
                  className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${errors[field.key] ? 'border-destructive' : 'border-border/50'}`}
                />
                {errors[field.key] && <p className="text-destructive text-xs mt-1">{errors[field.key]}</p>}
              </div>
            ))}
            <div>
              <textarea
                placeholder="Sua mensagem"
                value={formData.message}
                onChange={(e) => { setFormData({ ...formData, message: e.target.value }); if (errors.message) setErrors(prev => ({ ...prev, message: '' })); }}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none transition-colors ${errors.message ? 'border-destructive' : 'border-border/50'}`}
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-lg bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-60"
            >
              {isSending ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Send size={16} /> Enviar Mensagem</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
