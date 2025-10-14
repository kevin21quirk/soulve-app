import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const CompactESGImpact = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: esgData, isLoading } = useQuery({
    queryKey: ['user-esg-impact', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get user's organization memberships
      const { data: memberships } = await supabase
        .from('organization_members')
        .select('organization_id, organizations(name)')
        .eq('user_id', user.id);

      if (!memberships || memberships.length === 0) return null;

      // Get ESG scores for organizations
      const orgIds = memberships.map(m => m.organization_id);
      const { data: esgScores } = await supabase
        .from('organization_trust_scores')
        .select('organization_id, esg_score')
        .in('organization_id', orgIds)
        .order('calculated_at', { ascending: false });

      // Get user's impact activities
      const { data: activities } = await supabase
        .from('impact_activities')
        .select('activity_type, points_earned')
        .eq('user_id', user.id)
        .eq('verified', true);

      const avgScore = esgScores && esgScores.length > 0
        ? Math.round(esgScores.reduce((acc, s) => acc + (s.esg_score || 0), 0) / esgScores.length)
        : 0;

      const totalActivities = activities?.length || 0;

      return {
        avgScore,
        totalActivities,
        orgCount: memberships.length
      };
    },
    enabled: !!user?.id
  });

  if (isLoading || !esgData || esgData.totalActivities === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">My ESG Impact</CardTitle>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-foreground">{esgData.avgScore}</div>
            <Badge variant="secondary" className="text-xs">
              {esgData.orgCount} {esgData.orgCount === 1 ? 'org' : 'orgs'}
            </Badge>
          </div>
          
          <CollapsibleContent className="mt-4 space-y-2">
            <div className="text-sm text-muted-foreground">
              Average ESG score across your organizations
            </div>
            <div className="text-xs text-muted-foreground">
              {esgData.totalActivities} verified impact activities
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
};

export default CompactESGImpact;
