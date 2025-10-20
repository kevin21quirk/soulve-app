import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DemoNotificationRequest {
  email: string;
  fullName: string;
  companyName?: string;
  status: string;
  meetingLink?: string;
  scheduledDate?: string;
  adminNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      fullName, 
      companyName,
      status, 
      meetingLink, 
      scheduledDate,
      adminNotes 
    }: DemoNotificationRequest = await req.json();

    console.log("Sending demo notification:", { email, status });

    let subject = "";
    let html = "";

    switch (status) {
      case "scheduled":
        subject = "Your SouLVE Demo is Scheduled! 🎉";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0066cc;">Hi ${fullName}!</h1>
            <p style="font-size: 16px; line-height: 1.6;">Great news! Your demo request has been scheduled.</p>
            
            ${companyName ? `<p style="font-size: 16px;"><strong>Company:</strong> ${companyName}</p>` : ''}
            
            ${scheduledDate ? `
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: bold;">📅 ${new Date(scheduledDate).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            ` : ''}
            
            ${meetingLink ? `
              <div style="margin: 30px 0; text-align: center;">
                <a href="${meetingLink}" 
                   style="background: #0066cc; 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;
                          font-weight: bold;
                          font-size: 16px;">
                  Join Demo Meeting
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">Meeting Link: <a href="${meetingLink}">${meetingLink}</a></p>
            ` : ''}
            
            ${adminNotes ? `
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;"><strong>Note from our team:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">${adminNotes}</p>
              </div>
            ` : ''}
            
            <p style="font-size: 16px; line-height: 1.6;">We look forward to showing you how SouLVE can help your organization make a positive impact!</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
              If you need to reschedule or have any questions, please reply to this email.
            </p>
          </div>
        `;
        break;
      
      case "completed":
        subject = "Thank You for Your Demo! 🙏";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0066cc;">Thank you, ${fullName}!</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              We hope you found the SouLVE demo helpful and informative.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              We're excited about the potential to work with ${companyName || 'your organization'} 
              and help you achieve your social impact goals.
            </p>
            
            ${adminNotes ? `
              <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;"><strong>Next Steps:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">${adminNotes}</p>
              </div>
            ` : ''}
            
            <p style="font-size: 16px; line-height: 1.6;">
              If you have any questions or would like to discuss next steps, 
              please don't hesitate to reach out.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://join-soulve.com/contact" 
                 style="background: #0066cc; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;">
                Get Started
              </a>
            </div>
          </div>
        `;
        break;
      
      case "cancelled":
        subject = "Demo Request Update";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #666;">Hi ${fullName},</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              Your demo request has been cancelled.
            </p>
            
            ${adminNotes ? `
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;"><strong>Reason:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">${adminNotes}</p>
              </div>
            ` : ''}
            
            <p style="font-size: 16px; line-height: 1.6;">
              If you'd like to reschedule or have any questions, please reply to this email 
              or contact us directly.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://join-soulve.com/demo" 
                 style="background: #0066cc; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;">
                Request New Demo
              </a>
            </div>
          </div>
        `;
        break;

      case "no_show":
        subject = "We Missed You at the Demo";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #666;">Hi ${fullName},</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              We noticed you weren't able to attend the scheduled demo.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              No worries! We understand things come up. Would you like to reschedule?
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://join-soulve.com/demo" 
                 style="background: #0066cc; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;">
                Reschedule Demo
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              If you have any questions, please reply to this email.
            </p>
          </div>
        `;
        break;

      default:
        // Don't send email for 'pending' status
        return new Response(
          JSON.stringify({ success: true, message: "No email sent for this status" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }

    const emailResponse = await resend.emails.send({
      from: "SouLVE Demo Team <demo@join-soulve.com>",
      to: [email],
      subject,
      html,
    });

    console.log("Demo notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending demo notification email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
