import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PublishSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000),
  link: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const FACEBOOK_PAGE_ID = Deno.env.get('FACEBOOK_PAGE_ID');
    const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN');

    if (!FACEBOOK_PAGE_ID || !FACEBOOK_ACCESS_TOKEN) {
      console.error('Missing Facebook credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Facebook credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawBody = await req.json();
    const parsed = PublishSchema.safeParse(rawBody);
    
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, link, imageUrl } = parsed.data;

    console.log('Publishing to Facebook:', { 
      messagePreview: message.substring(0, 50) + '...', 
      link, 
      hasImage: !!imageUrl,
      pageId: FACEBOOK_PAGE_ID 
    });

    const endpoint = `https://graph.facebook.com/v19.0/${FACEBOOK_PAGE_ID}/feed`;
    const body = new URLSearchParams({
      message: imageUrl ? `${message}\n\n🔗 ${link || ''}`.trim() : message,
      access_token: FACEBOOK_ACCESS_TOKEN,
    });

    if (link) {
      body.append('link', link);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: body,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook API error:', JSON.stringify(result));
      
      const errorCode = result.error?.code;
      const errorMessage = result.error?.message || 'Unknown error';
      
      let userMessage = errorMessage;
      if (errorCode === 190) userMessage = 'Token expirado. Gere um novo token de acesso.';
      else if (errorCode === 200) userMessage = 'Permissões insuficientes. Verifique as permissões da página.';
      else if (errorCode === 100) userMessage = 'Parâmetro inválido. Verifique o ID da página.';
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: userMessage,
          errorCode,
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
      JSON.stringify({ success: false, error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
