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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    console.log('Creating Yapily payment:', body);

    // Get Yapily credentials from environment
    const yapilyAppId = Deno.env.get('YAPILY_APPLICATION_ID');
    const yapilySecret = Deno.env.get('YAPILY_APPLICATION_SECRET');

    if (!yapilyAppId || !yapilySecret) {
      throw new Error('Yapily credentials not configured');
    }

    // For now, return a mock response until Yapily is properly configured
    // In production, this would call the actual Yapily API
    const mockConsentId = `consent_${Date.now()}`;
    const mockAuthorisationUrl = `https://auth.yapily.com/consent/${mockConsentId}`;

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('platform_payments')
      .insert({
        user_id: user.id,
        payment_type: body.paymentType || 'subscription',
        payment_method: 'yapily',
        amount: body.amount,
        currency: body.currency || 'GBP',
        status: 'pending',
        description: body.description,
        yapily_consent_id: mockConsentId,
        metadata: body
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    console.log('Payment record created:', payment.id);

    return new Response(
      JSON.stringify({
        consentId: mockConsentId,
        authorisationUrl: mockAuthorisationUrl,
        paymentId: payment.id,
        status: 'pending',
        message: 'Yapily integration coming soon - this is a test response'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in yapily-create-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
