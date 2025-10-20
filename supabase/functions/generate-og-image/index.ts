import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || 'default'
    const title = url.searchParams.get('title') || 'SouLVE - Social Impact Platform'
    const subtitle = url.searchParams.get('subtitle') || ''
    const value = url.searchParams.get('value') || ''
    
    // Generate SVG image
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(139,92,246);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(59,130,246);stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="1200" height="630" fill="url(#bg)"/>
        
        <!-- Pattern overlay -->
        <rect width="1200" height="630" fill="rgba(0,0,0,0.1)"/>
        
        <!-- Content container -->
        <rect x="60" y="60" width="1080" height="510" rx="20" fill="rgba(255,255,255,0.95)"/>
        
        <!-- Logo/Icon area -->
        <circle cx="140" cy="150" r="40" fill="rgb(139,92,246)"/>
        <text x="140" y="165" font-size="40" text-anchor="middle" fill="white">💜</text>
        
        <!-- Title -->
        <text x="220" y="165" font-size="48" font-weight="bold" fill="rgb(30,30,30)" font-family="system-ui, -apple-system, sans-serif">
          ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
        </text>
        
        <!-- Subtitle -->
        ${subtitle ? `
        <text x="220" y="220" font-size="28" fill="rgb(100,100,100)" font-family="system-ui, -apple-system, sans-serif">
          ${subtitle.substring(0, 60)}${subtitle.length > 60 ? '...' : ''}
        </text>
        ` : ''}
        
        <!-- Value/Stats (if provided) -->
        ${value ? `
        <rect x="220" y="280" width="800" height="120" rx="10" fill="rgb(249,250,251)"/>
        <text x="620" y="360" font-size="52" font-weight="bold" text-anchor="middle" fill="rgb(139,92,246)" font-family="system-ui, -apple-system, sans-serif">
          ${value}
        </text>
        ` : ''}
        
        <!-- Footer -->
        <text x="220" y="520" font-size="24" fill="rgb(120,120,120)" font-family="system-ui, -apple-system, sans-serif">
          join-soulve.com
        </text>
        
        <!-- Type badge -->
        <rect x="920" y="490" width="200" height="50" rx="25" fill="rgb(139,92,246)"/>
        <text x="1020" y="523" font-size="20" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif">
          ${type.toUpperCase()}
        </text>
      </svg>
    `

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
