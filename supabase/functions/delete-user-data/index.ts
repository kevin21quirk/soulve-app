import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createErrorResponse } from "../_shared/errorHandling.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const deleteUserSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "Deletion must be explicitly confirmed"
  }),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const requestBody = await req.json();
    const validation = deleteUserSchema.safeParse(requestBody);
    
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

    console.log(`Processing deletion request for user: ${user.id}`);

    // Delete user data in order (respecting foreign key constraints)
    const tablesToDelete = [
      "post_reactions",
      "post_interactions",
      "messages",
      "conversation_participants",
      "connections",
      "user_preferences",
      "user_activities",
      "impact_activities",
      "campaign_participants",
      "organization_members",
      "safe_space_sessions",
      "safe_space_helpers",
      "impact_metrics",
      "user_privacy_settings",
      "profiles",
    ];

    for (const table of tablesToDelete) {
      const { error } = await supabaseClient
        .from(table)
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
      }
    }

    // Delete auth user (this cascades to remaining data)
    const { error: deleteAuthError } = await supabaseClient.auth.admin.deleteUser(user.id);
    
    if (deleteAuthError) {
      throw deleteAuthError;
    }

    // Log the deletion for audit purposes
    await supabaseClient.from("security_audit_log").insert({
      user_id: user.id,
      action_type: "account_deletion",
      severity: "info",
      details: { timestamp: new Date().toISOString(), gdpr_request: true },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Account deletion completed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return createErrorResponse(error, 400, corsHeaders);
  }
});
