import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  PoundSterling, 
  Heart,
  Award,
  Target,
  Loader2,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchCSRAnalytics } from "@/services/csrService";
import { EmptyESGState } from "@/components/ui/empty-esg-state";

interface CSROverviewProps {
  onNavigateToTab?: (tab: string) => void;
}

const CSROverview = ({ onNavigateToTab }: CSROverviewProps) => {
  const { organizationId } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizationId) {
      loadAnalytics();
    }
  }, [organizationId]);

  const loadAnalytics = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const data = await fetchCSRAnalytics(organizationId);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load CSR analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!analytics || (analytics.totalInvestment === 0 && analytics.activePartnerships === 0)) {
    return (
      <EmptyESGState
        icon={Heart}
        title="Start Your CSR Journey"
        description="Connect with community initiatives, sponsor campaigns, and track your social impact. Build meaningful partnerships that align with your values."
        action={{
          label: "Discover Community Needs",
          onClick: () => onNavigateToTab?.("partnerships")
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Lives Impacted</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              {analytics.livesImpacted.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PoundSterling className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">CSR Investment</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              £{analytics.totalInvestment.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Active Partnerships</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              {analytics.activePartnerships}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Completed Initiatives</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              {analytics.opportunities.completed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            CSR Opportunity Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg border">
              <p className="text-3xl font-bold text-foreground mb-1">{analytics.opportunities.interested}</p>
              <p className="text-sm text-muted-foreground">Interested</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg border">
              <p className="text-3xl font-bold text-foreground mb-1">{analytics.opportunities.contacted}</p>
              <p className="text-sm text-muted-foreground">Contacted</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg border">
              <p className="text-3xl font-bold text-foreground mb-1">{analytics.opportunities.committed}</p>
              <p className="text-sm text-muted-foreground">Committed</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary">
              <p className="text-3xl font-bold text-primary mb-1">{analytics.opportunities.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESG Integration */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            ESG Impact Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Your CSR activities automatically contribute to your ESG Social metrics and reporting
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Social Impact Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
                {analytics.livesImpacted > 0 ? Math.min(95, 50 + Math.floor(analytics.livesImpacted / 10)) : 50}
              </p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Investment Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
                {analytics.totalInvestment > 0 ? Math.min(95, 50 + Math.floor(analytics.totalInvestment / 1000)) : 50}
              </p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Community Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
                {analytics.activePartnerships > 0 ? Math.min(98, 60 + (analytics.activePartnerships * 3)) : 60}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-6"
            onClick={() => onNavigateToTab?.("reporting")}
          >
            View Full Impact Report
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSROverview;
