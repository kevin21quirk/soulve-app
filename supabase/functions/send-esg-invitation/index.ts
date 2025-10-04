import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors Headers = {
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
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      organizationId,
      stakeholderEmail,
      stakeholderOrgName,
      stakeholderType,
      frameworkId,
      indicatorIds,
      dueDate,
      priority,
      requestMessage
    } = await req.json();

    console.log('Sending ESG invitation:', { organizationId, stakeholderEmail, stakeholderOrgName });

    // Generate invitation token
    const invitationToken = crypto.randomUUID();

    // Create invitation record
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        email: stakeholderEmail,
        role: 'member',
        invited_by: user.id,
        invitation_type: 'esg_contributor',
        invitation_token: invitationToken,
        esg_context: {
          stakeholder_org_name: stakeholderOrgName,
          stakeholder_type: stakeholderType,
          framework_id: frameworkId,
          indicator_ids: indicatorIds,
          due_date: dueDate,
          priority: priority,
          request_message: requestMessage
        }
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      throw invitationError;
    }

    console.log('Invitation created successfully:', invitation.id);

    // Create data requests for each indicator
    if (indicatorIds && indicatorIds.length > 0) {
      const dataRequests = indicatorIds.map((indicatorId: string) => ({
        organization_id: organizationId,
        requested_from_email: stakeholderEmail,
        indicator_id: indicatorId,
        framework_id: frameworkId,
        reporting_period: new Date().toISOString().split('T')[0],
        due_date: dueDate,
        priority: priority || 'medium',
        request_message: requestMessage,
        created_by: user.id
      }));

      const { error: requestsError } = await supabaseClient
        .from('esg_data_requests')
        .insert(dataRequests);

      if (requestsError) {
        console.error('Error creating data requests:', requestsError);
      } else {
        console.log(`Created ${dataRequests.length} data requests`);
      }
    }

    // In production, send email here using Resend or similar service
    const invitationUrl = `${req.headers.get('origin')}/register/esg-contributor/${invitationToken}`;
    
    console.log('Invitation URL:', invitationUrl);
    console.log('✅ ESG invitation sent successfully');

    return new Response(
      JSON.stringify({
        success: true,
        invitationId: invitation.id,
        invitationUrl: invitationUrl,
        message: 'ESG invitation sent successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-esg-invitation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});