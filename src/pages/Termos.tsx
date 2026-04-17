import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo/SEO";

const Termos = () => (
  <div className="min-h-screen bg-background py-16 px-4">
    <SEO
      title="Termos de Uso"
      description="Termos de uso do site da Rorschach Motion."
    />
    <article className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft size={16} /> Voltar
      </Link>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Termos de Uso</h1>
      <p className="text-sm text-muted-foreground mb-10">Atualizado em {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">1. Aceitação</h2>
          <p>Ao acessar este site, você concorda com estes termos de uso. Se não concordar, não utilize o site.</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">2. Propriedade intelectual</h2>
          <p>Todo o conteúdo do site (textos, imagens, vídeos, código, marca) é de propriedade da Rorschach Motion ou licenciado, sendo protegido pela Lei de Direitos Autorais (Lei 9.610/98).</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">3. Uso permitido</h2>
          <p>Você pode navegar, ler e compartilhar links. Não é permitido copiar, reproduzir ou redistribuir conteúdo sem autorização.</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">4. Limitação de responsabilidade</h2>
          <p>O site é fornecido "como está". Não garantimos disponibilidade ininterrupta nem ausência de erros.</p>
        </section>
        <section>
          <h2 className="text-foreground text-lg font-semibold mb-2">5. Foro</h2>
          <p>Fica eleito o foro da comarca de Curitiba/PR para dirimir eventuais conflitos.</p>
        </section>
      </div>
    </article>
  </div>
);

export default Termos;
