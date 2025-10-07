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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, resourceType, resourceId, details } = await req.json();

    console.log(`Verifying safeguarding action: ${action} on ${resourceType} by user ${user.id}`);

    // Check if user has any safeguarding role
    const { data: roles, error: rolesError } = await supabaseClient
      .from('safeguarding_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (rolesError || !roles || roles.length === 0) {
      console.warn(`User ${user.id} attempted safeguarding action without role`);
      
      // Log unauthorized attempt
      await supabaseClient
        .from('safe_space_audit_log')
        .insert({
          user_id: user.id,
          action_type: 'unauthorized_safeguarding_attempt',
          resource_type: resourceType,
          resource_id: resourceId,
          details: {
            action,
            ...details,
            reason: 'No safeguarding role assigned'
          }
        });

      return new Response(
        JSON.stringify({ 
          authorized: false, 
          error: 'You do not have safeguarding permissions' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userRole = roles[0].role;

    // Verify action permissions based on role
    const allowedActions: Record<string, string[]> = {
      'safeguarding_lead': [
        'view_session',
        'view_messages',
        'acknowledge_alert',
        'resolve_alert',
        'escalate_alert',
        'review_helper_application',
        'approve_helper',
        'reject_helper',
        'suspend_helper',
        'manage_keywords',
        'assign_roles',
        'view_audit_log'
      ],
      'senior_reviewer': [
        'view_session',
        'view_messages',
        'acknowledge_alert',
        'review_helper_application',
        'approve_helper',
        'reject_helper'
      ],
      'crisis_manager': [
        'view_session',
        'view_messages',
        'acknowledge_alert',
        'resolve_alert',
        'escalate_alert'
      ]
    };

    if (!allowedActions[userRole]?.includes(action)) {
      console.warn(`User ${user.id} (${userRole}) attempted unauthorized action: ${action}`);
      
      await supabaseClient
        .from('safe_space_audit_log')
        .insert({
          user_id: user.id,
          action_type: 'unauthorized_safeguarding_attempt',
          resource_type: resourceType,
          resource_id: resourceId,
          details: {
            action,
            user_role: userRole,
            ...details,
            reason: 'Insufficient role permissions'
          }
        });

      return new Response(
        JSON.stringify({ 
          authorized: false, 
          error: `Your role (${userRole}) does not have permission for this action` 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log successful authorization
    await supabaseClient
      .from('safe_space_audit_log')
      .insert({
        user_id: user.id,
        action_type: 'safeguarding_action_authorized',
        resource_type: resourceType,
        resource_id: resourceId,
        details: {
          action,
          user_role: userRole,
          ...details
        }
      });

    console.log(`Action ${action} authorized for user ${user.id} (${userRole})`);

    return new Response(
      JSON.stringify({ 
        authorized: true, 
        userRole,
        userId: user.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-safeguarding-action:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});