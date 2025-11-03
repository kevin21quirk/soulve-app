import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  to: string;
  type: 'contribution_submitted' | 'contribution_verified' | 'invitation_sent' | 'data_request';
  data: {
    recipientName: string;
    organizationName: string;
    contributionTitle?: string;
    verificationStatus?: string;
    verificationNotes?: string;
    invitationLink?: string;
    requestDetails?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { to, type, data }: NotificationRequest = await req.json();

    if (!to || !type || !data) {
      throw new Error("Missing required fields");
    }

    let subject = "";
    let html = "";

    switch (type) {
      case 'contribution_submitted':
        subject = `New ESG Data Contribution - ${data.organizationName}`;
        html = `
          <h1>New ESG Data Contribution Received</h1>
          <p>Hello ${data.recipientName},</p>
          <p>A new ESG data contribution has been submitted to ${data.organizationName}.</p>
          <p><strong>Contribution:</strong> ${data.contributionTitle}</p>
          <p>Please review and verify this contribution in your admin dashboard.</p>
          <p>Best regards,<br>The ESG Platform Team</p>
        `;
        break;

      case 'contribution_verified':
        subject = `ESG Contribution ${data.verificationStatus} - ${data.organizationName}`;
        html = `
          <h1>Your ESG Contribution Has Been Reviewed</h1>
          <p>Hello ${data.recipientName},</p>
          <p>Your ESG data contribution to ${data.organizationName} has been reviewed.</p>
          <p><strong>Status:</strong> ${data.verificationStatus}</p>
          ${data.verificationNotes ? `<p><strong>Notes:</strong> ${data.verificationNotes}</p>` : ''}
          <p>You can view the details in your dashboard.</p>
          <p>Best regards,<br>The ESG Platform Team</p>
        `;
        break;

      case 'invitation_sent':
        subject = `You've Been Invited to Contribute ESG Data - ${data.organizationName}`;
        html = `
          <h1>ESG Data Contribution Invitation</h1>
          <p>Hello ${data.recipientName},</p>
          <p>You've been invited to contribute ESG data to ${data.organizationName}.</p>
          <p>Click the link below to accept the invitation and start contributing:</p>
          <p><a href="${data.invitationLink}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Accept Invitation</a></p>
          <p>This invitation will expire in 7 days.</p>
          <p>Best regards,<br>The ESG Platform Team</p>
        `;
        break;

      case 'data_request':
        subject = `ESG Data Request - ${data.organizationName}`;
        html = `
          <h1>New ESG Data Request</h1>
          <p>Hello ${data.recipientName},</p>
          <p>${data.organizationName} has requested ESG data from your organization.</p>
          <p><strong>Request Details:</strong> ${data.requestDetails}</p>
          <p>Please review this request in your dashboard.</p>
          <p>Best regards,<br>The ESG Platform Team</p>
        `;
        break;

      default:
        throw new Error("Invalid notification type");
    }

    console.log(`Sending ${type} email to ${to}`);

    const emailResponse = await resend.emails.send({
      from: "SouLVE ESG <esg@join-soulve.com>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the notification
    await supabase.from('security_audit_log').insert({
      action_type: 'email_notification_sent',
      severity: 'low',
      details: {
        notification_type: type,
        recipient: to,
        email_id: emailResponse.id,
      }
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-esg-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === "Unauthorized" ? 401 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
