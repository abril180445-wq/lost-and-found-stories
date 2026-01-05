import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      console.error('Missing url parameter');
      return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate URL
    if (!targetUrl.startsWith('https://')) {
      console.error('Invalid URL, must be HTTPS:', targetUrl);
      return new Response(JSON.stringify({ error: 'URL must be HTTPS' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build thum.io URL - 640x360 for 16:9 aspect ratio
    const thumbUrl = `https://image.thum.io/get/width/640/crop/360/${encodeURIComponent(targetUrl)}`;
    
    console.log('Fetching screenshot for:', targetUrl);
    console.log('Thum.io URL:', thumbUrl);

    // Fetch the screenshot from thum.io
    const response = await fetch(thumbUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch screenshot, status:', response.status);
      return new Response(JSON.stringify({ error: 'Failed to fetch screenshot' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    console.log('Screenshot fetched successfully, size:', imageBuffer.byteLength, 'bytes');

    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=21600', // Cache for 6 hours
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
