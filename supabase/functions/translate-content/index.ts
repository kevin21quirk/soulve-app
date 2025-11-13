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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with anon key for auth check
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { contentId, contentType, text, targetLanguage, sourceLanguage } = await req.json();

    if (!text || !targetLanguage || !contentId || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Translation request:', { contentId, contentType, targetLanguage, sourceLanguage, userId: user.id });

    // Check cache first
    const { data: cached } = await supabase
      .from('content_translations')
      .select('translated_text, original_language')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .eq('target_language', targetLanguage)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cached) {
      console.log('Cache hit for translation');
      return new Response(
        JSON.stringify({ 
          translatedText: cached.translated_text,
          fromLanguage: cached.original_language,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI for translation
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const languageNames: Record<string, string> = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ar: 'Arabic',
      hi: 'Hindi', ru: 'Russian', nl: 'Dutch', pl: 'Polish', tr: 'Turkish'
    };

    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    const systemPrompt = `You are a professional translator. Translate the following text to ${targetLangName}.

CRITICAL RULES:
1. Keep @username mentions EXACTLY as-is
2. Keep #hashtags EXACTLY as-is
3. Keep URLs EXACTLY as-is
4. Preserve line breaks and formatting
5. Keep emojis
6. Translate ONLY the natural language text
7. Return ONLY the translation, no explanations or meta-text`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Translation credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();

    // Cache the translation
    await supabase
      .from('content_translations')
      .insert({
        content_id: contentId,
        content_type: contentType,
        original_language: sourceLanguage || 'unknown',
        target_language: targetLanguage,
        original_text: text,
        translated_text: translatedText,
        translator: 'gemini-2.5-flash',
      });

    return new Response(
      JSON.stringify({ 
        translatedText,
        fromLanguage: sourceLanguage || 'unknown',
        cached: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in translate-content:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Translation failed',
        translatedText: null 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});