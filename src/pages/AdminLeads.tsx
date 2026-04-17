import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  servico: string | null;
  mensagem: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  fbclid: string | null;
  pagina_origem: string | null;
  created_at: string;
}

const AdminLeads = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast.error("Erro ao carregar leads");
      else setLeads((data as Lead[]) ?? []);
      setLoading(false);
    })();
  }, [isAdmin]);

  const exportCSV = () => {
    const headers = [
      "Data", "Nome", "Email", "Telefone", "Serviço", "Mensagem",
      "utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid", "Origem",
    ];
    const rows = filtered.map((l) => [
      new Date(l.created_at).toLocaleString("pt-BR"),
      l.nome, l.email, l.telefone ?? "", l.servico ?? "", (l.mensagem ?? "").replace(/\n/g, " "),
      l.utm_source ?? "", l.utm_medium ?? "", l.utm_campaign ?? "",
      l.gclid ?? "", l.fbclid ?? "", l.pagina_origem ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error("Erro ao excluir");
    setLeads((ls) => ls.filter((l) => l.id !== id));
    toast.success("Lead excluído");
  };

  const filtered = leads.filter(
    (l) =>
      !q ||
      l.nome.toLowerCase().includes(q.toLowerCase()) ||
      l.email.toLowerCase().includes(q.toLowerCase()) ||
      l.utm_source?.toLowerCase().includes(q.toLowerCase()),
  );

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft size={16} className="mr-1" /> Admin
            </Button>
            <h1 className="text-xl font-bold">Leads ({leads.length})</h1>
          </div>
          <Button onClick={exportCSV} disabled={!filtered.length}>
            <Download size={16} className="mr-2" /> Exportar CSV
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome, email, origem..." className="pl-9" />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum lead encontrado.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((l) => (
              <div key={l.id} className="rounded-xl border border-border bg-card/30 p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold">{l.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {l.email} {l.telefone && `· ${l.telefone}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(l.created_at).toLocaleString("pt-BR")} {l.servico && `· ${l.servico}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(l.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
                {l.mensagem && <p className="text-sm bg-background/40 rounded-lg p-3 mb-3">{l.mensagem}</p>}
                {(l.utm_source || l.gclid || l.fbclid) && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {l.utm_source && <span className="px-2 py-1 rounded bg-foreground/5 border border-border">source: {l.utm_source}</span>}
                    {l.utm_medium && <span className="px-2 py-1 rounded bg-foreground/5 border border-border">medium: {l.utm_medium}</span>}
                    {l.utm_campaign && <span className="px-2 py-1 rounded bg-foreground/5 border border-border">campaign: {l.utm_campaign}</span>}
                    {l.gclid && <span className="px-2 py-1 rounded bg-foreground/5 border border-border">gclid ✓</span>}
                    {l.fbclid && <span className="px-2 py-1 rounded bg-foreground/5 border border-border">fbclid ✓</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLeads;
