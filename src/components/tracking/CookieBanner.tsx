import { useEffect, useState } from "react";
import { hasConsent, setConsent } from "@/lib/tracking";
import { Cookie, X } from "lucide-react";

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lovable_cookie_consent");
    if (!stored) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    setConsent(true);
    setShow(false);
  };
  const reject = () => {
    setConsent(false);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-[100] bg-card border border-border rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-4"
    >
      <button
        onClick={reject}
        aria-label="Fechar e recusar"
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Cookie size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm mb-1">Privacidade e cookies</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Usamos cookies para analisar o tráfego e melhorar sua experiência. Você pode aceitar ou recusar a qualquer momento.
            Conforme a LGPD.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={reject}
          className="flex-1 py-2 px-3 rounded-lg border border-border text-foreground text-xs font-medium hover:bg-muted/50 transition-colors"
        >
          Recusar
        </button>
        <button
          onClick={accept}
          className="flex-1 py-2 px-3 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
        >
          Aceitar todos
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
