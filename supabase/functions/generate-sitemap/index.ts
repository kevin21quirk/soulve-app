import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating dynamic sitemap...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all public campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, updated_at, status')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    // Fetch all public profiles (users with profile_visibility = public)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, updated_at')
      .eq('profile_visibility', 'public')
      .order('updated_at', { ascending: false });

    // Fetch all organizations
    const { data: organizations } = await supabase
      .from('organizations')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });

    // Generate sitemap XML
    const baseUrl = 'https://join-soulve.com';
    const now = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/esg-leaders</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

    // Add campaign URLs
    if (campaigns && campaigns.length > 0) {
      sitemap += '\n  <!-- Campaigns -->\n';
      campaigns.forEach((campaign) => {
        sitemap += `  <url>
    <loc>${baseUrl}/campaigns/${campaign.id}</loc>
    <lastmod>${campaign.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
      });
    }

    // Add public profile URLs
    if (profiles && profiles.length > 0) {
      sitemap += '\n  <!-- Public Profiles -->\n';
      profiles.forEach((profile) => {
        sitemap += `  <url>
    <loc>${baseUrl}/profile/${profile.id}</loc>
    <lastmod>${profile.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      });
    }

    // Add organization URLs
    if (organizations && organizations.length > 0) {
      sitemap += '\n  <!-- Organizations -->\n';
      organizations.forEach((org) => {
        sitemap += `  <url>
    <loc>${baseUrl}/organization/${org.id}</loc>
    <lastmod>${org.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
    }

    sitemap += '</urlset>';

    console.log(`Generated sitemap with ${campaigns?.length || 0} campaigns, ${profiles?.length || 0} profiles, ${organizations?.length || 0} organizations`);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
