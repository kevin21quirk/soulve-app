import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationEmailRequest {
  userId: string;
  notificationId: string;
  type: 'instant' | 'digest';
  notifications?: Array<{
    title: string;
    message: string;
    priority: string;
    created_at: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { userId, notificationId, type, notifications }: NotificationEmailRequest = await req.json();

    // Get user email
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();

    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    
    if (!user?.email) {
      throw new Error('User email not found');
    }

    let emailHtml = '';
    let subject = '';

    if (type === 'instant' && notificationId) {
      // Get single notification
      const { data: notification } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (!notification) {
        throw new Error('Notification not found');
      }

      subject = `New ${notification.priority === 'urgent' ? 'Urgent ' : ''}Notification: ${notification.title}`;
      emailHtml = generateInstantEmailHtml(notification, profile);
    } else if (type === 'digest' && notifications) {
      // Generate digest email
      subject = `Your Daily Notification Digest - ${notifications.length} new notifications`;
      emailHtml = generateDigestEmailHtml(notifications, profile);
    }

    // Send email using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'notifications@yourdomain.com',
        to: [user.email],
        subject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${await resendResponse.text()}`);
    }

    const resendData = await resendResponse.json();

    // Log email delivery
    if (notificationId) {
      await supabase.from('notification_delivery_log').insert({
        notification_id: notificationId,
        user_id: userId,
        delivery_method: 'email',
        delivered_at: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending notification email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateInstantEmailHtml(notification: any, profile: any): string {
  const userName = profile ? `${profile.first_name} ${profile.last_name}` : 'there';
  const priorityColor = notification.priority === 'urgent' ? '#ef4444' : 
                       notification.priority === 'high' ? '#f97316' : '#6b7280';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">New Notification</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${priorityColor}; margin: 20px 0;">
            ${notification.priority !== 'normal' ? `
              <span style="background: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                ${notification.priority}
              </span>
            ` : ''}
            <h2 style="color: #1f2937; margin-top: 10px;">${notification.title}</h2>
            <p style="color: #4b5563; font-size: 15px;">${notification.message}</p>
          </div>
          
          ${notification.action_url ? `
            <div style="text-align: center; margin-top: 30px;">
              <a href="${notification.action_url}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Notification
              </a>
            </div>
          ` : ''}
          
          <p style="color: #6b7280; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            You're receiving this because you have email notifications enabled. 
            <a href="#" style="color: #667eea;">Manage your notification preferences</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

function generateDigestEmailHtml(notifications: any[], profile: any): string {
  const userName = profile ? `${profile.first_name} ${profile.last_name}` : 'there';
  
  const notificationItems = notifications.map(n => `
    <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #667eea;">
      <h3 style="margin: 0 0 5px 0; color: #1f2937; font-size: 16px;">${n.title}</h3>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">${n.message}</p>
      <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 12px;">${new Date(n.created_at).toLocaleString()}</p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Your Daily Digest</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${notifications.length} new notifications</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
          
          <p style="color: #4b5563; margin-bottom: 20px;">Here's what you missed today:</p>
          
          ${notificationItems}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View All Notifications
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            You're receiving this daily digest because you have email notifications enabled. 
            <a href="#" style="color: #667eea;">Manage your notification preferences</a>
          </p>
        </div>
      </body>
    </html>
  `;
}
