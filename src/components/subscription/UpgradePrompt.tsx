import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  title?: string;
  description?: string;
  feature?: string;
  currentLimit?: number;
  planName?: string;
}

const UpgradePrompt = ({
  title = "Upgrade to Create More",
  description = "You've reached your campaign limit.",
  feature = "campaigns",
  currentLimit = 3,
  planName = "Free"
}: UpgradePromptProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl">{title}</CardTitle>
            </div>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {planName} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-white/60 rounded-lg border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-5 w-5 text-amber-500" />
            <h4 className="font-semibold">Current Limit Reached</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            You've created <strong>{currentLimit} {feature}</strong> on the {planName} plan.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span><strong>Individual Plan:</strong> Up to 10 campaigns</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span><strong>Organisation Plan:</strong> Up to 50 campaigns</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span><strong>Enterprise Plan:</strong> Unlimited campaigns</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => navigate('/pricing')}
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
            size="lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            View Plans & Upgrade
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            size="lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
