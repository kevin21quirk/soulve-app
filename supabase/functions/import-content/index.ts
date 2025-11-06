import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportedContent {
  platform: string;
  title: string;
  description: string;
  author?: string;
  thumbnailUrl?: string;
  tags?: string[];
  sourceUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Validate URL to prevent SSRF attacks
    if (!isValidUrl(url)) {
      throw new Error('Invalid or unsafe URL provided');
    }

    console.log('Importing content from:', url);
    
    // Detect platform and extract content
    const content = await extractContent(url);
    
    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error importing content:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function extractContent(url: string): Promise<ImportedContent> {
  const platform = detectPlatform(url);
  
  switch (platform) {
    case 'youtube':
      return await extractYouTubeContent(url);
    case 'twitter':
      return await extractTwitterContent(url);
    case 'article':
      return await extractArticleContent(url);
    default:
      return await extractGenericContent(url);
  }
}

function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return 'twitter';
  }
  // Check for news/article domains
  if (url.includes('medium.com') || url.includes('blog') || url.includes('news')) {
    return 'article';
  }
  return 'generic';
}

async function extractYouTubeContent(url: string): Promise<ImportedContent> {
  // Extract video ID
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  console.log('Extracting YouTube content for video ID:', videoId);

  try {
    // Use YouTube oEmbed API - more reliable
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('YouTube oEmbed data:', data);
      
      const result = {
        platform: 'youtube',
        title: data.title || 'YouTube Video',
        description: '',
        author: data.author_name || 'Unknown',
        thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        tags: [],
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
      
      console.log('YouTube import result:', result);
      return result;
    }
  } catch (error) {
    console.error('YouTube oEmbed failed, using fallback:', error);
  }

  // Fallback method
  const result = {
    platform: 'youtube',
    title: 'YouTube Video',
    description: '',
    author: '',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    tags: [],
    sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
  
  console.log('YouTube import fallback result:', result);
  return result;
}

async function extractTwitterContent(url: string): Promise<ImportedContent> {
  // Fetch tweet page
  const response = await fetch(url);
  const html = await response.text();
  
  const title = extractMetaTag(html, 'og:title') || 'Twitter Post';
  const description = extractMetaTag(html, 'og:description') || '';
  const author = extractMetaTag(html, 'twitter:creator') || '';
  const thumbnailUrl = extractMetaTag(html, 'og:image');

  return {
    platform: 'twitter',
    title,
    description,
    author,
    thumbnailUrl,
    tags: [],
    sourceUrl: url,
  };
}

async function extractArticleContent(url: string): Promise<ImportedContent> {
  const response = await fetch(url);
  const html = await response.text();
  
  const title = extractMetaTag(html, 'og:title') || extractMetaTag(html, 'twitter:title') || 'Article';
  const description = extractMetaTag(html, 'og:description') || extractMetaTag(html, 'twitter:description') || '';
  const author = extractMetaTag(html, 'author') || extractMetaTag(html, 'article:author') || '';
  const thumbnailUrl = extractMetaTag(html, 'og:image') || extractMetaTag(html, 'twitter:image');
  
  // Extract keywords as tags
  const keywords = extractMetaTag(html, 'keywords');
  const tags = keywords ? keywords.split(',').map(k => k.trim()).slice(0, 5) : [];

  return {
    platform: 'article',
    title,
    description,
    author,
    thumbnailUrl,
    tags,
    sourceUrl: url,
  };
}

async function extractGenericContent(url: string): Promise<ImportedContent> {
  const response = await fetch(url);
  const html = await response.text();
  
  const title = extractMetaTag(html, 'og:title') || 
                extractMetaTag(html, 'twitter:title') || 
                extractTitle(html) || 
                'Imported Content';
  const description = extractMetaTag(html, 'og:description') || 
                     extractMetaTag(html, 'twitter:description') || 
                     extractMetaTag(html, 'description') || '';
  const thumbnailUrl = extractMetaTag(html, 'og:image') || extractMetaTag(html, 'twitter:image');

  return {
    platform: 'generic',
    title,
    description,
    thumbnailUrl,
    tags: [],
    sourceUrl: url,
  };
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function extractMetaTag(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'),
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1] : null;
}

function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.log('Blocked non-HTTP(S) protocol:', urlObj.protocol);
      return false;
    }
    
    // Block private IP ranges
    const hostname = urlObj.hostname.toLowerCase();
    
    // Block localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      console.log('Blocked localhost access');
      return false;
    }
    
    // Block private IPv4 ranges
    const ipv4Patterns = [
      /^10\./,                    // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./,              // 192.168.0.0/16
      /^169\.254\./,              // 169.254.0.0/16 (link-local)
    ];
    
    for (const pattern of ipv4Patterns) {
      if (pattern.test(hostname)) {
        console.log('Blocked private IP range:', hostname);
        return false;
      }
    }
    
    // Block cloud metadata endpoints
    if (hostname === '169.254.169.254' || hostname === 'fd00:ec2::254') {
      console.log('Blocked cloud metadata endpoint');
      return false;
    }
    
    // Block private IPv6 ranges
    if (hostname.startsWith('fd') || hostname.startsWith('fc')) {
      console.log('Blocked private IPv6 range');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('URL validation error:', error);
    return false;
  }
}
