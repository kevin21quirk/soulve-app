import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Users, 
  MapPin, 
  TrendingUp,
  Award,
  Sparkles,
  Crown,
  Star
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  organizer: string;
  category: string;
  goal: number;
  raised: number;
  progress: number;
  supporters: number;
  location: string;
  timeLeft: string;
  impact: string;
  sponsorshipTiers: {
    tier: string;
    amount: number;
    benefits: string[];
  }[];
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Community Garden Network',
    description: 'Creating sustainable food sources in urban areas through 10 community gardens, providing fresh produce to 1000+ families.',
    organizer: 'Green Birmingham Initiative',
    category: 'Environment',
    goal: 50000,
    raised: 37500,
    progress: 75,
    supporters: 156,
    location: 'Birmingham, UK',
    timeLeft: '45 days',
    impact: 'Fresh food access for 1000+ families',
    sponsorshipTiers: [
      {
        tier: 'Bronze',
        amount: 5000,
        benefits: ['Logo on garden signage', 'Social media recognition', 'Impact report']
      },
      {
        tier: 'Silver',
        amount: 10000,
        benefits: ['Dedicated garden naming rights', 'Media coverage', 'Quarterly impact reports', 'Employee volunteer opportunities']
      },
      {
        tier: 'Gold',
        amount: 25000,
        benefits: ['Lead sponsor recognition', 'Press release', 'VIP launch event invitation', 'Co-branded marketing materials', 'Annual impact summit invite']
      }
    ]
  },
  {
    id: '2',
    title: 'Youth Tech Skills Programme',
    description: 'Training 200 underprivileged youth in coding, web development, and digital skills to boost employability.',
    organizer: 'TechFuture Foundation',
    category: 'Education',
    goal: 75000,
    raised: 30000,
    progress: 40,
    supporters: 89,
    location: 'Manchester, UK',
    timeLeft: '60 days',
    impact: '200 youth trained, 85% job placement rate',
    sponsorshipTiers: [
      {
        tier: 'Bronze',
        amount: 10000,
        benefits: ['Logo on course materials', 'Recognition at graduation', 'Impact metrics']
      },
      {
        tier: 'Silver',
        amount: 20000,
        benefits: ['Curriculum consultation input', 'Guest speaker opportunities', 'Student internship pipeline', 'Media coverage']
      },
      {
        tier: 'Gold',
        amount: 50000,
        benefits: ['Title sponsor of entire programme', 'Board seat on advisory committee', 'Exclusive hiring access', 'National press coverage', 'Custom partnership package']
      }
    ]
  },
  {
    id: '3',
    title: 'Emergency Housing Support',
    description: 'Providing temporary housing and support services for 50 families facing homelessness this winter.',
    organizer: 'Shelter Network London',
    category: 'Emergency Relief',
    goal: 100000,
    raised: 65000,
    progress: 65,
    supporters: 234,
    location: 'London, UK',
    timeLeft: '30 days',
    impact: '50 families housed, wraparound support services',
    sponsorshipTiers: [
      {
        tier: 'Bronze',
        amount: 15000,
        benefits: ['Recognition on shelter website', 'Success stories newsletter', 'Quarterly updates']
      },
      {
        tier: 'Silver',
        amount: 30000,
        benefits: ['Sponsor a family programme', 'Employee volunteer days', 'Media partnership', 'Impact case studies']
      },
      {
        tier: 'Gold',
        amount: 60000,
        benefits: ['Lead sponsor status', 'Naming rights opportunity', 'Strategic partnership agreement', 'National campaign co-branding', 'Parliamentary reception invite']
      }
    ]
  }
];

const CampaignPartnershipHub = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="h-4 w-4 text-amber-700" />;
      case 'Silver': return <Star className="h-4 w-4 text-gray-400" />;
      case 'Gold': return <Crown className="h-4 w-4 text-yellow-500" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Campaign Partnership Hub</h3>
        <p className="text-muted-foreground">
          Partner with established campaigns and unlock sponsorship opportunities
        </p>
      </div>

      {/* Campaigns */}
      <div className="space-y-6">
        {mockCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-foreground">{campaign.title}</h4>
                    <Badge variant="outline">{campaign.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {campaign.description}
                  </p>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Goal</p>
                    <p className="font-semibold text-foreground">£{campaign.goal.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Raised</p>
                    <p className="font-semibold text-green-600">£{campaign.raised.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Supporters</p>
                    <p className="font-semibold text-foreground">{campaign.supporters}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground text-sm">{campaign.location}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">{campaign.progress}% funded</span>
                  <span className="text-xs text-muted-foreground">{campaign.timeLeft} remaining</span>
                </div>
                <Progress value={campaign.progress} className="h-2" />
              </div>

              {/* Sponsorship Tiers */}
              {selectedCampaign === campaign.id ? (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <h5 className="font-semibold text-foreground mb-3">Sponsorship Opportunities</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {campaign.sponsorshipTiers.map((tier, idx) => (
                      <Card key={idx} className="border-2 hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {getTierIcon(tier.tier)}
                            <h6 className="font-semibold text-foreground">{tier.tier} Sponsor</h6>
                          </div>
                          <p className="text-2xl font-bold text-foreground mb-3">
                            £{tier.amount.toLocaleString()}
                          </p>
                          <ul className="space-y-2 mb-4">
                            {tier.benefits.map((benefit, bidx) => (
                              <li key={bidx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                          <Button className="w-full" variant="outline" size="sm">
                            Select {tier.tier}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedCampaign(null)}
                    className="w-full"
                  >
                    Close Sponsorship Options
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-foreground">{campaign.impact}</p>
                    <p className="text-xs text-muted-foreground">Organized by {campaign.organizer}</p>
                  </div>
                  <Button 
                    onClick={() => setSelectedCampaign(campaign.id)}
                    className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                  >
                    View Sponsorship Options
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignPartnershipHub;
