import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  firstName: string;
  lastName: string;
  type: 'approved' | 'denied';
  reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Unauthorized - invalid token:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is admin
    const { data: isAdmin, error: adminError } = await supabaseClient.rpc('is_admin', {
      user_uuid: user.id
    });

    if (adminError || !isAdmin) {
      console.error('Forbidden - user is not admin:', { userId: user.id, adminError });
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { to, firstName, lastName, type, reason }: EmailRequest = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize name fields to prevent injection
    const sanitizedFirstName = firstName.replace(/[<>"']/g, '').substring(0, 50);
    const sanitizedLastName = lastName.replace(/[<>"']/g, '').substring(0, 50);

    const isApproval = type === 'approved';
    const subject = isApproval 
      ? "🎉 Welcome to SouLVE - Your Access Has Been Approved!"
      : "SouLVE Application Update";

    const html = isApproval ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0ce4af, #18a5fe); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to SouLVE! 🎉</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${sanitizedFirstName}!</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Great news! Your application to join SouLVE has been <strong>approved</strong>. 
            You can now access your dashboard and start connecting with your community.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Complete your profile setup</li>
              <li>Explore community posts and campaigns</li>
              <li>Start connecting with neighbors</li>
              <li>Share your first post or offer help</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL') || 'https://your-app.com'}/dashboard" 
               style="background: linear-gradient(135deg, #0ce4af, #18a5fe); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px;">
            Welcome to the SouLVE community! We're excited to have you.
          </p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #333; margin: 0; font-size: 24px;">SouLVE Application Update</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${sanitizedFirstName},</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Thank you for your interest in joining SouLVE. After careful review, 
            we're unable to approve your application at this time.
          </p>
          
          ${reason ? `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #856404; margin: 0;"><strong>Reason:</strong> ${reason}</p>
            </div>
          ` : ''}
          
          <p style="color: #666; line-height: 1.6;">
            You're welcome to reapply in the future. We're constantly growing and 
            may have more capacity later.
          </p>
          
          <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px;">
            Thank you for your understanding.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "SouLVE <noreply@join-soulve.com>",
      to: [to],
      subject,
      html,
    });

    // Audit log
    console.log('Waitlist email sent:', { 
      adminId: user.id, 
      recipientEmail: to, 
      type, 
      timestamp: new Date().toISOString() 
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending waitlist email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
