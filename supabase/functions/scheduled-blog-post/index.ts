// Edge function chamada por pg_cron semanalmente para gerar e publicar 1 post automaticamente
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('[scheduled-blog-post] Starting weekly auto post...');

    // 1) Gera conteúdo
    const genRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-blog-auto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
      body: JSON.stringify({ suggestTopic: true }),
    });
    if (!genRes.ok) throw new Error(`Falha ao gerar: ${await genRes.text()}`);
    const post = await genRes.json();

    // 2) Gera imagem (best-effort, não falha o post se der erro)
    let imageUrl = '';
    try {
      const imgRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-blog-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
        body: JSON.stringify({ topic: post.imagePrompt || post.title, slug: post.slug }),
      });
      if (imgRes.ok) {
        const img = await imgRes.json();
        imageUrl = img.imageUrl || '';
      }
    } catch (e) {
      console.error('Image gen failed (non-fatal):', e);
    }

    // 3) Insere no banco
    const { data: inserted, error: insErr } = await supabase
      .from('blog_posts')
      .insert([{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image_url: imageUrl,
        og_image: imageUrl,
        category: post.category,
        author: 'Rorschach Motion',
        meta_description: post.metaDescription,
        meta_keywords: post.metaKeywords,
        tags: post.tags,
        published: true,
      }])
      .select()
      .single();
    if (insErr) throw insErr;

    console.log(`[scheduled-blog-post] Published: ${post.title}`);

    // 4) Auto-publica no Facebook (best-effort)
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/publish-to-facebook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
        body: JSON.stringify({
          message: `📢 Novo artigo no blog!\n\n${post.title}\n\n${post.excerpt}`,
          link: `https://lost-and-found-stories.lovable.app/blog/${post.slug}`,
          imageUrl: imageUrl || undefined,
        }),
      });
    } catch (e) {
      console.error('FB publish failed (non-fatal):', e);
    }

    return new Response(JSON.stringify({ success: true, post: inserted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[scheduled-blog-post] error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Erro' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
