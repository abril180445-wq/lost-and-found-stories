import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const headerAnimation = useScrollAnimation();

  const faqs = [
    { question: "Quanto tempo leva para desenvolver um sistema?", answer: "O prazo varia conforme a complexidade. Um MVP pode levar de 4 a 8 semanas. Sistemas mais complexos podem levar de 3 a 6 meses." },
    { question: "Qual o custo médio de um projeto?", answer: "O investimento depende do escopo, funcionalidades e tecnologias envolvidas. Trabalhamos com orçamentos personalizados." },
    { question: "Vocês oferecem suporte após a entrega?", answer: "Sim! Todos os projetos incluem garantia de 90 dias para correção de bugs, além de planos de manutenção mensal." },
    { question: "Quais tecnologias vocês utilizam?", answer: "React, Next.js, React Native, Node.js, TypeScript, PostgreSQL, MongoDB, AWS, entre outras." },
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
