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

    // Generate invitation URL
    const invitationUrl = `${req.headers.get('origin')}/stakeholder-registration/${invitationToken}`;
    
    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ESG Platform <noreply@soulve.app>',
            to: [stakeholderEmail],
            subject: `ESG Data Contribution Request from ${stakeholderOrgName || 'Organization'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0ce4af;">ESG Data Contribution Request</h2>
                <p>You've been invited to contribute ESG data to help ${stakeholderOrgName || 'an organization'} with their sustainability reporting.</p>
                
                ${requestMessage ? `<div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0ce4af; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Message:</strong></p>
                  <p style="margin: 5px 0 0 0;">${requestMessage}</p>
                </div>` : ''}
                
                <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
                <p><strong>Priority:</strong> ${priority?.toUpperCase() || 'MEDIUM'}</p>
                
                <div style="margin: 30px 0;">
                  <a href="${invitationUrl}" 
                     style="background: linear-gradient(135deg, #0ce4af 0%, #18a5fe 100%); 
                            color: white; 
                            padding: 12px 30px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            display: inline-block;">
                    Access Contribution Portal
                  </a>
                </div>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                  This invitation will expire in 30 days. If you have any questions, please contact the organization directly.
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('Resend API error:', errorText);
          throw new Error(`Failed to send email: ${errorText}`);
        }

        const emailData = await emailResponse.json();
        console.log('✅ Email sent via Resend:', emailData.id);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the entire request if email fails
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured - email not sent');
      console.log('Invitation URL (for manual sharing):', invitationUrl);
    }
    
    console.log('✅ ESG invitation processed successfully');

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