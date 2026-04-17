import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LeadSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  telefone: z.string().trim().max(40).optional().or(z.literal("")),
  servico: z.string().trim().max(120).optional().or(z.literal("")),
  mensagem: z.string().trim().max(2000).optional().or(z.literal("")),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(120).optional(),
  utm_content: z.string().max(120).optional(),
  utm_term: z.string().max(120).optional(),
  gclid: z.string().max(255).optional(),
  fbclid: z.string().max(255).optional(),
  pagina_origem: z.string().max(500).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Dados inválidos", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const userAgent = req.headers.get("user-agent") ?? null;

    const payload = {
      ...parsed.data,
      telefone: parsed.data.telefone || null,
      servico: parsed.data.servico || null,
      mensagem: parsed.data.mensagem || null,
      user_agent: userAgent,
    };

    // Retry up to 3 times
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error } = await supabase.from("leads").insert([payload]);
      if (!error) {
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      lastError = error;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }

    console.error("[submit-lead] insert failed", lastError);
    return new Response(
      JSON.stringify({ error: "Falha ao salvar lead" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[submit-lead] unexpected", err);
    return new Response(
      JSON.stringify({ error: "Erro inesperado" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
