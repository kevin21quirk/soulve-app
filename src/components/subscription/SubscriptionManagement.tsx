import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Crown, Users, Rocket, AlertTriangle, Calendar, CreditCard } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { YapilyService } from '@/services/yapilyService';
import { format } from 'date-fns';

interface SubscriptionManagementProps {
  currentCampaignCount?: number;
  currentTeamMemberCount?: number;
}

const SubscriptionManagement = ({
  currentCampaignCount = 0,
  currentTeamMemberCount = 1
}: SubscriptionManagementProps) => {
  const { subscription, loading, planName, refresh } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cancelling, setCancelling] = useState(false);

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setCancelling(true);
    try {
      await YapilyService.cancelSubscription(subscription.id);
      
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will remain active until the end of your billing period.'
      });
      
      await refresh();
    } catch (error: any) {
      toast({
        title: 'Failed to cancel subscription',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCampaigns = subscription?.plan.max_campaigns || 3;
  const maxTeamMembers = subscription?.plan.max_team_members || 1;
  const campaignUsagePercent = (currentCampaignCount / maxCampaigns) * 100;
  const teamUsagePercent = (currentTeamMemberCount / maxTeamMembers) * 100;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                {planName} Plan
              </CardTitle>
              <CardDescription>
                {subscription ? (
                  <>
                    {subscription.billing_cycle === 'monthly' ? 'Monthly' : 'Annual'} billing •{' '}
                    {subscription.cancel_at_period_end ? (
                      <span className="text-yellow-600">Cancels on {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}</span>
                    ) : (
                      <>Renews on {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}</>
                    )}
                  </>
                ) : (
                  'Free tier with basic features'
                )}
              </CardDescription>
            </div>
            <Badge variant={subscription ? 'default' : 'secondary'}>
              {subscription?.status || 'Free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {subscription && (
              <>
                <Button onClick={handleUpgrade} variant="outline">
                  <Rocket className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" disabled={subscription.cancel_at_period_end}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Your subscription will remain active until {format(new Date(subscription.current_period_end), 'MMMM dd, yyyy')}.
                        After that, you'll be downgraded to the Free plan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {!subscription && (
              <Button onClick={handleUpgrade} className="w-full sm:w-auto">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Track your current usage against plan limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Campaigns
              </span>
              <span className="font-medium">
                {currentCampaignCount} / {maxCampaigns}
              </span>
            </div>
            <Progress value={campaignUsagePercent} className="h-2" />
            {campaignUsagePercent >= 80 && (
              <p className="text-xs text-yellow-600">
                You're approaching your campaign limit. Consider upgrading to create more campaigns.
              </p>
            )}
          </div>

          {/* Team Member Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members
              </span>
              <span className="font-medium">
                {currentTeamMemberCount} / {maxTeamMembers}
              </span>
            </div>
            <Progress value={teamUsagePercent} className="h-2" />
            {teamUsagePercent >= 80 && (
              <p className="text-xs text-yellow-600">
                You're approaching your team member limit. Upgrade to add more team members.
              </p>
            )}
          </div>

          {/* Feature Access */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Feature Access</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>White Label Branding</span>
                <Badge variant={subscription?.plan.white_label_enabled ? 'default' : 'secondary'}>
                  {subscription?.plan.white_label_enabled ? 'Enabled' : 'Upgrade Required'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>ESG Reporting</span>
                <Badge variant={planName !== 'Free' ? 'default' : 'secondary'}>
                  {planName !== 'Free' ? 'Enabled' : 'Upgrade Required'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Advanced Analytics</span>
                <Badge variant={planName === 'Organisation' || planName === 'Enterprise' ? 'default' : 'secondary'}>
                  {planName === 'Organisation' || planName === 'Enterprise' ? 'Enabled' : 'Upgrade Required'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
