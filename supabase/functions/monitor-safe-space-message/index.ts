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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { messageId, content, sessionId } = await req.json();

    if (!messageId || !content || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing message ${messageId} from session ${sessionId}`);

    // Get flagged keywords
    const { data: keywords, error: keywordsError } = await supabaseClient
      .from('safe_space_flagged_keywords')
      .select('*')
      .eq('is_active', true);

    if (keywordsError) {
      console.error('Error fetching keywords:', keywordsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch keywords' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for keyword matches
    const detectedKeywords: string[] = [];
    let maxSeverity = 'low';
    let requiresImmediateEscalation = false;

    const lowerContent = content.toLowerCase();
    
    keywords?.forEach((keyword) => {
      if (lowerContent.includes(keyword.keyword.toLowerCase())) {
        detectedKeywords.push(keyword.keyword);
        
        if (keyword.severity === 'critical') maxSeverity = 'critical';
        else if (keyword.severity === 'high' && maxSeverity !== 'critical') maxSeverity = 'high';
        else if (keyword.severity === 'medium' && !['critical', 'high'].includes(maxSeverity)) maxSeverity = 'medium';
        
        if (keyword.requires_immediate_escalation) {
          requiresImmediateEscalation = true;
        }
      }
    });

    // Call Lovable AI Gateway with Gemini for sentiment analysis
    let aiRiskScore = 0;
    let aiAnalysis = {};

    if (detectedKeywords.length > 0 || content.length > 100) {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (!LOVABLE_API_KEY) {
        console.warn('LOVABLE_API_KEY not configured, skipping AI analysis');
      } else {
        try {
          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: 'You are a crisis detection AI analyzing support conversation messages. Return ONLY valid JSON with no additional text.'
                },
                {
                  role: 'user',
                  content: `Analyze this support message for crisis indicators and return JSON:
Message: "${content}"

Return format:
{
  "sentiment": <number between -1 and 1>,
  "riskScore": <number 0-100>,
  "crisisIndicators": [<array of strings>],
  "requiresEscalation": <boolean>
}`
                }
              ],
              temperature: 0.3,
              max_completion_tokens: 300
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const aiContent = aiData.choices?.[0]?.message?.content;
            
            if (aiContent) {
              try {
                aiAnalysis = JSON.parse(aiContent);
                aiRiskScore = (aiAnalysis as any).riskScore || 0;
              } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
              }
            }
          } else if (aiResponse.status === 429) {
            console.warn('Lovable AI rate limit exceeded');
          } else if (aiResponse.status === 402) {
            console.warn('Lovable AI credits exhausted');
          }
        } catch (aiError) {
          console.error('Error calling Lovable AI:', aiError);
        }
      }
    }

    // Calculate final risk score
    const keywordRiskScore = detectedKeywords.length * 15;
    const severityMultiplier = maxSeverity === 'critical' ? 2 : maxSeverity === 'high' ? 1.5 : 1;
    const finalRiskScore = Math.min(100, Math.max(aiRiskScore, keywordRiskScore * severityMultiplier));

    console.log(`Risk analysis: Score=${finalRiskScore}, Keywords=${detectedKeywords.length}, Severity=${maxSeverity}`);

    // Create alert if risk score > 80 or immediate escalation required
    if (finalRiskScore > 80 || requiresImmediateEscalation) {
      const { error: alertError } = await supabaseClient
        .from('safe_space_emergency_alerts')
        .insert({
          session_id: sessionId,
          message_id: messageId,
          alert_type: requiresImmediateEscalation ? 'crisis_keyword_detected' : 'high_risk_detected',
          severity: maxSeverity,
          risk_score: Math.round(finalRiskScore),
          detected_keywords: detectedKeywords,
          ai_analysis: aiAnalysis,
          status: 'pending'
        });

      if (alertError) {
        console.error('Error creating alert:', alertError);
      } else {
        console.log(`ALERT CREATED: Risk score ${finalRiskScore}, Immediate escalation: ${requiresImmediateEscalation}`);
        
        // Auto-pause session for critical/high severity
        if (maxSeverity === 'critical' || maxSeverity === 'high' || requiresImmediateEscalation) {
          const { error: pauseError } = await supabaseClient
            .from('safe_space_sessions')
            .update({
              session_paused: true,
              paused_reason: `Automated pause: ${maxSeverity} severity content detected (Risk: ${Math.round(finalRiskScore)})`,
              paused_at: new Date().toISOString()
            })
            .eq('id', sessionId);

          if (pauseError) {
            console.error('Error pausing session:', pauseError);
          } else {
            console.log(`Session ${sessionId} AUTO-PAUSED due to ${maxSeverity} severity content`);
          }
        }
        
        // Send notification email to safeguarding lead
        const { data: safeguardingLeads } = await supabaseClient
          .from('safeguarding_roles')
          .select('user_id')
          .eq('role', 'safeguarding_lead')
          .eq('is_active', true);

        if (safeguardingLeads && safeguardingLeads.length > 0) {
          // Call send-emergency-alert function
          await supabaseClient.functions.invoke('send-emergency-alert', {
            body: {
              alertType: requiresImmediateEscalation ? 'crisis_keyword_detected' : 'high_risk_detected',
              severity: maxSeverity,
              riskScore: Math.round(finalRiskScore),
              sessionId,
              messageId
            }
          });
        }
      }
    }

    // Log to audit
    await supabaseClient
      .from('safe_space_audit_log')
      .insert({
        user_id: (await supabaseClient.auth.getUser()).data.user?.id,
        action_type: 'message_monitoring',
        resource_type: 'safe_space_message',
        resource_id: messageId,
        details: {
          risk_score: Math.round(finalRiskScore),
          keywords_detected: detectedKeywords.length,
          alert_created: finalRiskScore > 80 || requiresImmediateEscalation
        }
      });

    return new Response(
      JSON.stringify({
        analyzed: true,
        riskScore: Math.round(finalRiskScore),
        alertCreated: finalRiskScore > 80 || requiresImmediateEscalation,
        detectedKeywords: detectedKeywords.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in monitor-safe-space-message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});