import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Clock } from 'lucide-react';

interface AILog {
  id: string;
  created_at: string;
  source: string;
  status: string;
  topic: string | null;
  post_id: string | null;
  post_slug: string | null;
  post_title: string | null;
  error_message: string | null;
  duration_ms: number | null;
}

const AdminAIHistory = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdmin();
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/admin/login');
  }, [isAdmin, isLoading, navigate]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ai_generation_log' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setLogs((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) fetchLogs(); }, [isAdmin]);

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    error: logs.filter(l => l.status === 'error').length,
    avgMs: logs.length ? Math.round(logs.reduce((s, l) => s + (l.duration_ms || 0), 0) / logs.length) : 0,
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background dark text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Admin
          </Link>
          <Button variant="outline" size="sm" onClick={fetchLogs}><RefreshCw className="w-4 h-4 mr-1" /> Atualizar</Button>
        </div>

        <h1 className="text-3xl font-bold mb-2">Histórico de Geração IA</h1>
        <p className="text-muted-foreground mb-8">Todas as execuções automáticas e manuais do gerador de blog.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Sucesso</div>
            <div className="text-2xl font-bold text-green-500">{stats.success}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Falhas</div>
            <div className="text-2xl font-bold text-red-500">{stats.error}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Tempo médio</div>
            <div className="text-2xl font-bold">{(stats.avgMs / 1000).toFixed(1)}s</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhuma execução registrada ainda.</div>
          ) : (
            <div className="divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {log.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate">{log.post_title || log.topic || '(sem título)'}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{log.source}</span>
                        </div>
                        {log.error_message && <p className="text-sm text-red-500 mt-1">{log.error_message}</p>}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString('pt-BR')}</span>
                          {log.duration_ms != null && <span>{(log.duration_ms / 1000).toFixed(1)}s</span>}
                        </div>
                      </div>
                    </div>
                    {log.post_slug && (
                      <a href={`/blog/${log.post_slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline flex-shrink-0">
                        Ver post <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAIHistory;
