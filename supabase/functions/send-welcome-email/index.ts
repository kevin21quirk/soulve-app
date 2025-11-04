import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const welcomeEmailSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  firstName: z.string()
    .min(1, "First name is required")
    .max(100, "First name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z.string()
    .max(100, "Last name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters")
    .optional(),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const validation = welcomeEmailSchema.safeParse(requestBody);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: validation.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, firstName, lastName } = validation.data;
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;

    const emailResponse = await resend.emails.send({
      from: "SouLVE <welcome@join-soulve.com>",
      to: [email],
      subject: "Welcome to SouLVE - Make an Impact!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to SouLVE</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 32px; font-weight: bold; color: #0d9488; margin-bottom: 10px; }
              h1 { color: #0f766e; margin-bottom: 20px; font-size: 24px; }
              .content { margin-bottom: 30px; }
              .cta-button { display: inline-block; background-color: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .cta-button:hover { background-color: #0f766e; }
              .features { background-color: #f0fdfa; padding: 20px; border-radius: 6px; margin: 20px 0; }
              .feature-item { margin: 10px 0; }
              .feature-item::before { content: "✓ "; color: #0d9488; font-weight: bold; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SouLVE</div>
              </div>
              
              <h1>Welcome to SouLVE, ${fullName}! 🌟</h1>
              
              <div class="content">
                <p>We're thrilled to have you join our community of changemakers and impact-driven individuals!</p>
                
                <p>SouLVE is more than just a platform—it's a movement where your actions create real, measurable impact in the world.</p>
                
                <div class="features">
                  <p style="margin-top: 0; font-weight: 600; color: #0f766e;">Here's what you can do on SouLVE:</p>
                  <div class="feature-item">Connect with like-minded individuals and organizations</div>
                  <div class="feature-item">Create and support impactful campaigns</div>
                  <div class="feature-item">Track your ESG (Environmental, Social, Governance) contributions</div>
                  <div class="feature-item">Build your reputation through verified impact activities</div>
                  <div class="feature-item">Access Safe Space support when you need it</div>
                </div>
                
                <center>
                  <a href="https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com/dashboard" class="cta-button">
                    Get Started Now
                  </a>
                </center>
                
                <p>Need help getting started? Check out our <a href="https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com" style="color: #0d9488;">platform guide</a> or reach out to our support team.</p>
              </div>
              
              <div class="footer">
                <p>Questions? Reply to this email or visit our <a href="https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com/help" style="color: #0d9488;">Help Center</a></p>
                <p style="margin-top: 10px;">
                  <a href="https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com/privacy-policy" style="color: #666; text-decoration: none; margin: 0 10px;">Privacy Policy</a> |
                  <a href="https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com/terms-of-service" style="color: #666; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 15px;">© ${new Date().getFullYear()} SouLVE. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      throw emailResponse.error;
    }

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
