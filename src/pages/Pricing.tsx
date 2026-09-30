import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Sparkles, Landmark, RefreshCcw, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  features: unknown;
  max_campaigns: number;
  max_team_members: number;
  white_label_enabled: boolean;
}

// Matches the seeded defaults in the subscription_plans migration — shown if
// the table is unreachable/empty so the public pricing page never renders blank.
const FALLBACK_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price_monthly: 0,
    price_annual: 0,
    features: ["Basic Impact Analytics", "Up to 3 Campaigns", "Badge System Access", "Safe Space Access"],
    max_campaigns: 3,
    max_team_members: 1,
    white_label_enabled: false,
  },
  {
    id: 'individual',
    name: 'Individual',
    price_monthly: 9.99,
    price_annual: 95.90,
    features: ["Advanced Impact Analytics", "Up to 10 Campaigns", "Badge System Access", "Safe Space Access", "Priority Support"],
    max_campaigns: 10,
    max_team_members: 1,
    white_label_enabled: false,
  },
  {
    id: 'organisation',
    name: 'Organisation',
    price_monthly: 49.99,
    price_annual: 479.90,
    features: ["Advanced Impact Analytics", "Up to 50 Campaigns", "Badge System Access", "Safe Space Access", "Team Collaboration (15 members)", "Custom Branding", "Priority Support"],
    max_campaigns: 50,
    max_team_members: 15,
    white_label_enabled: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_monthly: 299.00,
    price_annual: 2870.00,
    features: ["Premium Analytics & Custom Reports", "Unlimited Campaigns", "Badge System Access", "Safe Space Priority Support", "Unlimited Team Members", "White Label Option", "API Access", "Dedicated Account Manager", "Custom Badge Design"],
    max_campaigns: 999999,
    max_team_members: 999999,
    white_label_enabled: true,
  },
];

const perks = [
  { icon: Landmark, title: "No Card Fees", text: "Pay directly from your bank with Open Banking — no expensive card processing fees" },
  { icon: RefreshCcw, title: "Cancel Anytime", text: "No long-term contracts. Cancel your subscription whenever you need to" },
  { icon: ShieldCheck, title: "Secure & Fast", text: "Bank-to-bank transfers with Strong Customer Authentication for your security" },
];

const getFeatures = (plan: Plan): string[] =>
  Array.isArray(plan.features) ? plan.features : [];

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_monthly');

    if (error) {
      toast({
        title: "Couldn't load live plans",
        description: "Showing standard pricing instead.",
        variant: "destructive"
      });
      setPlans(FALLBACK_PLANS);
      setLoading(false);
      return;
    }

    setPlans(data && data.length > 0 ? data : FALLBACK_PLANS);
    setLoading(false);
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

    navigate(`/checkout?plan=${plan.id}&cycle=${billingCycle}`);
  };

  const getPrice = (plan: Plan) => {
    return billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
  };

  const getCurrentPlanId = () => {
    return subscription?.plan?.id;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-white overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#0ce4af]/20 blur-[120px]" />
          <div className="absolute -top-20 -right-24 h-96 w-96 rounded-full bg-[#18a5fe]/20 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] bg-[length:32px_32px]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-10 transition-colors text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              Pricing
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950">
              Choose{" "}
              <span className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
                your plan
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Flexible pricing for individuals, organisations, and enterprises. Pay with your bank — no card fees.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10 flex justify-center">
        <div className="inline-flex items-center rounded-full bg-white border border-slate-200/80 shadow-lg shadow-slate-200/60 p-1.5 gap-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === 'annual'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Annual
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              billingCycle === 'annual' ? 'bg-[#0ce4af] text-slate-950' : 'bg-[#0ce4af]/15 text-teal-700'
            }`}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-3xl border-slate-200/80">
              <CardHeader>
                <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                <div className="mt-4 h-10 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 w-full bg-muted rounded animate-pulse" />
                ))}
                <div className="h-10 w-full bg-muted rounded-full animate-pulse mt-6" />
              </CardContent>
            </Card>
          ))}
          {!loading && plans.map((plan, index) => {
            const price = getPrice(plan);
            const isCurrentPlan = getCurrentPlanId() === plan.id;
            const isEnterprise = plan.name === 'Enterprise';

            return (
              <motion.div
                key={plan.id}
                className="h-full"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full flex flex-col rounded-3xl transition-all duration-300 hover:-translate-y-1.5 ${
                    isEnterprise
                      ? 'bg-slate-950 text-white border-[#18a5fe]/40 shadow-2xl shadow-[#18a5fe]/20 overflow-hidden'
                      : 'bg-white border-slate-200/80 shadow-sm hover:shadow-2xl hover:shadow-slate-200'
                  }`}
                >
                  {isEnterprise && (
                    <>
                      <div aria-hidden className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#18a5fe]/25 blur-[70px] pointer-events-none" />
                      <div aria-hidden className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#0ce4af]/20 blur-[70px] pointer-events-none" />
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs font-bold px-4 py-1 shadow-lg shadow-[#18a5fe]/40 whitespace-nowrap">
                        Most Popular
                      </span>
                    </>
                  )}
                  <CardHeader className="relative">
                    <CardTitle className={`text-xl ${isEnterprise ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className={`text-4xl font-bold tracking-tight ${isEnterprise ? 'text-white' : 'text-slate-900'}`}>
                        £{price.toFixed(2)}
                      </span>
                      <span className={`text-sm font-medium ${isEnterprise ? 'text-slate-400' : 'text-slate-500'}`}>
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative flex flex-col flex-1 space-y-6">
                    <ul className="space-y-3 flex-1">
                      {getFeatures(plan).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                            isEnterprise ? 'bg-[#0ce4af]/15' : 'bg-[#0ce4af]/10'
                          }`}>
                            <Check className="h-3 w-3 text-[#0ce4af] stroke-[3]" />
                          </span>
                          <span className={`text-sm leading-relaxed ${isEnterprise ? 'text-slate-300' : 'text-slate-600'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrentPlan}
                      className={`w-full rounded-full font-semibold border-none ${
                        isEnterprise
                          ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white shadow-lg shadow-[#18a5fe]/30 hover:opacity-90'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
                    </Button>

                    {plan.name !== 'Free' && (
                      <p className={`text-xs text-center ${isEnterprise ? 'text-slate-500' : 'text-slate-400'}`}>
                        Pay securely via Open Banking
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Why SouLVE Pricing */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Why choose{" "}
            <span className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              SouLVE pricing?
            </span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-10 text-left">
            {perks.map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card className="h-full rounded-3xl border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-7">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-[#0ce4af] to-[#18a5fe] shadow-lg shadow-[#18a5fe]/25 mb-4">
                      <perk.icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">{perk.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{perk.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
