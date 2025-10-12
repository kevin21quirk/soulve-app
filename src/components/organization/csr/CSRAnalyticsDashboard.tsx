import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Heart,
  Award,
  Target,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchCSRAnalytics } from "@/services/csrService";

const CSRAnalyticsDashboard = () => {
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
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No CSR data available yet. Start by creating campaigns or supporting community needs.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Impact Analytics Dashboard</h3>
        <p className="text-muted-foreground">
          Track real community impact and measure your CSR success
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
                <p className="text-2xl font-bold text-foreground">{analytics.livesImpacted.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CSR Investment</p>
                <p className="text-2xl font-bold text-foreground">£{analytics.totalInvestment.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Partnerships</p>
                <p className="text-2xl font-bold text-foreground">{analytics.activePartnerships}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CSR Opportunities</p>
                <p className="text-2xl font-bold text-foreground">{analytics.opportunities.completed}</p>
                <p className="text-xs text-orange-600">{analytics.opportunities.committed} in progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            CSR Pipeline
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{analytics.opportunities.interested}</p>
              <p className="text-xs text-muted-foreground">Interested</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{analytics.opportunities.contacted}</p>
              <p className="text-xs text-muted-foreground">Contacted</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{analytics.opportunities.committed}</p>
              <p className="text-xs text-muted-foreground">Committed</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analytics.opportunities.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESG Integration */}
      <Card className="border-2 border-primary">
        <CardContent className="p-6">
          <div>
            <h4 className="font-semibold text-foreground mb-2">ESG Reporting Integration</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your CSR activities automatically contribute to your ESG reporting metrics
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Social Impact</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.livesImpacted > 0 ? Math.min(95, 50 + Math.floor(analytics.livesImpacted / 10)) : 50}
                </p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Investment</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.totalInvestment > 0 ? Math.min(95, 50 + Math.floor(analytics.totalInvestment / 1000)) : 50}
                </p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Community Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.activePartnerships > 0 ? Math.min(98, 60 + (analytics.activePartnerships * 3)) : 60}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSRAnalyticsDashboard;
