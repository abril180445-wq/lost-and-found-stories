const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let targetUrl: string | null = null;

    // Support both GET (query param) and POST (JSON body)
    if (req.method === 'POST') {
      const body = await req.json();
      targetUrl = body.url || null;
    } else {
      const url = new URL(req.url);
      targetUrl = url.searchParams.get('url');
    }

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!targetUrl.startsWith('https://')) {
      return new Response(JSON.stringify({ error: 'URL must be HTTPS' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build thum.io URL - DO NOT encode the target URL in the path
    const thumbUrl = `https://image.thum.io/get/width/1200/crop/675/${targetUrl}`;
    
    console.log('Fetching screenshot for:', targetUrl);
    console.log('Thum.io URL:', thumbUrl);

    const response = await fetch(thumbUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch screenshot, status:', response.status);
      // Try fallback without crop
      const fallbackUrl = `https://image.thum.io/get/width/1200/${targetUrl}`;
      console.log('Trying fallback URL:', fallbackUrl);
      
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      if (!fallbackResponse.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch screenshot' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const imageBuffer = await fallbackResponse.arrayBuffer();
      const contentType = fallbackResponse.headers.get('content-type') || 'image/png';
      
      return new Response(imageBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('Error in project-thumbnail:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
