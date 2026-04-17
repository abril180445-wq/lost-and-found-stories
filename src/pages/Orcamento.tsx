import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { readUTMs } from "@/hooks/useUTMTracking";
import { track } from "@/lib/tracking";
import { SEO } from "@/components/seo/SEO";
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const Step1Schema = z.object({
  servico: z.string().min(1, "Selecione um serviço"),
});
const Step2Schema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(120),
  email: z.string().trim().email("Email inválido").max(255),
  telefone: z.string().trim().min(8, "Telefone inválido").max(40),
});
const Step3Schema = z.object({
  mensagem: z.string().trim().max(2000).optional(),
});

const SERVICOS = [
  "Motion Design",
  "Animação 3D",
  "Vídeo Institucional",
  "Branding em Movimento",
  "Edição de Vídeo",
  "Outro",
];

const Orcamento = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    servico: "",
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof typeof data, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const next = () => {
    const schemas = [Step1Schema, Step2Schema, Step3Schema];
    const result = schemas[step - 1].safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      Object.entries(result.error.flatten().fieldErrors).forEach(([k, v]) => {
        if (v?.[0]) errs[k] = v[0];
      });
      setErrors(errs);
      return;
    }
    if (step < 3) setStep(step + 1);
    else submit();
  };

  const submit = async () => {
    setSubmitting(true);
    track.ctaClick("orcamento_submit", "orcamento_page");
    try {
      const utms = readUTMs();
      const { data: resp, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...data,
          ...utms,
          pagina_origem: window.location.href,
        },
      });
      if (error || (resp as { error?: string })?.error) {
        throw new Error((resp as { error?: string })?.error || error?.message || "Erro");
      }
      track.formSubmit("orcamento", { servico: data.servico });
      track.conversion("lead");
      navigate("/obrigado");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Orçamento de Motion Design",
    provider: { "@type": "Organization", name: "Rorschach Motion" },
    areaServed: "BR",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Peça seu Orçamento Grátis | Motion Design Premium"
        description="Conte sobre seu projeto e receba um orçamento personalizado em até 24h. Motion design, vídeo e animação 3D para marcas que buscam impacto."
        jsonLd={jsonLd}
      />
      <header className="border-b border-border/40">
        <div className="container-custom py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="text-xs text-muted-foreground">Etapa {step} de 3</span>
        </div>
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-foreground transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Orçamento personalizado
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              {step === 1 && "Qual serviço você precisa?"}
              {step === 2 && "Como podemos te contatar?"}
              {step === 3 && "Conte um pouco do projeto"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Resposta em até 24h úteis. Sem compromisso.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/30 p-6 md:p-8">
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {SERVICOS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update("servico", s)}
                    className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                      data.servico === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border/50 hover:border-foreground/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                {errors.servico && (
                  <p className="text-destructive text-xs col-span-full">{errors.servico}</p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {[
                  { k: "nome", placeholder: "Seu nome completo", type: "text" },
                  { k: "email", placeholder: "Seu melhor email", type: "email" },
                  { k: "telefone", placeholder: "WhatsApp com DDD", type: "tel" },
                ].map((f) => (
                  <div key={f.k}>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={data[f.k as keyof typeof data]}
                      onChange={(e) => update(f.k as keyof typeof data, e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors ${
                        errors[f.k] ? "border-destructive" : "border-border/50"
                      }`}
                    />
                    {errors[f.k] && <p className="text-destructive text-xs mt-1">{errors[f.k]}</p>}
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div>
                <textarea
                  placeholder="Descreva brevemente o projeto, prazo desejado, referências... (opcional)"
                  value={data.mensagem}
                  onChange={(e) => update("mensagem", e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 resize-none transition-colors"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={submitting}
                  className="px-5 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/40 transition-colors"
                >
                  Voltar
                </button>
              )}
              <button
                type="button"
                onClick={next}
                disabled={submitting}
                className="flex-1 py-3 rounded-lg bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                ) : step === 3 ? (
                  <><Check size={16} /> Enviar pedido</>
                ) : (
                  <>Continuar <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
            <div><strong className="block text-foreground text-base">8+</strong> anos de mercado</div>
            <div><strong className="block text-foreground text-base">120+</strong> projetos entregues</div>
            <div><strong className="block text-foreground text-base">24h</strong> retorno médio</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orcamento;
