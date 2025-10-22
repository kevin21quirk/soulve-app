import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  features: any;
  max_campaigns: number;
  max_team_members: number;
  white_label_enabled: boolean;
}

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_monthly');

    if (error) {
      toast({
        title: "Error loading plans",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setPlans(data || []);
  };

  const handleSelectPlan = async (plan: Plan) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/auth?redirect=/pricing');
      return;
    }

    if (plan.name === 'Free') {
      toast({
        title: "Already on Free Plan",
        description: "You're currently on the free plan with access to basic features."
      });
      return;
    }

    // Navigate to checkout/payment page (to be created)
    navigate(`/checkout?plan=${plan.id}&cycle=${billingCycle}`);
  };

  const getPrice = (plan: Plan) => {
    return billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
  };

  const getCurrentPlanId = () => {
    return subscription?.plan?.id;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Flexible pricing for individuals, organisations, and enterprises. Pay with your bank - no card fees.
            </p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <Card className="w-fit mx-auto shadow-elegant">
          <CardContent className="p-2 flex gap-2">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('annual')}
              className="relative"
            >
              Annual
              <Badge variant="secondary" className="ml-2 text-xs">Save 20%</Badge>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const price = getPrice(plan);
            const isCurrentPlan = getCurrentPlanId() === plan.id;
            const isEnterprise = plan.name === 'Enterprise';

            return (
              <Card 
                key={plan.id} 
                className={`relative ${isEnterprise ? 'border-primary shadow-glow' : 'shadow-elegant'}`}
              >
                {isEnterprise && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">
                        £{price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentPlan}
                    variant={isEnterprise ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {isCurrentPlan ? 'Current Plan' : plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
                  </Button>

                  {plan.name !== 'Free' && (
                    <p className="text-xs text-center text-muted-foreground">
                      Pay securely via Open Banking
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Why Choose SouLVE Pricing?</h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">No Card Fees</h4>
                <p className="text-sm text-muted-foreground">
                  Pay directly from your bank with Open Banking - no expensive card processing fees
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Cancel Anytime</h4>
                <p className="text-sm text-muted-foreground">
                  No long-term contracts. Cancel your subscription whenever you need to
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Secure & Fast</h4>
                <p className="text-sm text-muted-foreground">
                  Bank-to-bank transfers with Strong Customer Authentication for your security
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
