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

function isAllowedRedirectTarget(target: URL) {
  const host = target.hostname.toLowerCase()
  return (
    target.protocol === 'https:' &&
    (host.endsWith('.lovableproject.com') || host === 'lovableproject.com')
  )
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')
    const targetParam = url.searchParams.get('target')

    if (!slug) {
      return new Response('Slug is required', { status: 400, headers: corsHeaders })
    }

    // Fetch post data (service role so this can be public without exposing database)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('title, excerpt, image_url, author')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error || !post) {
      return new Response('Post not found', { status: 404, headers: corsHeaders })
    }

    const imageUrl =
      post.image_url ||
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&fit=crop'

    const descriptionRaw =
      post.excerpt && post.excerpt.trim().length > 0
        ? post.excerpt
        : 'Leia mais no blog da Rorschach Motion'

    let targetUrl: string | null = null
    if (targetParam) {
      try {
        const parsed = new URL(targetParam)
        if (isAllowedRedirectTarget(parsed)) targetUrl = parsed.toString()
      } catch {
        // ignore invalid target
      }
    }

    const title = escapeHtml(post.title)
    const description = escapeHtml(descriptionRaw)
    const author = escapeHtml(post.author || 'Rorschach Motion')
    const canonical = targetUrl || ''

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Rorschach Motion</title>

  <!-- Open Graph / Facebook / Instagram -->
  <meta property="og:type" content="article" />
  ${canonical ? `<meta property="og:url" content="${canonical}" />` : ''}
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Rorschach Motion" />
  <meta property="og:locale" content="pt_BR" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  ${canonical ? `<meta name="twitter:url" content="${canonical}" />` : ''}
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  ${canonical ? `<link rel="canonical" href="${canonical}" />` : ''}
  ${canonical ? `<meta http-equiv="refresh" content="0;url=${canonical}" />` : ''}
</head>
<body>
  <main>
    <article>
      <h1>${title}</h1>
      <p>${description}</p>
      <p>Por ${author}</p>
      ${canonical ? `<a href="${canonical}">Ler artigo completo</a>` : ''}
    </article>
  </main>
  ${canonical ? `<script>window.location.href = ${JSON.stringify(canonical)};</script>` : ''}
</body>
</html>`

    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'text/html; charset=utf-8')
    // cache curto (as redes podem cachear por conta própria)
    headers.set('Cache-Control', 'public, max-age=300')

    return new Response(html, { headers })
  } catch (error) {
    console.error('og-preview error:', error)
    return new Response('Internal error', { status: 500, headers: corsHeaders })
  }
})
