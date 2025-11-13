import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with anon key to leverage RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userId, userPreferences, existingConnections } = await req.json();

    // Verify user can only request their own recommendations
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - can only request own recommendations' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch user profile and community data
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, location, interests, skills")
      .eq("id", userId)
      .single();

    // Fetch available posts, users, and campaigns
    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .eq("is_active", true)
      .limit(50);

    const { data: users } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, location, interests, skills")
      .neq("id", userId)
      .limit(50);

    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("*")
      .eq("status", "active")
      .limit(20);

    // Build AI prompt
    const systemPrompt = `You are an AI recommendation engine for SouLVE, a community impact platform. 
Your goal is to provide personalized recommendations for connections, help opportunities, and campaigns 
that align with the user's interests and can maximize their community impact.`;

    const userPrompt = `User Profile:
- Name: ${profile?.first_name} ${profile?.last_name}
- Location: ${profile?.location || "Not specified"}
- Interests: ${profile?.interests?.join(", ") || "Not specified"}
- Skills: ${profile?.skills?.join(", ") || "Not specified"}
- Existing Connections: ${existingConnections?.length || 0}

Available Data:
- ${users?.length || 0} potential connections
- ${posts?.length || 0} help opportunities
- ${campaigns?.length || 0} active campaigns

Analyze this data and provide 5-7 personalized recommendations. For each recommendation, include:
1. Type (connection/help_opportunity/skill_match/post)
2. Target ID from the provided data
3. Confidence score (60-95)
4. Clear reasoning why this matches the user
5. Specific metadata (user details, location, timeCommitment, etc.)

Format your response as a JSON array of recommendation objects.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: userPrompt + "\n\nContext:\n" + JSON.stringify({ users, posts, campaigns }, null, 2) 
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_recommendations",
            description: "Generate personalized recommendations for the user",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["connection", "help_opportunity", "skill_match", "post"] },
                      targetId: { type: "string" },
                      confidence: { type: "number", minimum: 60, maximum: 95 },
                      reasoning: { type: "string" },
                      metadata: { type: "object" }
                    },
                    required: ["type", "targetId", "confidence", "reasoning", "metadata"]
                  }
                }
              },
              required: ["recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_recommendations" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error("AI Gateway request failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No recommendations generated");
    }

    const recommendations = JSON.parse(toolCall.function.arguments).recommendations;

    // Cache recommendations in database
    for (const rec of recommendations) {
      await supabase.from("recommendation_cache").insert({
        user_id: userId,
        recommendation_type: rec.type,
        target_id: rec.targetId,
        confidence_score: rec.confidence,
        reasoning: rec.reasoning,
        metadata: rec.metadata,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in ai-recommendations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
