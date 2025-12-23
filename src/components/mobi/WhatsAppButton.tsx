import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSiteSettings();

  const phoneNumber = settings.whatsapp.replace(/\D/g, '') || "5541997539084";
  const message = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre os serviços da Rorschach Motion."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 left-6 z-50 group transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      aria-label="Fale conosco pelo WhatsApp"
    >
      <div className="relative flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
        <Phone className="text-white" size={16} />
        <span className="text-white font-medium text-xs hidden sm:inline">WhatsApp</span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
