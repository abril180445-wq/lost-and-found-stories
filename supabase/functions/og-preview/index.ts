import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')

    if (!slug) {
      return new Response('Slug is required', { status: 400, headers: corsHeaders })
    }

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

    const siteUrl = url.origin.replace('supabase.co/functions/v1/og-preview', 'lovableproject.com')
    const postUrl = `${siteUrl}/blog/${slug}`
    const imageUrl = post.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&fit=crop'

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | Rorschach Motion</title>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.excerpt || 'Leia mais no blog da Rorschach Motion'}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Rorschach Motion">
  <meta property="og:locale" content="pt_BR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${postUrl}">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.excerpt || 'Leia mais no blog da Rorschach Motion'}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0;url=${postUrl}">
  <link rel="canonical" href="${postUrl}">
</head>
<body>
  <h1>${post.title}</h1>
  <p>${post.excerpt || ''}</p>
  <p>Por ${post.author || 'Rorschach Motion'}</p>
  <a href="${postUrl}">Ler artigo completo</a>
  <script>window.location.href = "${postUrl}";</script>
</body>
</html>`

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal error', { status: 500, headers: corsHeaders })
  }
})