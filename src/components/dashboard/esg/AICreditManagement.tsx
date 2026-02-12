import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';

interface AICreditManagementProps {
  organizationId: string;
}

interface CreditUsage {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  resetDate: string;
  recentUsage: Array<{
    date: string;
    endpoint: string;
    creditsUsed: number;
  }>;
}

export function AICreditManagement({ organizationId }: AICreditManagementProps) {
  const { data: creditUsage, isLoading, error } = useQuery({
    queryKey: ['ai-credit-usage', organizationId],
    queryFn: async (): Promise<CreditUsage> => {
      // Query rate limit table for usage
      const { data, error } = await supabase
        .from('ai_endpoint_rate_limits')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Mock data for demonstration - replace with actual credit tracking
      return {
        totalCredits: 1000,
        usedCredits: data?.length * 10 || 0,
        remainingCredits: 1000 - (data?.length * 10 || 0),
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        recentUsage: data?.map(record => ({
          date: record.created_at,
          endpoint: record.endpoint_name,
          creditsUsed: 10,
        })) || [],
      };
    },
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return <LoadingState message="Loading AI credit usage..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to Load Credit Usage"
        description="Unable to fetch AI credit information. Please try again."
      />
    );
  }

  if (!creditUsage) {
    return null;
  }

  const usagePercentage = (creditUsage.usedCredits / creditUsage.totalCredits) * 100;
  const isLowCredits = creditUsage.remainingCredits < creditUsage.totalCredits * 0.2;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Credit Usage</h3>
          </div>
          <Badge variant={isLowCredits ? 'destructive' : 'secondary'}>
            {creditUsage.remainingCredits} credits remaining
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Usage</span>
            <span className="font-medium">
              {creditUsage.usedCredits} / {creditUsage.totalCredits}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        {isLowCredits && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">Low Credit Balance</p>
              <p className="text-xs text-muted-foreground">
                You're running low on AI credits. Consider upgrading your plan to continue using AI features.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Used This Month</p>
              <p className="text-lg font-semibold">{creditUsage.usedCredits}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Resets On</p>
              <p className="text-lg font-semibold">
                {new Date(creditUsage.resetDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent AI Requests</h4>
          {creditUsage.recentUsage.length > 0 ? (
            <div className="space-y-2">
              {creditUsage.recentUsage.slice(0, 5).map((usage, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-muted/30 rounded"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{usage.endpoint}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(usage.date).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {usage.creditsUsed} credits
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent AI requests</p>
          )}
        </div>

        <Button variant="outline" className="w-full" disabled>
          <span>Learn About AI Credits</span>
        </Button>
      </div>
    </Card>
  );
}
