import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';

interface FeatureGateProps {
  feature: 'white_label' | 'esg' | 'analytics';
  requiredPlan?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const FeatureGate = ({ feature, requiredPlan = 'Individual', children, fallback }: FeatureGateProps) => {
  const { subscription, planName, hasWhiteLabel } = useSubscription();
  const navigate = useNavigate();

  const hasAccess = () => {
    switch (feature) {
      case 'white_label':
        return hasWhiteLabel();
      case 'esg':
        return planName !== 'Free';
      case 'analytics':
        return planName === 'Organisation' || planName === 'Enterprise';
      default:
        return false;
    }
  };

  const getFeatureName = () => {
    switch (feature) {
      case 'white_label':
        return 'White Label Branding';
      case 'esg':
        return 'ESG Reporting';
      case 'analytics':
        return 'Advanced Analytics';
      default:
        return 'Premium Feature';
    }
  };

  const getFeatureDescription = () => {
    switch (feature) {
      case 'white_label':
        return 'Customize your platform with your brand colors, logo, and domain. Available on Enterprise plans.';
      case 'esg':
        return 'Track and report on your environmental, social, and governance impact. Available on Individual plans and above.';
      case 'analytics':
        return 'Access detailed insights, custom reports, and data exports. Available on Organisation plans and above.';
      default:
        return 'This feature requires a premium plan subscription.';
    }
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {getFeatureName()}
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <Crown className="h-3 w-3" />
            {requiredPlan}+
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {getFeatureDescription()}
        </p>

        <div className="bg-white/60 rounded-lg p-4 border border-primary/10">
          <div className="flex items-start gap-3 mb-3">
            <Crown className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Unlock This Feature</h4>
              <p className="text-xs text-muted-foreground">
                Upgrade to {requiredPlan} or higher to access {getFeatureName().toLowerCase()}.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/pricing')}
          className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
        >
          <Crown className="h-4 w-4 mr-2" />
          View Plans & Upgrade
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
