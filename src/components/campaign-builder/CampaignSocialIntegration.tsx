import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  TrendingUp, 
  Users, 
  Eye,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle
} from "lucide-react";
import SocialShareButton from "./SocialShareButton";

interface CampaignSocialIntegrationProps {
  campaign: any;
  socialMetrics?: {
    shares: number;
    reach: number;
    engagement: number;
    clicks: number;
  };
}

const CampaignSocialIntegration = ({ 
  campaign, 
  socialMetrics = { shares: 0, reach: 0, engagement: 0, clicks: 0 }
}: CampaignSocialIntegrationProps) => {
  const shareTargets = [
    { platform: 'Twitter', icon: Twitter, color: 'text-blue-500', suggested: true },
    { platform: 'Facebook', icon: Facebook, color: 'text-blue-600', suggested: true },
    { platform: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', suggested: false },
    { platform: 'WhatsApp', icon: MessageCircle, color: 'text-green-500', suggested: true }
  ];

  return (
    <div className="space-y-6">
      {/* Social Sharing Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            <span>Social Media Integration</span>
          </CardTitle>
          <p className="text-gray-600">
            Amplify your campaign reach through social media sharing and engagement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Ready to Share</h3>
              <p className="text-sm text-gray-600">
                Your campaign is optimized for social media sharing
              </p>
            </div>
            <SocialShareButton 
              campaign={campaign}
              variant="default"
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shareTargets.map((target) => {
              const IconComponent = target.icon;
              return (
                <div key={target.platform} className="text-center p-3 border rounded-lg hover:bg-gray-50">
                  <IconComponent className={`h-6 w-6 mx-auto mb-2 ${target.color}`} />
                  <div className="text-sm font-medium">{target.platform}</div>
                  {target.suggested && (
                    <Badge variant="outline" className="text-xs mt-1">Recommended</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Social Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Social Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Share2 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{socialMetrics.shares}</div>
              <div className="text-sm text-gray-600">Total Shares</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Eye className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{socialMetrics.reach.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Social Reach</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{socialMetrics.engagement}</div>
              <div className="text-sm text-gray-600">Engagements</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{socialMetrics.clicks}</div>
              <div className="text-sm text-gray-600">Click-throughs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Best Times to Share:</strong> Weekday evenings (6-9 PM) and weekend mornings (9-11 AM) typically see higher engagement.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <strong>Use Compelling Visuals:</strong> Posts with images receive 2.3x more engagement than text-only posts.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <strong>Add Personal Stories:</strong> Share why this cause matters to you personally to increase authenticity.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <strong>Engage with Supporters:</strong> Respond to comments and shares to build community around your campaign.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSocialIntegration;
