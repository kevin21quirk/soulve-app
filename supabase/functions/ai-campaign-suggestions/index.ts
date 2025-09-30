import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignData, type } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "title") {
      systemPrompt = "You are an expert at creating compelling campaign titles for social impact initiatives.";
      userPrompt = `Generate 3 compelling campaign title suggestions based on this information:
Category: ${campaignData.category}
Description: ${campaignData.description || "Not provided"}
Goal: ${campaignData.goalType}
Organization Type: ${campaignData.organizationType}

Provide titles that are:
- Clear and actionable
- Emotionally engaging
- Under 60 characters
- Focused on impact`;
    } else if (type === "description") {
      systemPrompt = "You are an expert at writing persuasive campaign descriptions for social causes.";
      userPrompt = `Improve this campaign description:
Current: ${campaignData.description || ""}
Title: ${campaignData.title}
Category: ${campaignData.category}
Goal Amount: ${campaignData.goalAmount || "Not specified"}

Create a compelling description that:
- Explains the problem clearly
- Shows the impact of contributions
- Includes a call to action
- Is 150-300 words`;
    } else if (type === "predict") {
      systemPrompt = "You are an AI analyst predicting campaign success based on historical data.";
      userPrompt = `Analyze this campaign and predict its success probability:
${JSON.stringify(campaignData, null, 2)}

Provide:
1. Success probability (0-100%)
2. Key factors affecting success
3. Specific recommendations to improve chances
4. Optimal launch timing
5. Target audience insights`;
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
    const suggestion = aiData.choices[0]?.message?.content;

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in ai-campaign-suggestions function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
