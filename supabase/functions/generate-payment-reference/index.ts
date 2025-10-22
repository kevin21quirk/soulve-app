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

    const { amount, paymentType, userId, organisationId } = await req.json();
    console.log('Generating payment reference for:', { amount, paymentType, userId });

    // Generate unique payment reference
    const prefix = paymentType === 'subscription' ? 'SUB' : 
                   paymentType === 'white_label' ? 'WL' : 
                   paymentType === 'advertising' ? 'AD' : 'PAY';
    
    const year = new Date().getFullYear();
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    const referenceCode = `${prefix}-${year}-${randomPart}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('platform_payments')
      .insert({
        user_id: userId || user.id,
        organisation_id: organisationId,
        payment_type: paymentType,
        payment_method: 'bank_transfer',
        amount,
        currency: 'GBP',
        status: 'awaiting_confirmation',
        payment_reference: referenceCode,
        description: `${paymentType} payment`,
        bank_transfer_details: {
          accountName: 'SouLVE Ltd',
          sortCode: '20-00-00',
          accountNumber: '12345678',
          reference: referenceCode
        }
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Create payment reference record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to complete payment

    const { error: refError } = await supabaseClient
      .from('payment_references')
      .insert({
        reference_code: referenceCode,
        payment_id: payment.id,
        expected_amount: amount,
        currency: 'GBP',
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      });

    if (refError) throw refError;

    console.log('Payment reference created:', referenceCode);

    return new Response(
      JSON.stringify({
        reference: referenceCode,
        paymentId: payment.id,
        bankDetails: {
          accountName: 'SouLVE Ltd',
          sortCode: '20-00-00',
          accountNumber: '12345678',
          reference: referenceCode,
          amount: amount,
          currency: 'GBP'
        },
        expiresAt: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating payment reference:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
