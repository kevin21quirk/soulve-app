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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract JWT token and decode it (Deno already verified it via verify_jwt = true)
    const jwt = authHeader.replace("Bearer ", "");
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      return new Response(
        JSON.stringify({ error: "Invalid token format" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let userId: string;
    try {
      const payload = JSON.parse(atob(parts[1]));
      userId = payload.sub;
      if (!userId) {
        throw new Error("No user ID in token");
      }
      console.log("✅ Authenticated user:", userId);
    } catch (error) {
      console.error("Token decode error:", error);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation and sanitization
    const requestBody = await req.json();
    const { organizationId, analysisType } = requestBody;
    
    if (!organizationId || typeof organizationId !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid organizationId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validAnalysisTypes = ['report', 'compliance', 'materiality', 'recommendations'];
    if (!analysisType || !validAnalysisTypes.includes(analysisType)) {
      return new Response(
        JSON.stringify({ error: "Invalid analysisType. Must be one of: report, compliance, materiality, recommendations" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user has access to organization
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: membership } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (!membership) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Not a member of this organization" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit (50 requests per hour per user)
    const { data: rateLimitOk } = await supabase.rpc('check_ai_rate_limit', {
      p_user_id: userId,
      p_endpoint_name: 'ai-esg-insights',
      p_max_requests: 50,
      p_window_minutes: 60
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. You can make up to 50 AI requests per hour." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch organization ESG data
    const { data: esgData } = await supabase
      .from("organization_esg_data")
      .select("*")
      .eq("organization_id", organizationId);

    const { data: risks } = await supabase
      .from("esg_risks")
      .select("*")
      .eq("organization_id", organizationId);

    const { data: recommendations } = await supabase
      .from("esg_recommendations")
      .select("*")
      .eq("organization_id", organizationId);

    let systemPrompt = "";
    let userPrompt = "";

    if (analysisType === "report") {
      systemPrompt = "You are an ESG reporting expert helping organizations create comprehensive sustainability reports.";
      userPrompt = `Generate an executive summary for this organization's ESG report:

ESG Data: ${JSON.stringify(esgData, null, 2)}
Identified Risks: ${JSON.stringify(risks, null, 2)}
Current Recommendations: ${JSON.stringify(recommendations, null, 2)}

Provide:
1. Key highlights and achievements
2. Areas of concern
3. Year-over-year trends
4. Strategic recommendations
5. Compliance status`;
    } else if (analysisType === "compliance") {
      systemPrompt = "You are an ESG compliance specialist analyzing regulatory requirements.";
      userPrompt = `Analyze this organization's ESG compliance status:

ESG Data: ${JSON.stringify(esgData, null, 2)}

Provide:
1. Compliance gaps
2. Priority actions needed
3. Framework alignment (GRI, SASB, TCFD)
4. Timeline for addressing gaps
5. Resource requirements`;
    } else if (analysisType === "materiality") {
      systemPrompt = "You are a materiality assessment expert for ESG reporting.";
      userPrompt = `Conduct a materiality assessment analysis:

Current ESG Data: ${JSON.stringify(esgData, null, 2)}
Risk Profile: ${JSON.stringify(risks, null, 2)}

Identify:
1. Most material ESG issues
2. Stakeholder priorities
3. Business impact assessment
4. Recommended focus areas
5. Measurement approach`;
    } else if (analysisType === "recommendations") {
      systemPrompt = "You are an ESG strategy consultant providing actionable recommendations to improve sustainability performance.";
      userPrompt = `Analyze this organisation's ESG data and provide specific, actionable recommendations:

Current ESG Data: ${JSON.stringify(esgData, null, 2)}
Risk Profile: ${JSON.stringify(risks, null, 2)}
Existing Recommendations: ${JSON.stringify(recommendations, null, 2)}

For each recommendation provide:
1. Title (concise action)
2. Category (efficiency, best_practice, risk_mitigation, compliance)
3. Priority score (0-100 based on impact and urgency)
4. Description (specific actionable details)
5. Implementation effort (low, medium, high)
6. Potential impact (quantified where possible)

Return as JSON array with format:
[{
  "title": "string",
  "recommendation_type": "efficiency|best_practice|risk_mitigation|compliance",
  "priority_score": number,
  "description": "string",
  "implementation_effort": "low|medium|high",
  "potential_impact": "string",
  "status": "new"
}]

Focus on practical, measurable actions aligned with UK/EU ESG standards.`;
    }

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
          { role: "user", content: userPrompt }
        ]
      }),
    });

    if (!aiResponse.ok) {
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
    const insights = aiData.choices[0]?.message?.content;

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in ai-esg-insights function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
