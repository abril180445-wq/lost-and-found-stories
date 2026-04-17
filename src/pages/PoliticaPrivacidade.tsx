import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo/SEO";

const PoliticaPrivacidade = () => (
  <div className="min-h-screen bg-background py-16 px-4">
    <SEO
      title="Política de Privacidade"
      description="Política de privacidade da Rorschach Motion. Saiba como coletamos, usamos e protegemos seus dados conforme a LGPD."
    />
    <article className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft size={16} /> Voltar
      </Link>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Política de Privacidade</h1>
      <p className="text-sm text-muted-foreground mb-10">Atualizada em {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">1. Quem somos</h2>
          <p>A Rorschach Motion é uma agência brasileira de motion design. Esta política descreve como tratamos seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">2. Dados que coletamos</h2>
          <p>Coletamos apenas dados que você nos fornece voluntariamente em formulários (nome, email, telefone, mensagem) e dados de navegação anônimos via cookies de análise (Google Analytics, Meta Pixel) — somente após seu consentimento.</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">3. Como usamos seus dados</h2>
          <p>Para responder seu contato, enviar propostas comerciais e analisar a performance do site. Não vendemos nem compartilhamos seus dados com terceiros sem autorização.</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">4. Cookies</h2>
          <p>Usamos cookies de tráfego (Google Analytics, Meta Pixel, Microsoft Clarity) para entender como o site é usado e melhorar sua experiência. Você pode aceitar ou recusar a qualquer momento no banner de cookies.</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">5. Seus direitos (LGPD)</h2>
          <p>Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados a qualquer momento pelo email <a href="mailto:contato@rorschachmotion.com.br" className="text-foreground underline">contato@rorschachmotion.com.br</a>.</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">6. Contato</h2>
          <p>Dúvidas? Fale conosco em <a href="mailto:contato@rorschachmotion.com.br" className="text-foreground underline">contato@rorschachmotion.com.br</a>.</p>
        </section>
      </div>
    </article>
  </div>
);

export default PoliticaPrivacidade;
