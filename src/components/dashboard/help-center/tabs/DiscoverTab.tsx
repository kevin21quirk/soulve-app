
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  DollarSign, 
  Share2,
  HandHeart,
  Zap,
  Calendar,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiscoverTabProps {
  handleHelpAction: (type: string, target: string) => void;
}

const DiscoverTab = ({ handleHelpAction }: DiscoverTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Enhanced quick action handlers
  const handleQuickAction = (actionType: string, title: string) => {
    toast({
      title: `${actionType} Action`,
      description: `Opening ${actionType.toLowerCase()} for: ${title}`,
    });
    handleHelpAction(actionType.toLowerCase(), title);
  };

  // Mock data for demonstration
  const urgentRequests = [
    {
      id: 1,
      title: "Emergency Food Delivery for Elderly Neighbor",
      description: "My 80-year-old neighbor needs groceries delivered today. She's unable to leave her apartment.",
      location: "Downtown District",
      urgency: "urgent",
      timeAgo: "2 hours ago",
      responses: 3,
      category: "emergency"
    },
    {
      id: 2,
      title: "Pet Sitting Needed - Owner in Hospital",
      description: "Need someone to care for my dog while I'm hospitalized unexpectedly.",
      location: "West Side",
      urgency: "high",
      timeAgo: "4 hours ago",
      responses: 7,
      category: "pet-care"
    }
  ];

  const featuredOpportunities = [
    {
      id: 1,
      title: "Community Garden Volunteers Needed",
      description: "Help maintain our community garden every Saturday morning.",
      location: "Central Park Area",
      commitment: "2-3 hours/week",
      participants: 12,
      category: "environment"
    },
    {
      id: 2,
      title: "Tutoring Program for Kids",
      description: "Share your knowledge by tutoring children in math and reading.",
      location: "East Side Community Center",
      commitment: "1 hour/week",
      participants: 8,
      category: "education"
    }
  ];

  const trendingCauses = [
    {
      id: 1,
      title: "Local Food Bank Drive",
      description: "Collecting donations for families in need this winter.",
      raised: 2400,
      goal: 5000,
      supporters: 48,
      category: "fundraising"
    },
    {
      id: 2,
      title: "Senior Technology Help",
      description: "Teaching elderly community members how to use smartphones and computers.",
      raised: 0,
      goal: 0,
      supporters: 23,
      category: "education"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleQuickAction('Volunteer', 'Community Opportunities')}
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              variant="outline"
            >
              <HandHeart className="h-6 w-6" />
              <span className="font-medium">Volunteer Today</span>
              <span className="text-xs text-center">Find volunteer opportunities near you</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction('Donate', 'Local Causes')}
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              variant="outline"
            >
              <DollarSign className="h-6 w-6" />
              <span className="font-medium">Make a Donation</span>
              <span className="text-xs text-center">Support causes you care about</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction('Share', 'Community Stories')}
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              variant="outline"
            >
              <Share2 className="h-6 w-6" />
              <span className="font-medium">Share a Cause</span>
              <span className="text-xs text-center">Spread awareness about important issues</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search for help requests, volunteer opportunities, or causes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Urgent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span>Urgent Requests</span>
            </div>
            <Badge variant="outline" className="text-red-600">
              {urgentRequests.length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {urgentRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 flex-1">{request.title}</h4>
                <Badge className={getUrgencyColor(request.urgency)}>
                  {request.urgency}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">{request.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{request.responses} responses</span>
                  </div>
                  <span>{request.timeAgo}</span>
                </div>
                <Button 
                  onClick={() => handleQuickAction('Help', request.title)}
                  size="sm" 
                  className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                >
                  Offer Help
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Featured Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span>Featured Volunteer Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {featuredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2">{opportunity.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{opportunity.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{opportunity.commitment}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{opportunity.participants} volunteers</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleQuickAction('Volunteer', opportunity.title)}
                  size="sm" 
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                >
                  Join Now
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trending Causes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Trending Causes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingCauses.map((cause) => (
            <div key={cause.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2">{cause.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{cause.description}</p>
              
              {cause.goal > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">${cause.raised} / ${cause.goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-2 rounded-full" 
                      style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{cause.supporters} supporters</span>
                  </div>
                  <Badge variant="outline">{cause.category}</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleQuickAction('Share', cause.title)}
                    size="sm" 
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button 
                    onClick={() => handleQuickAction('Support', cause.title)}
                    size="sm" 
                    className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                  >
                    Support
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverTab;
