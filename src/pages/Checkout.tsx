import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, CreditCard, Building2, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { YapilyService } from '@/services/yapilyService';

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

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const planId = searchParams.get('plan');
    const cycle = searchParams.get('cycle') as 'monthly' | 'annual';
    
    if (cycle) setBillingCycle(cycle);
    
    if (planId) {
      loadPlan(planId);
    } else {
      navigate('/pricing');
    }
  }, [searchParams]);

  const loadPlan = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      setPlan(data);
    } catch (error: any) {
      toast({
        title: 'Error loading plan',
        description: error.message,
        variant: 'destructive'
      });
      navigate('/pricing');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan) return;

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create recurring payment consent via Yapily
      const consent = await YapilyService.createRecurringConsent(
        user.id,
        plan.id,
        billingCycle
      );

      // Redirect to bank authorization
      window.location.href = consent.authorisationUrl;
    } catch (error: any) {
      toast({
        title: 'Payment failed',
        description: error.message,
        variant: 'destructive'
      });
      setProcessing(false);
    }
  };

  const getPrice = () => {
    if (!plan) return 0;
    return billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
  };

  const getSavings = () => {
    if (!plan || billingCycle === 'monthly') return 0;
    const monthlyTotal = plan.price_monthly * 12;
    const annualTotal = plan.price_annual;
    return monthlyTotal - annualTotal;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/pricing')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pricing
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{plan.name} Plan</h3>
                  <Badge>{billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {billingCycle === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Included Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Up to {plan.max_campaigns} campaigns</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Up to {plan.max_team_members} team members</span>
                  </li>
                  {plan.white_label_enabled && (
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>White label branding</span>
                    </li>
                  )}
                  {Array.isArray(plan.features) && plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">£{getPrice()}</span>
                </div>
                {billingCycle === 'annual' && getSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Annual Savings</span>
                    <span className="font-medium">-£{getSavings()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>£{getPrice()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {billingCycle === 'monthly' ? 'per month' : 'per year'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Secure bank payment via Yapily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Pay with your bank</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect your bank account securely. No card fees. FCA-regulated.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Bank-grade encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4" />
                  <span>No hidden fees</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Your subscription will automatically renew each {billingCycle === 'monthly' ? 'month' : 'year'}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
