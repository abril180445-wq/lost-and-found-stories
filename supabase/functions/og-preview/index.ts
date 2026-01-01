import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function escapeHtml(value: string) {
  return (value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')

    console.log('og-preview called with slug:', slug)

    if (!slug) {
      console.error('No slug provided')
      return new Response('Slug is required', { status: 400, headers: corsHeaders })
    }

    // Fetch post data (service role so this can be public without exposing database)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Fetching post from database...')

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('title, excerpt, image_url, author')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      return new Response('Database error', { status: 500, headers: corsHeaders })
    }

    if (!post) {
      console.error('Post not found for slug:', slug)
      return new Response('Post not found', { status: 404, headers: corsHeaders })
    }

    console.log('Post found:', post.title)

    // URL canônica do post (URL final onde o usuário será redirecionado)
    // Usar o domínio de produção quando disponível
    const siteUrl = 'https://id-preview--twvmmsrjkfmropwwdjfg.lovableproject.com'
    const canonicalUrl = `${siteUrl}/blog/${slug}`
    
    // URL da edge function para compartilhamento
    const ogPreviewUrl = `${supabaseUrl}/functions/v1/og-preview?slug=${encodeURIComponent(slug)}`

    const imageUrl =
      post.image_url ||
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&fit=crop'

    const descriptionRaw =
      post.excerpt && post.excerpt.trim().length > 0
        ? post.excerpt
        : 'Leia mais no blog da Rorschach Motion'

    const title = escapeHtml(post.title)
    const description = escapeHtml(descriptionRaw)
    const author = escapeHtml(post.author || 'Rorschach Motion')

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Rorschach Motion</title>

  <!-- Open Graph / Facebook / Instagram -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Rorschach Motion" />
  <meta property="og:locale" content="pt_BR" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Redirect to actual post after crawlers read meta tags -->
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body>
  <main>
    <article>
      <h1>${title}</h1>
      <p>${description}</p>
      <p>Por ${author}</p>
      <a href="${canonicalUrl}">Ler artigo completo</a>
    </article>
  </main>
  <script>window.location.href = "${canonicalUrl}";</script>
</body>
</html>`

    console.log('Returning HTML with og:url:', canonicalUrl)

    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'text/html; charset=utf-8')
    // Cache curto para permitir atualizações
    headers.set('Cache-Control', 'public, max-age=60')

    return new Response(html, { headers })
  } catch (error) {
    console.error('og-preview error:', error)
    return new Response('Internal error', { status: 500, headers: corsHeaders })
  }
})
