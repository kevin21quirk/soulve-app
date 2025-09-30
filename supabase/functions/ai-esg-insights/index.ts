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
    const { organizationId, analysisType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

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
