import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { track } from "@/lib/tracking";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { config } = useSiteConfig();

  const phoneNumber = (config.whatsapp || "5541997539084").replace(/\D/g, "");
  const message = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre os serviços da Rorschach Motion.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track.whatsappClick()}
      className="fixed bottom-6 left-6 z-50 group transition-all duration-500"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <div className="relative flex items-center gap-1.5 px-3 py-2 rounded-full bg-foreground text-background shadow-md group-hover:scale-105 transition-all duration-300">
        <Phone size={16} />
        <span className="font-medium text-xs hidden sm:inline">WhatsApp</span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
