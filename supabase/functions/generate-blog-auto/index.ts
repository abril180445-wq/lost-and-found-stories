import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    let { topic, category, suggestTopic } = body as {
      topic?: string;
      category?: string;
      suggestTopic?: boolean;
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY não configurada');

    // Fase 1: se não vier tópico ou for solicitado, IA sugere um
    if (!topic || suggestTopic) {
      const tRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'Você é estrategista de conteúdo para uma agência de motion design e animação. Responda APENAS com o tópico, sem explicações.' },
            { role: 'user', content: 'Sugira UM tópico de blog atual, relevante e com bom potencial de SEO sobre motion design, animação 2D/3D, branding em movimento ou design visual. Máximo 12 palavras. Apenas o tópico, sem aspas.' },
          ],
        }),
      });
      if (!tRes.ok) throw new Error('Falha ao sugerir tópico');
      const tData = await tRes.json();
      topic = (tData.choices?.[0]?.message?.content || '').trim().replace(/^["'`]|["'`]$/g, '');
      if (!topic) throw new Error('Tópico vazio');
    }

    // Fase 2: gera tudo em UMA chamada via tool calling (estruturado)
    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Você é redator sênior de uma agência de motion design e animação. Escreva em português brasileiro com tom profissional, envolvente e útil. SEO em mente: use palavras-chave naturalmente, parágrafos escaneáveis e CTAs sutis.`,
          },
          {
            role: 'user',
            content: `Crie um artigo de blog COMPLETO sobre: "${topic}".

Requisitos:
- title: máx 60 caracteres, atraente, com palavra-chave principal
- excerpt: 140-180 caracteres, resumo que desperte curiosidade
- category: uma de [Motion Design, Animação 2D, Animação 3D, Branding, Design Visual, Tendências, Tutoriais, Cases]
- content: artigo em Markdown com 800-1100 palavras, estrutura: # H1 título, intro envolvente (2 parágrafos), 3-4 seções ## H2 com subitens em listas quando útil, exemplos práticos, ## Conclusão com CTA convidando ao contato/orçamento. Sem emojis exagerados.
- imagePrompt: descrição visual em INGLÊS de 1-2 frases para gerar a imagem de capa (estilo: cinematic, modern motion design poster, dark background, vibrant accent, no text).`,
          },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'create_blog_post',
            description: 'Retorna o post de blog estruturado',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                excerpt: { type: 'string' },
                category: { type: 'string' },
                content: { type: 'string' },
                imagePrompt: { type: 'string' },
              },
              required: ['title', 'excerpt', 'category', 'content', 'imagePrompt'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'create_blog_post' } },
      }),
    });

    if (!aiRes.ok) {
      const errTxt = await aiRes.text();
      console.error('AI gateway error', aiRes.status, errTxt);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requisições atingido. Aguarde alguns minutos.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: 'Créditos insuficientes na workspace Lovable AI.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Falha na geração');
    }

    const aiData = await aiRes.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('Resposta sem tool_call');
    const post = JSON.parse(toolCall.function.arguments);

    const finalCategory = category && category.trim() ? category : post.category;
    const slug = slugify(post.title) + '-' + Math.random().toString(36).slice(2, 6);

    return new Response(JSON.stringify({
      topic,
      title: post.title,
      slug,
      excerpt: post.excerpt,
      content: post.content,
      category: finalCategory,
      imagePrompt: post.imagePrompt,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('generate-blog-auto error:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
