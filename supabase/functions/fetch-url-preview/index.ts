import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Unauthorized - invalid token:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { url } = await req.json();

    if (!url) {
      throw new Error('URL is required');
    }

    // Validate URL format and prevent SSRF attacks
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) {
      throw new Error('Invalid URL format');
    }

    // Parse URL and check for dangerous hosts
    const urlObj = new URL(url);
    const dangerousHosts = [
      'localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254',
      '10.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.',
      '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.',
      '172.27.', '172.28.', '172.29.', '172.30.', '172.31.', '192.168.'
    ];
    
    const isDangerous = dangerousHosts.some(host => 
      urlObj.hostname === host || 
      urlObj.hostname.includes(host) || 
      urlObj.hostname.startsWith(host)
    );

    if (isDangerous || !['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid or dangerous URL');
    }

    console.log('Fetching URL preview for:', url, 'User:', user.id);

    // Check if preview already exists in cache
    const { data: cached, error: cacheError } = await supabase
      .from('url_previews')
      .select('*')
      .eq('url', url)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cached && !cacheError) {
      console.log('Returning cached preview');
      return new Response(
        JSON.stringify({ 
          success: true, 
          preview: cached,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the URL with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URLPreviewBot/1.0)',
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Parse Open Graph and meta tags
    const preview = {
      url,
      title: extractMetaTag(html, ['og:title', 'twitter:title', 'title']),
      description: extractMetaTag(html, ['og:description', 'twitter:description', 'description']),
      image_url: extractMetaTag(html, ['og:image', 'twitter:image']),
      site_name: extractMetaTag(html, ['og:site_name']),
      favicon: extractFavicon(html, url),
      metadata: {
        type: extractMetaTag(html, ['og:type']),
        author: extractMetaTag(html, ['author', 'article:author']),
      },
    };

    // Cache the preview
    const { error: insertError } = await supabase
      .from('url_previews')
      .upsert(preview, { onConflict: 'url' });

    if (insertError) {
      console.error('Error caching preview:', insertError);
    }

    console.log('URL preview fetched successfully for user:', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        preview,
        cached: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-url-preview:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to extract meta tags
function extractMetaTag(html: string, tags: string[]): string | null {
  for (const tag of tags) {
    // Try Open Graph and Twitter card tags
    const ogRegex = new RegExp(`<meta[^>]*property=["']${tag}["'][^>]*content=["']([^"']*)["']`, 'i');
    const nameRegex = new RegExp(`<meta[^>]*name=["']${tag}["'][^>]*content=["']([^"']*)["']`, 'i');
    const titleRegex = /<title[^>]*>([^<]+)<\/title>/i;

    let match = html.match(ogRegex) || html.match(nameRegex);
    
    if (tag === 'title' && !match) {
      match = html.match(titleRegex);
    }

    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

// Helper function to extract favicon
function extractFavicon(html: string, baseUrl: string): string | null {
  const faviconRegex = /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']*)["']/i;
  const match = html.match(faviconRegex);
  
  if (match && match[1]) {
    const favicon = match[1];
    // Handle relative URLs
    if (favicon.startsWith('http')) {
      return favicon;
    } else if (favicon.startsWith('//')) {
      return 'https:' + favicon;
    } else {
      const url = new URL(baseUrl);
      return url.origin + (favicon.startsWith('/') ? favicon : '/' + favicon);
    }
  }
  
  // Fallback to default favicon location
  try {
    const url = new URL(baseUrl);
    return `${url.origin}/favicon.ico`;
  } catch {
    return null;
  }
}
