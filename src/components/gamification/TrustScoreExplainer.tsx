import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Shield, 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronRight,
  Award,
  Users,
  Clock,
  BadgeCheck
} from "lucide-react";
import { useEnhancedPoints } from "@/hooks/useEnhancedPoints";

interface TrustComponent {
  name: string;
  description: string;
  weight: string;
  currentValue: number;
  maxValue: number;
  icon: React.ReactNode;
  howToImprove: string[];
  color: string;
}

const TrustScoreExplainer = () => {
  const { metrics, getTrustScoreBreakdown, getTrustTier } = useEnhancedPoints();
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  
  const breakdown = getTrustScoreBreakdown();
  const trustTier = getTrustTier();
  const trustScore = metrics?.trust_score ?? 0;

  const trustComponents: TrustComponent[] = [
    {
      name: "Impact Points",
      description: "Your lifetime contribution score based on helping, donating, and volunteering",
      weight: "60%",
      currentValue: breakdown?.components.lifetime_points || 0,
      maxValue: 60,
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      howToImprove: [
        "Help more people in your community",
        "Make donations to campaigns",
        "Volunteer your time and skills",
        "Complete your verified actions"
      ],
      color: "bg-yellow-500"
    },
    {
      name: "Community Ratings",
      description: "Feedback from people you've helped or interacted with",
      weight: "30%",
      currentValue: breakdown?.components.average_rating || 0,
      maxValue: 30,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      howToImprove: [
        "Provide quality help consistently",
        "Follow through on commitments",
        "Communicate clearly with community members",
        "Be responsive and reliable"
      ],
      color: "bg-blue-500"
    },
    {
      name: "Account Health",
      description: "Penalty from any red flags or policy violations",
      weight: "-10%",
      currentValue: breakdown?.components.red_flags_penalty || 0,
      maxValue: 10,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      howToImprove: [
        "Follow community guidelines",
        "Complete pending verifications",
        "Resolve any outstanding issues",
        "Maintain honest and accurate profiles"
      ],
      color: "bg-red-500"
    }
  ];

  const trustTiers = [
    { name: "New User", minScore: 0, maxScore: 29, color: "bg-gray-400", benefits: ["Basic platform access", "Can request help"] },
    { name: "Verified Helper", minScore: 30, maxScore: 59, color: "bg-blue-400", benefits: ["Verified badge", "Priority support", "Featured in local searches"] },
    { name: "Trusted Helper", minScore: 60, maxScore: 79, color: "bg-green-400", benefits: ["Trusted badge", "Advanced features", "Create campaigns", "Mentor new users"] },
    { name: "Community Leader", minScore: 80, maxScore: 94, color: "bg-purple-400", benefits: ["Leader badge", "Community moderator", "Exclusive events", "Featured profile"] },
    { name: "Impact Champion", minScore: 95, maxScore: 100, color: "bg-yellow-400", benefits: ["Champion badge", "Ambassador program", "Platform input", "Maximum visibility"] }
  ];

  const currentTierIndex = trustTiers.findIndex(t => trustScore >= t.minScore && trustScore <= t.maxScore);
  const nextTier = trustTiers[currentTierIndex + 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Understanding Your Trust Score
        </CardTitle>
        <CardDescription>
          Your trust score reflects your reliability and contribution to the community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Score Overview */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-primary">{trustScore}%</div>
              <Badge className={`${trustTier.bgColor} ${trustTier.color} mt-2`}>
                {trustTier.name}
              </Badge>
            </div>
            <div className="text-right">
              {nextTier && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{nextTier.minScore - trustScore} points</span>
                  <br />to reach {nextTier.name}
                </div>
              )}
            </div>
          </div>
          <Progress value={trustScore} className="h-3" />
        </div>

        {/* Why Trust Matters */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            Why Trust Score Matters
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Higher visibility in community searches
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Access to premium features and tools
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Build credibility with other members
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Qualify for community leadership roles
            </li>
          </ul>
        </div>

        {/* Score Components Breakdown */}
        <div>
          <h4 className="font-semibold mb-3">Score Breakdown</h4>
          <div className="space-y-3">
            {trustComponents.map((component) => (
              <TooltipProvider key={component.name}>
                <div 
                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedComponent(
                    expandedComponent === component.name ? null : component.name
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {component.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{component.name}</span>
                          <Badge variant="outline" className="text-xs">{component.weight}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{component.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {component.currentValue}/{component.maxValue}
                      </span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        expandedComponent === component.name ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {expandedComponent === component.name && (
                    <div className="mt-4 pt-4 border-t">
                      <Progress 
                        value={(component.currentValue / component.maxValue) * 100} 
                        className="h-2 mb-3" 
                      />
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        How to Improve
                      </h5>
                      <ul className="space-y-1">
                        {component.howToImprove.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary mt-2" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Trust Tier Progression */}
        <div>
          <h4 className="font-semibold mb-3">Trust Level Progression</h4>
          <div className="space-y-2">
            {trustTiers.map((tier, index) => {
              const isCurrentTier = trustScore >= tier.minScore && trustScore <= tier.maxScore;
              const isAchieved = trustScore >= tier.minScore;
              
              return (
                <div 
                  key={tier.name}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isCurrentTier 
                      ? 'bg-primary/10 border-primary' 
                      : isAchieved 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
                        : 'bg-muted/30'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isCurrentTier ? 'text-primary' : ''}`}>
                        {tier.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {tier.minScore}-{tier.maxScore}%
                      </span>
                    </div>
                    {isCurrentTier && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {tier.benefits.slice(0, 2).join(" • ")}
                      </p>
                    )}
                  </div>
                  {isAchieved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustScoreExplainer;
