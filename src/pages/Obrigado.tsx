import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { trackEvent } from "@/lib/tracking";

const Obrigado = () => {
  useEffect(() => {
    // Conversion event for GA4 / Meta / Google Ads
    trackEvent("generate_lead", { value: 1, currency: "BRL" });
    trackEvent("Lead"); // Meta standard
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <SEO
        title="Pedido recebido — em breve entraremos em contato"
        description="Recebemos seu pedido de orçamento. Nossa equipe responderá em até 24h úteis."
        noindex
      />
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 rounded-full bg-foreground/5 border border-border flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-foreground" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Pedido recebido
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          Obrigado pelo contato!
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Recebemos suas informações com sucesso. Nossa equipe vai analisar seu pedido e responder em até <strong className="text-foreground">24 horas úteis</strong> com uma proposta personalizada.
        </p>

        <div className="rounded-2xl border border-border/60 bg-card/30 p-5 mb-8 text-left">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Próximos passos</p>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-3"><span className="text-muted-foreground">01</span> Análise do seu briefing</li>
            <li className="flex gap-3"><span className="text-muted-foreground">02</span> Envio da proposta detalhada</li>
            <li className="flex gap-3"><span className="text-muted-foreground">03</span> Reunião de alinhamento (se quiser)</li>
          </ol>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/40 transition-colors"
        >
          Voltar para o início <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Obrigado;
