import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PublishRequest {
  message: string;
  link?: string;
  imageUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const FACEBOOK_PAGE_ID = Deno.env.get('FACEBOOK_PAGE_ID');
    const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN');

    if (!FACEBOOK_PAGE_ID || !FACEBOOK_ACCESS_TOKEN) {
      console.error('Missing Facebook credentials');
      return new Response(
        JSON.stringify({ error: 'Facebook credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, link, imageUrl }: PublishRequest = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Publishing to Facebook:', { message: message.substring(0, 50) + '...', link, hasImage: !!imageUrl });

    let endpoint: string;
    let body: URLSearchParams;

    if (imageUrl) {
      // Post with image
      endpoint = `https://graph.facebook.com/v19.0/${FACEBOOK_PAGE_ID}/photos`;
      body = new URLSearchParams({
        url: imageUrl,
        caption: link ? `${message}\n\n🔗 ${link}` : message,
        access_token: FACEBOOK_ACCESS_TOKEN,
      });
    } else {
      // Post with or without link
      endpoint = `https://graph.facebook.com/v19.0/${FACEBOOK_PAGE_ID}/feed`;
      body = new URLSearchParams({
        message: message,
        access_token: FACEBOOK_ACCESS_TOKEN,
      });
      
      if (link) {
        body.append('link', link);
      }
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: body,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook API error:', result);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to publish to Facebook', 
          details: result.error?.message || 'Unknown error' 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully published to Facebook:', result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        postId: result.id || result.post_id,
        message: 'Published to Facebook successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in publish-to-facebook function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
