import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, Users, Shield, TrendingUp, Award, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ESGPublicSectionProps {
  organizationId: string;
}

export default function ESGPublicSection({ organizationId }: ESGPublicSectionProps) {
  const { data: esgData, isLoading } = useQuery({
    queryKey: ["esg-public", organizationId],
    queryFn: async () => {
      const [trustScoreResult, assessmentsResult, dataResult] = await Promise.all([
        supabase
          .from("organization_trust_scores")
          .select("*")
          .eq("organization_id", organizationId)
          .order("calculated_at", { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from("materiality_assessments")
          .select(`
            *,
            indicator_id
          `)
          .eq("organization_id", organizationId)
          .order("assessment_year", { ascending: false }),
        supabase
          .from("organization_esg_data")
          .select("*")
          .eq("organization_id", organizationId)
          .order("reporting_period", { ascending: false })
          .limit(10),
      ]);

      // Calculate category scores
      const assessments = assessmentsResult.data || [];
      
      // Get unique indicator IDs and fetch their details
      const indicatorIds = [...new Set(assessments.map(a => a.indicator_id).filter(Boolean))];
      
      let indicators: any[] = [];
      let indicatorMap = new Map();
      
      if (indicatorIds.length > 0) {
        const { data: indicatorsData } = await supabase
          .from("esg_indicators")
          .select("id, name, category")
          .in("id", indicatorIds);
        
        indicators = indicatorsData || [];
        indicatorMap = new Map(indicators.map(i => [i.id, i]));
      }
      
      const categorized = {
        environmental: assessments.filter(a => indicatorMap.get(a.indicator_id)?.category === "environmental"),
        social: assessments.filter(a => indicatorMap.get(a.indicator_id)?.category === "social"),
        governance: assessments.filter(a => indicatorMap.get(a.indicator_id)?.category === "governance"),
      };

      const calculateAvg = (items: any[]) => {
        if (items.length === 0) return 0;
        return Math.round(
          items.reduce((acc, item) => acc + ((item.business_impact + item.stakeholder_importance) / 2), 0) / items.length
        );
      };

      return {
        trustScore: trustScoreResult.data,
        assessments: assessmentsResult.data || [],
        esgData: dataResult.data || [],
        indicators: indicatorMap,
        categoryScores: {
          environmental: calculateAvg(categorized.environmental),
          social: calculateAvg(categorized.social),
          governance: calculateAvg(categorized.governance),
        },
        overallScore: calculateAvg(assessments),
      };
    },
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!esgData || esgData.assessments.length === 0) {
    return null; // Don't show section if no ESG data
  }

  const { trustScore, categoryScores, overallScore, esgData: dataPoints, indicators } = esgData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const categories = [
    { name: "Environmental", icon: Leaf, score: categoryScores.environmental, color: "text-green-600" },
    { name: "Social", icon: Users, score: categoryScores.social, color: "text-blue-600" },
    { name: "Governance", icon: Shield, score: categoryScores.governance, color: "text-purple-600" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            ESG Performance
          </CardTitle>
          {trustScore?.esg_score && trustScore.esg_score >= 80 && (
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              ESG Leader
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-2">Overall ESG Score</div>
          <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}<span className="text-2xl">/100</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Based on {dataPoints.length} data points</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                    {category.score}
                  </span>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Trust Metrics */}
        {trustScore && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Transparency Score</div>
              <div className="text-2xl font-bold">{trustScore.transparency_score}/100</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Verification Score</div>
              <div className="text-2xl font-bold">{trustScore.verification_score}/100</div>
            </div>
          </div>
        )}

        {/* Frameworks */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-3">ESG Categories</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Environmental</Badge>
            <Badge variant="secondary">Social</Badge>
            <Badge variant="secondary">Governance</Badge>
          </div>
        </div>

        {/* CTA */}
        <Button variant="outline" className="w-full" asChild>
          <a href={`/organization/${organizationId}/esg-report`} className="flex items-center justify-center gap-2">
            View Full ESG Report
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
