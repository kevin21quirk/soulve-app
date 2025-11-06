import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Text must be at least 10 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create hash of content for caching
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first
    const { data: cached } = await supabase
      .from('language_detection_cache')
      .select('detected_language, confidence')
      .eq('content_hash', contentHash)
      .single();

    if (cached) {
      console.log('Cache hit for language detection');
      return new Response(
        JSON.stringify({ 
          language: cached.detected_language, 
          confidence: cached.confidence,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI for language detection
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a language detection expert. Respond with ONLY the ISO 639-1 language code (2 letters) and confidence score (0-1) in this exact format: "CODE:CONFIDENCE" (e.g., "en:0.95", "es:0.89"). Nothing else.' 
          },
          { role: 'user', content: `Detect the language of this text:\n\n${text}` }
        ],
        temperature: 0.1,
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const result = aiData.choices[0].message.content.trim();
    
    // Parse response (e.g., "en:0.95")
    const [language, confidenceStr] = result.split(':');
    const confidence = parseFloat(confidenceStr) || 0.5;

    // Cache the result
    await supabase
      .from('language_detection_cache')
      .insert({
        content_hash: contentHash,
        detected_language: language.toLowerCase(),
        confidence: confidence,
      });

    return new Response(
      JSON.stringify({ 
        language: language.toLowerCase(), 
        confidence: confidence,
        cached: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in detect-language:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});