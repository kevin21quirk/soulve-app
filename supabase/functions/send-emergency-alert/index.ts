import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { alertType, severity, riskScore, sessionId, messageId } = await req.json();

    console.log(`Sending emergency alert: ${alertType}, Severity: ${severity}, Risk: ${riskScore}`);

    // Get safeguarding lead email
    const { data: safeguardingLeads, error: leadsError } = await supabaseClient
      .from('safeguarding_roles')
      .select(`
        user_id,
        profiles:user_id (
          email
        )
      `)
      .eq('role', 'safeguarding_lead')
      .eq('is_active', true);

    if (leadsError || !safeguardingLeads || safeguardingLeads.length === 0) {
      console.error('No safeguarding leads found:', leadsError);
      return new Response(
        JSON.stringify({ error: 'No safeguarding leads configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get session details
    const { data: session } = await supabaseClient
      .from('safe_space_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    // Send email to safeguarding lead
    const leadEmail = 'matt@join-soulve.com'; // Hardcoded as specified by user
    
    const emailHtml = `
      <h1>🚨 URGENT: Safe Space Emergency Alert</h1>
      <p><strong>Alert Type:</strong> ${alertType}</p>
      <p><strong>Severity:</strong> <span style="color: ${severity === 'critical' ? 'red' : 'orange'}; font-weight: bold;">${severity.toUpperCase()}</span></p>
      <p><strong>Risk Score:</strong> ${riskScore}/100</p>
      <p><strong>Session ID:</strong> ${sessionId}</p>
      ${session ? `<p><strong>Issue Category:</strong> ${session.issue_category}</p>` : ''}
      ${session ? `<p><strong>Urgency Level:</strong> ${session.urgency_level}</p>` : ''}
      
      <hr />
      <p><strong>Action Required:</strong> Please review this session immediately in the admin portal.</p>
      <p><a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/#/admin/safeguarding/alerts" 
         style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
         View Alert in Admin Portal
      </a></p>
      
      <hr />
      <p style="color: #666; font-size: 12px;">This is an automated alert from the Safe Space Monitoring System.</p>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Safe Space Alerts <alerts@join-soulve.com>',
      to: [leadEmail],
      subject: `🚨 URGENT: Safe Space ${severity.toUpperCase()} Alert (Risk: ${riskScore})`,
      html: emailHtml
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send email notification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Emergency alert email sent to ${leadEmail}`);

    // Create in-app notification
    await supabaseClient
      .from('notifications')
      .insert({
        recipient_id: safeguardingLeads[0].user_id,
        type: 'emergency_alert',
        title: `🚨 ${severity.toUpperCase()} Alert`,
        message: `Safe Space session ${sessionId.substring(0, 8)} requires immediate attention (Risk: ${riskScore})`,
        priority: 'high',
        action_url: `/admin/safeguarding/alerts`,
        action_type: 'view',
        metadata: {
          alert_type: alertType,
          severity,
          risk_score: riskScore,
          session_id: sessionId,
          message_id: messageId
        }
      });

    // Log to audit
    await supabaseClient
      .from('safe_space_audit_log')
      .insert({
        user_id: safeguardingLeads[0].user_id,
        action_type: 'emergency_alert_sent',
        resource_type: 'safe_space_session',
        resource_id: sessionId,
        details: {
          alert_type: alertType,
          severity,
          risk_score: riskScore,
          email_sent: true,
          recipient: leadEmail
        }
      });

    return new Response(
      JSON.stringify({ success: true, emailSent: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-emergency-alert:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});