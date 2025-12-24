import { useState } from 'react';
import { Linkedin, Instagram, Github } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
}

const Team = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Alex Rorschach",
      role: "CEO & Diretor Criativo",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Visionário digital com mais de 10 anos de experiência em design e desenvolvimento.",
      social: {
        linkedin: "#",
        instagram: "#",
        github: "#"
      }
    },
    {
      id: 2,
      name: "Marina Silva",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
      bio: "Especialista em React e arquitetura de software escalável.",
      social: {
        linkedin: "#",
        github: "#"
      }
    },
    {
      id: 3,
      name: "Carlos Santos",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Designer premiado focado em experiências digitais memoráveis.",
      social: {
        linkedin: "#",
        instagram: "#"
      }
    }
  ];

  return (
    <section id="team" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div
          ref={elementRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nosso <span className="text-primary">Time</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça os profissionais por trás das suas experiências digitais
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group relative transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 hover:border-primary/50 transition-all duration-300">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                
                <div className="flex justify-center gap-3">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a href={member.social.instagram} className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
