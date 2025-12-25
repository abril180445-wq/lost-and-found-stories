import { useState } from 'react';
import { Linkedin, Instagram, Github, Users } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

import team1 from '@/assets/team-1.jpg';
import team2 from '@/assets/team-2.jpg';
import team3 from '@/assets/team-3.jpg';
import team4 from '@/assets/team-4.jpg';

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
      name: "Lucas Rorschach",
      role: "CEO & Diretor Criativo",
      image: team1,
      bio: "Visionário criativo com mais de 10 anos de experiência em motion design e direção de arte.",
      social: {
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      id: 2,
      name: "Marina Costa",
      role: "Motion Designer Senior",
      image: team2,
      bio: "Especialista em animação 2D/3D e narrativas visuais impactantes.",
      social: {
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      id: 3,
      name: "Rafael Santos",
      role: "3D Artist & Compositor",
      image: team3,
      bio: "Artista 3D premiado focado em visualizações cinematográficas e VFX.",
      social: {
        linkedin: "#",
        github: "#"
      }
    },
    {
      id: 4,
      name: "Camila Oliveira",
      role: "Video Editor & Colorist",
      image: team4,
      bio: "Editora de vídeo com expertise em color grading e pós-produção.",
      social: {
        linkedin: "#",
        instagram: "#"
      }
    }
  ];

  return (
    <section id="team" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-10" />
      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={elementRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-primary mb-6">
            <Users size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">Equipe</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nosso <span className="text-gradient">Time</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça os profissionais por trás das suas experiências visuais
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="relative overflow-hidden rounded-2xl glass border-gradient p-6 hover:border-primary/50 transition-all duration-300 card-hover">
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-1 text-center">{member.name}</h3>
                <p className="text-primary text-sm mb-3 text-center">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4 text-center line-clamp-2">{member.bio}</p>
                
                <div className="flex justify-center gap-3">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="p-2 rounded-full bg-muted/50 hover:bg-primary/20 hover:text-primary transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a href={member.social.instagram} className="p-2 rounded-full bg-muted/50 hover:bg-primary/20 hover:text-primary transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="p-2 rounded-full bg-muted/50 hover:bg-primary/20 hover:text-primary transition-colors">
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
