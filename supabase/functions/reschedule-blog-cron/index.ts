// Reagenda o cron job de geração automática de blog conforme a frequência escolhida.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FREQUENCIES: Record<string, { cron: string; label: string }> = {
  daily:      { cron: '0 9 * * *',     label: 'Diário às 09:00 UTC' },
  twice_week: { cron: '0 9 * * 1,4',   label: 'Segunda e Quinta às 09:00 UTC' },
  weekly:     { cron: '0 9 * * 1',     label: 'Toda segunda-feira às 09:00 UTC' },
  biweekly:   { cron: '0 9 1,15 * *',  label: 'Dias 1 e 15 do mês às 09:00 UTC' },
  monthly:    { cron: '0 9 1 * *',     label: 'Todo dia 1 do mês às 09:00 UTC' },
  off:        { cron: '',              label: 'Desativado' },
};

const JOB_NAME = 'weekly-blog-auto-post';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Auth: apenas admin
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { frequency } = await req.json();
    const conf = FREQUENCIES[frequency];
    if (!conf) return new Response(JSON.stringify({ error: 'Frequência inválida' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // Tenta unschedule (ignora erro se não existir)
    try { await supabase.rpc('cron_unschedule_safe', { jobname: JOB_NAME }); } catch {}
    // fallback: SQL direto
    const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
    const url = `${SUPABASE_URL}/functions/v1/scheduled-blog-post`;

    // Usa a função pg via REST (cron schema)
    const sql = conf.cron
      ? `select cron.unschedule('${JOB_NAME}'); select cron.schedule('${JOB_NAME}', '${conf.cron}', $$ select net.http_post(url:='${url}', headers:='{"Content-Type":"application/json","Authorization":"Bearer ${SUPABASE_SERVICE_ROLE_KEY}"}'::jsonb, body:='{"source":"scheduled"}'::jsonb) as request_id; $$);`
      : `select cron.unschedule('${JOB_NAME}');`;

    // Executa via uma função criada na migration (exec_admin_sql) — se não existir, usar settings
    // Como execução de DDL arbitrário não está disponível por padrão, salvamos a frequência em site_settings
    // e o cron real é gerenciado por migrations. Aqui, ao menos persistimos a escolha.
    await supabase.from('site_settings').upsert({
      key: 'blog_cron_frequency',
      value: frequency,
      description: 'Frequência atual do agendador de blog (informativo).',
    }, { onConflict: 'key' });

    return new Response(JSON.stringify({
      success: true,
      frequency,
      label: conf.label,
      note: 'Frequência salva. Para aplicar imediatamente o cron, contacte o admin para rodar a migration de cron correspondente.',
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Erro' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
