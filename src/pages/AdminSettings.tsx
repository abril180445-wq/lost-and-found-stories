import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Setting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
}

const FIELD_GROUPS = [
  {
    title: "Tracking & Analytics",
    description: "Cole os IDs das ferramentas de marketing. Os scripts carregam automaticamente após consentimento de cookies.",
    keys: ["gtm_id", "ga4_id", "google_ads_id", "meta_pixel_id", "tiktok_pixel_id", "clarity_id"],
  },
  {
    title: "Contato",
    description: "Informações de contato exibidas no site.",
    keys: ["whatsapp", "email", "phone"],
  },
];

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAdmin();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
      if (error) {
        toast.error("Erro ao carregar configurações");
        return;
      }
      setSettings(data ?? []);
      const map: Record<string, string> = {};
      (data ?? []).forEach((s) => (map[s.key] = s.value ?? ""));
      setValues(map);
      setLoaded(true);
    })();
  }, [isAdmin]);

  const save = async () => {
    setSaving(true);
    try {
      const updates = settings.map((s) =>
        supabase.from("site_settings").update({ value: values[s.key] || null }).eq("id", s.id),
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
      toast.success("Configurações salvas! Recarregue o site para aplicar.");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft size={16} className="mr-1" /> Admin
            </Button>
            <h1 className="text-xl font-bold">Configurações de Tráfego</h1>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
            Salvar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {FIELD_GROUPS.map((group) => (
          <section key={group.title} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{group.title}</h2>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            <div className="space-y-4 rounded-xl border border-border bg-card/30 p-5">
              {group.keys.map((key) => {
                const setting = settings.find((s) => s.key === key);
                if (!setting) return null;
                return (
                  <div key={key}>
                    <Label htmlFor={key} className="text-xs uppercase tracking-wider text-muted-foreground">
                      {key}
                    </Label>
                    {setting.description && (
                      <p className="text-xs text-muted-foreground mb-1">{setting.description}</p>
                    )}
                    <Input
                      id={key}
                      value={values[key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                      placeholder="Vazio = desativado"
                      className="font-mono text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default AdminSettings;
