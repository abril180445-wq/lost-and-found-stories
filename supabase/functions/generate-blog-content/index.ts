import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating ${type} content for topic: ${topic}`);

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'full') {
      systemPrompt = `Você é um redator especializado em motion design, animação e design visual. 
Escreva conteúdo profissional, envolvente e informativo em português brasileiro.
Use formatação markdown para estruturar o texto com headers, listas e parágrafos bem definidos.
O tom deve ser profissional mas acessível.`;
      
      userPrompt = `Crie um artigo completo sobre "${topic}" para o blog de uma agência de motion design.

Inclua:
- Título atraente (use # para H1)
- Introdução cativante
- 3-4 seções principais com subtítulos (use ## para H2)
- Exemplos práticos e dicas
- Conclusão com call-to-action

O artigo deve ter aproximadamente 800-1000 palavras.`;
    } else if (type === 'excerpt') {
      systemPrompt = `Você é um redator especializado em motion design. Crie resumos concisos e atraentes em português brasileiro.`;
      userPrompt = `Crie um resumo de 2-3 frases (máximo 200 caracteres) sobre "${topic}" que desperte curiosidade e convide à leitura do artigo completo.`;
    } else if (type === 'title') {
      systemPrompt = `Você é um especialista em copywriting para blogs de design. Crie títulos impactantes em português brasileiro.`;
      userPrompt = `Sugira 3 títulos criativos e atraentes para um artigo sobre "${topic}". Cada título deve ter no máximo 60 caracteres. Retorne apenas os títulos, um por linha.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos à sua conta.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Falha na geração de conteúdo');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Content generated successfully');

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-blog-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
