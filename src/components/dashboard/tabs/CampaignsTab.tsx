
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Users, TrendingUp } from "lucide-react";

const CampaignsTab = () => {
  const [campaigns] = useState([
    {
      id: '1',
      title: 'Help Local Food Bank',
      description: 'Supporting families in need during the holiday season',
      goal: 5000,
      current: 3200,
      participants: 24,
      daysLeft: 12,
      category: 'Food & Nutrition',
      status: 'active'
    },
    {
      id: '2', 
      title: 'Community Garden Project',
      description: 'Creating a sustainable garden for the neighborhood',
      goal: 2500,
      current: 1800,
      participants: 15,
      daysLeft: 30,
      category: 'Environment',
      status: 'active'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
                <Badge variant="outline">{campaign.category}</Badge>
              </div>
              <p className="text-gray-600">{campaign.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      ${campaign.current.toLocaleString()} / ${campaign.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full" 
                      style={{ width: `${(campaign.current / campaign.goal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{campaign.participants} participants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button size="sm">
                    Support Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignsTab;
