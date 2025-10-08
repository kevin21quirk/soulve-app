import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferenceContact {
  name: string;
  email: string;
  phone?: string;
  relationship: string;
}

interface ReferenceRequestPayload {
  applicationId: string;
  applicantName: string;
  references: ReferenceContact[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { applicationId, applicantName, references }: ReferenceRequestPayload = await req.json();

    console.log('Processing reference requests for application:', applicationId);

    // Create reference check records and send emails
    const results = await Promise.all(
      references.map(async (reference) => {
        try {
          // Generate unique verification token
          const token = crypto.randomUUID();
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 14); // 14 days expiry

          // Insert reference check record
          const { data: referenceCheck, error: dbError } = await supabase
            .from('safe_space_reference_checks')
            .insert({
              application_id: applicationId,
              reference_name: reference.name,
              reference_email: reference.email,
              reference_phone: reference.phone,
              relationship: reference.relationship,
              verification_token: token,
              token_expires_at: expiresAt.toISOString(),
              status: 'pending'
            })
            .select()
            .single();

          if (dbError) {
            console.error('Error creating reference check:', dbError);
            throw dbError;
          }

          // Send email to reference
          const verificationUrl = `${Deno.env.get('SUPABASE_URL').replace('.supabase.co', '.lovable.app')}/safe-space/reference/verify/${token}`;

          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #4c3dfb;">Safe Space Helper Reference Request</h1>
              <p>Hello ${reference.name},</p>
              <p><strong>${applicantName}</strong> has applied to become a Safe Space Helper and has listed you as a professional reference.</p>
              
              <p>As part of our verification process, we would appreciate your feedback about their suitability for this role.</p>
              
              <p>The Safe Space Helper program connects trained volunteers with individuals seeking emotional support during difficult times. We need to ensure all helpers are trustworthy, compassionate, and capable.</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Your relationship:</strong> ${reference.relationship}</p>
              </div>
              
              <p>Please click the button below to complete a brief reference questionnaire. This should take approximately 5-10 minutes.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #4c3dfb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Complete Reference Questionnaire
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">This link will expire in 14 days. If you have any questions, please reply to this email.</p>
              
              <p style="color: #666; font-size: 14px;">If you did not expect this email or do not wish to provide a reference, you can safely ignore it.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">Safe Space Helper Verification System<br>This is an automated message, please do not reply directly.</p>
            </div>
          `;

          const { error: emailError } = await resend.emails.send({
            from: "Safe Space <onboarding@resend.dev>",
            to: [reference.email],
            subject: `Reference Request for ${applicantName} - Safe Space Helper Application`,
            html: emailHtml,
          });

          if (emailError) {
            console.error('Error sending email to', reference.email, ':', emailError);
            throw emailError;
          }

          console.log('Successfully sent reference request to:', reference.email);
          return { success: true, email: reference.email };
        } catch (error) {
          console.error('Error processing reference:', reference.email, error);
          return { success: false, email: reference.email, error: error.message };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    console.log(`Reference requests completed: ${successCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failedCount,
        results
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reference-request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
