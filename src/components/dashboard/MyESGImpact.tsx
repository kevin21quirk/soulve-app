import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Users, Heart, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function MyESGImpact() {
  const { user } = useAuth();

  const { data: impactData, isLoading } = useQuery({
    queryKey: ["my-esg-impact", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get organizations user is part of
      const { data: memberships } = await supabase
        .from("organization_members")
        .select(`
          organization_id,
          organizations (
            id,
            name,
            organization_trust_scores (
              esg_score
            )
          )
        `)
        .eq("user_id", user.id)
        .eq("is_active", true);

      // Get user's activities
      const { data: activities } = await supabase
        .from("impact_activities")
        .select("*")
        .eq("user_id", user.id)
        .eq("verified", true);

      // Calculate aggregate scores
      const orgScores = memberships?.map(m => m.organizations?.organization_trust_scores?.[0]?.esg_score || 0) || [];
      const avgOrgScore = orgScores.length > 0 ? Math.round(orgScores.reduce((a, b) => a + b, 0) / orgScores.length) : 0;

      // Count activities by ESG category
      const environmentalActivities = activities?.filter(a => 
        ["volunteer", "recycling", "carbon_offset"].includes(a.activity_type)
      ).length || 0;

      const socialActivities = activities?.filter(a => 
        ["help_provided", "donation", "community_service"].includes(a.activity_type)
      ).length || 0;

      const volunteerHours = activities
        ?.filter(a => a.activity_type === "volunteer")
        .reduce((sum, a) => {
          const metadata = a.metadata as any;
          return sum + (parseInt(metadata?.hours || "0"));
        }, 0) || 0;

      const donationAmount = activities
        ?.filter(a => a.activity_type === "donation")
        .reduce((sum, a) => {
          const metadata = a.metadata as any;
          return sum + (parseFloat(metadata?.amount || "0"));
        }, 0) || 0;

      return {
        avgOrgScore,
        environmentalActivities,
        socialActivities,
        volunteerHours,
        donationAmount,
        totalOrganizations: memberships?.length || 0,
        totalActivities: activities?.length || 0,
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!impactData || impactData.totalActivities === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            My ESG Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Start volunteering or donating to track your ESG impact
          </p>
        </CardContent>
      </Card>
    );
  }

  const impactMetrics = [
    {
      label: "Environmental Actions",
      value: impactData.environmentalActivities,
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Social Impact",
      value: impactData.socialActivities,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Volunteer Hours",
      value: impactData.volunteerHours,
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            My ESG Impact
          </CardTitle>
          <Badge variant="secondary">
            {impactData.totalOrganizations} Organizations
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average ESG Score */}
        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Average ESG Score Across Organizations
          </div>
          <div className="text-3xl font-bold text-primary">
            {impactData.avgOrgScore}<span className="text-lg">/100</span>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {impactMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="text-center">
                <div className={`w-12 h-12 ${metric.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Donation Amount */}
        {impactData.donationAmount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Donated</span>
              <span className="text-lg font-bold text-primary">
                £{impactData.donationAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">ESG Engagement</span>
            <span className="font-medium">{Math.min(100, impactData.totalActivities * 5)}%</span>
          </div>
          <Progress value={Math.min(100, impactData.totalActivities * 5)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
