import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const headerAnimation = useScrollAnimation();

  const faqs = [
    { question: "Quanto tempo leva para criar uma animação?", answer: "O prazo varia conforme a complexidade. Um vídeo de 30 segundos pode levar de 1 a 2 semanas. Projetos maiores podem levar de 3 a 8 semanas." },
    { question: "Qual o investimento para um projeto de motion?", answer: "O valor depende da duração, complexidade e estilo da animação. Trabalhamos com orçamentos personalizados para cada projeto." },
    { question: "Vocês fazem revisões no projeto?", answer: "Sim! Cada projeto inclui rodadas de revisão em cada etapa (storyboard, animatic e animação final) para garantir sua satisfação." },
    { question: "Quais formatos de arquivo vocês entregam?", answer: "Entregamos em diversos formatos: MP4, MOV, GIF, WEBM, entre outros. Otimizamos para cada plataforma (web, TV, redes sociais)." },
    { question: "Vocês fazem animações 3D?", answer: "Sim! Trabalhamos com Cinema 4D, Blender e outros softwares 3D para criar visualizações de produto, ambientes e personagens." },
  ];

  return (
    <section className="section-padding bg-background/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-30" />
      <div className="container-custom relative z-10">
        <div ref={headerAnimation.ref} className={`text-center mb-16 transition-all duration-700 ${headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <HelpCircle size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">FAQ</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Perguntas <span className="text-gradient">Frequentes</span>
          </h2>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass border-gradient rounded-xl overflow-hidden border-b-0">
              <AccordionTrigger className="px-6 py-4 text-left font-heading font-semibold text-foreground hover:text-primary hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
