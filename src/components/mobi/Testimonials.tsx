import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquare } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const Testimonials = () => {
  const headerAnimation = useScrollAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ricardo Mendes",
      company: "TechStart Brasil",
      role: "CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      text: "A Rorschach Motion desenvolveu nosso sistema ERP do zero. A qualidade do código e a entrega no prazo superaram todas as expectativas.",
      rating: 5
    },
    {
      id: 2,
      name: "Amanda Costa",
      company: "Loja Virtual AC",
      role: "Fundadora",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      text: "Nosso e-commerce ficou incrível! A plataforma é rápida, segura e as vendas aumentaram 200% após o lançamento.",
      rating: 5
    },
    {
      id: 3,
      name: "Fernando Oliveira",
      company: "Logística Express",
      role: "Diretor de TI",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "O app de rastreamento que desenvolveram revolucionou nossa operação. Clientes adoram acompanhar entregas em tempo real.",
      rating: 5
    },
    {
      id: 4,
      name: "Juliana Santos",
      company: "Clínica Saúde+",
      role: "Diretora",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      text: "O sistema de agendamento online facilitou muito nossa rotina. Interface intuitiva e suporte técnico excelente!",
      rating: 5
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const pauseAndGo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="depoimentos" className="section-padding bg-secondary/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />

      <div className="container-custom relative z-10">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 transition-all duration-700 ${
            headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <MessageSquare size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">Depoimentos</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O que nossos <span className="text-gradient">clientes</span> dizem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Depoimentos reais de quem confiou em nosso trabalho
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-600 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-2 sm:px-4">
                  <div className="glass border-gradient rounded-2xl p-6 sm:p-10 relative card-hover">
                    <Quote className="absolute top-4 right-4 w-16 h-16 text-primary/10" />
                    
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        loading="lazy"
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30 shadow-glow"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-foreground text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role} — {testimonial.company}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-foreground/90 text-lg leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => pauseAndGo((currentIndex - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-xl glass-primary flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => pauseAndGo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => pauseAndGo((currentIndex + 1) % testimonials.length)}
              className="w-10 h-10 rounded-xl glass-primary flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
