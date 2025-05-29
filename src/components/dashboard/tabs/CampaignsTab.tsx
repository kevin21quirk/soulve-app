
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, BarChart3, Users, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignsTab = () => {
  const navigate = useNavigate();

  // Mock campaign data - in real app this would come from API
  const mockCampaigns = [
    {
      id: "1",
      title: "Community Garden Project",
      raised: 8500,
      goal: 15000,
      supporters: 127,
      daysLeft: 23,
      category: "Community",
      status: "active"
    },
    {
      id: "2", 
      title: "Educational Technology for Schools",
      raised: 12300,
      goal: 20000,
      supporters: 89,
      daysLeft: 45,
      category: "Education",
      status: "active"
    },
    {
      id: "3",
      title: "Local Food Bank Support",
      raised: 5200,
      goal: 8000,
      supporters: 156,
      daysLeft: 12,
      category: "Social Cause",
      status: "active"
    }
  ];

  const totalRaised = mockCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalSupporters = mockCampaigns.reduce((sum, campaign) => sum + campaign.supporters, 0);
  const activeCampaigns = mockCampaigns.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Center</h2>
          <p className="text-gray-600">Create and manage impactful campaigns</p>
        </div>
        <Button 
          onClick={() => navigate('/campaign-builder')}
          variant="gradient"
        >
          <Plus className="h-4 w-4 mr-2" />
          Open Campaign Builder
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-[#0ce4af]" />
              <div>
                <div className="text-sm text-gray-600">Active Campaigns</div>
                <div className="text-2xl font-bold">{activeCampaigns}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Total Raised</div>
                <div className="text-2xl font-bold">${totalRaised.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Total Supporters</div>
                <div className="text-2xl font-bold">{totalSupporters}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Avg. Success Rate</div>
                <div className="text-2xl font-bold">73%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Active Campaigns</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/campaign-analytics/${campaign.id}`)}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>${campaign.raised.toLocaleString()} raised</span>
                      <span>${campaign.goal.toLocaleString()} goal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#0ce4af] h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((campaign.raised / campaign.goal) * 100)}% of goal reached
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{campaign.supporters} supporters</span>
                    <span>{campaign.daysLeft} days left</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Campaign
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Campaign Type Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Start a New Campaign</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-[#0ce4af]/10 to-[#0ce4af]/20 p-6 rounded-lg border border-[#0ce4af]/30">
            <Target className="h-8 w-8 text-[#0ce4af] mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Fundraising Campaigns</h3>
            <p className="text-sm text-gray-700 mb-4">Raise funds for your cause with our powerful fundraising tools</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/campaign-builder')}
              className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10"
            >
              Create Fundraiser
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-[#18a5fe]/10 to-[#18a5fe]/20 p-6 rounded-lg border border-[#18a5fe]/30">
            <Target className="h-8 w-8 text-[#18a5fe] mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Volunteer Campaigns</h3>
            <p className="text-sm text-gray-700 mb-4">Recruit volunteers and organize community action</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/campaign-builder')}
              className="border-[#18a5fe] text-[#18a5fe] hover:bg-[#18a5fe]/10"
            >
              Find Volunteers
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-[#4c3dfb]/10 to-[#4c3dfb]/20 p-6 rounded-lg border border-[#4c3dfb]/30">
            <Target className="h-8 w-8 text-[#4c3dfb] mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Awareness Campaigns</h3>
            <p className="text-sm text-gray-700 mb-4">Spread awareness and educate your community</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/campaign-builder')}
              className="border-[#4c3dfb] text-[#4c3dfb] hover:bg-[#4c3dfb]/10"
            >
              Raise Awareness
            </Button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
            <Target className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-orange-900 mb-2">Social Cause Campaigns</h3>
            <p className="text-sm text-orange-700 mb-4">Drive social change and advocate for important causes</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/campaign-builder')}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Start Movement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsTab;
