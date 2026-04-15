import { Linkedin, Github } from 'lucide-react';
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
  social: { linkedin?: string; github?: string };
}

const Team = () => {
  const { elementRef, isVisible } = useScrollAnimation();

  const teamMembers: TeamMember[] = [
    { id: 1, name: "Lucas Rorschach", role: "CEO & Tech Lead", image: team1, social: { linkedin: "#", github: "#" } },
    { id: 2, name: "Marina Costa", role: "Full Stack Developer", image: team2, social: { linkedin: "#", github: "#" } },
    { id: 3, name: "Rafael Santos", role: "Backend Developer", image: team3, social: { linkedin: "#", github: "#" } },
    { id: 4, name: "Camila Oliveira", role: "UX/UI Designer", image: team4, social: { linkedin: "#" } },
  ];

  return (
    <section id="team" className="py-20 lg:py-28 border-t border-border/30 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div
          ref={elementRef}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <p className="text-primary/80 font-medium text-sm tracking-[0.2em] uppercase mb-4">Equipe</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nosso <span className="text-primary">Time</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça os profissionais por trás das suas soluções tecnológicas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-heading font-bold text-foreground text-base mb-0.5">{member.name}</h3>
              <p className="text-primary/70 text-sm mb-3">{member.role}</p>
              <div className="flex justify-center gap-2">
                {member.social.linkedin && (
                  <a href={member.social.linkedin} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.social.github && (
                  <a href={member.social.github} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
