import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const donationReceiptSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  donorName: z.string()
    .min(1, "Donor name is required")
    .max(200, "Donor name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Donor name contains invalid characters"),
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount too large"),
  campaignName: z.string().min(1, "Campaign name required").max(200, "Campaign name too long"),
  campaignId: z.string().uuid("Invalid campaign ID format"),
  transactionId: z.string().min(1, "Transaction ID required").max(100, "Transaction ID too long"),
  date: z.string().datetime("Invalid date format"),
  organizationName: z.string().max(200, "Organization name too long").optional(),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const validation = donationReceiptSchema.safeParse(requestBody);
    
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

    const {
      email,
      donorName,
      amount,
      campaignName,
      campaignId,
      transactionId,
      date,
      organizationName,
    } = validation.data;

    const formattedAmount = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const emailResponse = await resend.emails.send({
      from: "SouLVE Donations <donations@join-soulve.com>",
      to: [email],
      subject: `Thank you for your donation - Receipt #${transactionId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Donation Receipt</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0d9488; padding-bottom: 20px; }
              .logo { font-size: 32px; font-weight: bold; color: #0d9488; margin-bottom: 10px; }
              h1 { color: #0f766e; margin-bottom: 10px; font-size: 24px; }
              .receipt-box { background-color: #f0fdfa; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #0d9488; }
              .receipt-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
              .receipt-row:last-child { border-bottom: none; }
              .receipt-label { font-weight: 600; color: #0f766e; }
              .receipt-value { color: #333; }
              .amount-highlight { font-size: 28px; font-weight: bold; color: #0d9488; text-align: center; margin: 20px 0; }
              .thank-you { background-color: #ecfdf5; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
              .cta-button { display: inline-block; background-color: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
              .tax-note { background-color: #fff7ed; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; font-size: 14px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SouLVE</div>
                <h1>Donation Receipt</h1>
              </div>
              
              <p>Dear ${donorName},</p>
              
              <p>Thank you for your generous donation! Your contribution is making a real difference.</p>
              
              <div class="amount-highlight">
                ${formattedAmount}
              </div>
              
              <div class="receipt-box">
                <h3 style="margin-top: 0; color: #0f766e;">Receipt Details</h3>
                <div class="receipt-row">
                  <span class="receipt-label">Receipt Number:</span>
                  <span class="receipt-value">#${transactionId}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Date:</span>
                  <span class="receipt-value">${formattedDate}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Campaign:</span>
                  <span class="receipt-value">${campaignName}</span>
                </div>
                ${organizationName ? `
                <div class="receipt-row">
                  <span class="receipt-label">Organization:</span>
                  <span class="receipt-value">${organizationName}</span>
                </div>
                ` : ''}
                <div class="receipt-row">
                  <span class="receipt-label">Amount:</span>
                  <span class="receipt-value">${formattedAmount}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Payment Method:</span>
                  <span class="receipt-value">Online Payment</span>
                </div>
              </div>
              
              <div class="thank-you">
                <h3 style="color: #0f766e; margin-top: 0;">🌟 Your Impact Matters! 🌟</h3>
                <p style="margin-bottom: 0;">Your donation is helping to create positive change in the world. Thank you for being a part of the SouLVE community!</p>
              </div>
              
              <div class="tax-note">
                <strong>Tax Information:</strong> Please keep this receipt for your records. Consult with your tax advisor regarding the deductibility of your contribution.
              </div>
              
              <center>
                <a href="https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com/campaigns/${campaignId}" class="cta-button">
                  View Campaign
                </a>
              </center>
              
              <p>You can view all your donations and impact metrics in your <a href="https://bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com/dashboard" style="color: #0d9488;">SouLVE Dashboard</a>.</p>
              
              <div class="footer">
                <p>Questions about your donation? Contact us at donations@join-soulve.com</p>
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

    console.log("Donation receipt sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-donation-receipt function:", error);
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
