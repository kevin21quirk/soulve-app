
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Users, 
  TrendingUp, 
  MapPin, 
  Heart, 
  MessageCircle, 
  UserPlus,
  Filter,
  Star,
  Clock,
  Target,
  Navigation,
  Zap,
  Activity,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useToast } from "@/hooks/use-toast";

// Import new components
import LocationBasedDiscovery from "./discover/LocationBasedDiscovery";
import SkillBasedMatching from "./discover/SkillBasedMatching";
import InterestBasedRecommendations from "./discover/InterestBasedRecommendations";
import RealTimeActivityFeed from "./discover/RealTimeActivityFeed";
import EnhancedConnectionRequests from "./discover/EnhancedConnectionRequests";
import ConnectionInsights from "./discover/ConnectionInsights";
import SmartNetworkingFeatures from "./discover/SmartNetworkingFeatures";

const MobileDiscover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  
  const {
    suggestedConnections,
    peopleYouMayKnow,
    myGroups,
    suggestedGroups,
    campaigns,
    handleSendRequest,
    handleJoinGroup,
    handleJoinCampaign
  } = useConnections();

  const { recommendations } = useRecommendations();

  const filters = [
    { id: "all", label: "All", icon: TrendingUp },
    { id: "people", label: "People", icon: Users },
    { id: "groups", label: "Groups", icon: Users },
    { id: "campaigns", label: "Causes", icon: Heart },
    { id: "nearby", label: "Nearby", icon: Navigation },
    { id: "skills", label: "Skills", icon: Zap },
    { id: "trending", label: "Trending", icon: TrendingUp }
  ];

  const handleConnect = (personId: string) => {
    handleSendRequest(personId);
  };

  const handleJoinGroupAction = (groupId: string) => {
    handleJoinGroup(groupId);
  };

  const handleJoinCampaignAction = (campaignId: string) => {
    handleJoinCampaign(campaignId);
  };

  const handleAcceptConnection = (id: string, message?: string) => {
    toast({
      title: "Connection accepted!",
      description: message ? "Response sent successfully" : "You're now connected",
    });
  };

  const handleDeclineConnection = (id: string) => {
    toast({
      title: "Connection declined",
      description: "The request has been declined",
    });
  };

  const handleSendCustomRequest = (id: string, message: string) => {
    toast({
      title: "Custom request sent!",
      description: "Your personalized connection request has been sent",
    });
  };

  const handleInterestAction = (id: string, type: string) => {
    toast({
      title: `${type === "group" ? "Joined group!" : type === "event" ? "Joined event!" : "Connected!"}`,
      description: "Action completed successfully",
    });
  };

  const handleViewProfile = (userId: string) => {
    toast({
      title: "Profile viewed",
      description: "Opening profile details",
    });
  };

  const handleViewDetails = (type: string) => {
    toast({
      title: `Opening ${type}`,
      description: "Loading detailed analytics",
    });
  };

  const handleStartConversation = (personId: string, message: string) => {
    toast({
      title: "Conversation started!",
      description: "Your AI-suggested message has been sent",
    });
  };

  const handleJoinEvent = (eventId: string) => {
    toast({
      title: "Event joined!",
      description: "You'll receive updates about this networking event",
    });
  };

  const handleSetGoal = (goal: string) => {
    toast({
      title: "Goal set!",
      description: `Your networking goal: ${goal}`,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search people, groups, causes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-none rounded-full"
          />
          <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-1 whitespace-nowrap ${
                  activeFilter === filter.id 
                    ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white' 
                    : ''
                }`}
              >
                <IconComponent className="h-3 w-3" />
                <span>{filter.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-4">
            {/* Enhanced Connection Requests */}
            <EnhancedConnectionRequests
              onAccept={handleAcceptConnection}
              onDecline={handleDeclineConnection}
              onSendCustomRequest={handleSendCustomRequest}
            />

            {/* Location-based Discovery */}
            {(activeFilter === "all" || activeFilter === "nearby") && (
              <LocationBasedDiscovery onConnect={handleConnect} />
            )}

            {/* Skill-based Matching */}
            {(activeFilter === "all" || activeFilter === "skills") && (
              <SkillBasedMatching onConnect={handleConnect} />
            )}

            {/* Interest-based Recommendations */}
            <InterestBasedRecommendations onAction={handleInterestAction} />

            {/* AI Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Recommended for You</span>
                  <Badge variant="secondary" className="text-xs">AI</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">{rec.confidence}% match</Badge>
                          <Badge variant="secondary" className="text-xs capitalize">{rec.type.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="gradient" className="ml-2">
                        {rec.actionLabel}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            {(activeFilter === "all" || activeFilter === "trending") && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Trending Now</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {["#CommunityHelp", "#LocalFood", "#SeniorCare", "#TechSupport"].map((tag) => (
                      <Button key={tag} variant="outline" size="sm" className="justify-start text-xs">
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Campaigns */}
            {(activeFilter === "all" || activeFilter === "campaigns") && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Target className="h-5 w-5 text-red-500" />
                    <span>Active Causes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {campaigns.slice(0, 2).map((campaign) => (
                    <div key={campaign.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{campaign.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{campaign.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {campaign.participantCount} joined
                            </Badge>
                            <Badge 
                              variant={campaign.urgency === 'high' ? 'destructive' : 'secondary'} 
                              className="text-xs"
                            >
                              {campaign.urgency} priority
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={campaign.isParticipating ? "outline" : "gradient"}
                          onClick={() => handleJoinCampaignAction(campaign.id)}
                        >
                          {campaign.isParticipating ? "Joined" : "Join"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="connect" className="space-y-4">
            {/* Real-time Activity Feed */}
            <RealTimeActivityFeed onViewProfile={handleViewProfile} />

            {/* People You May Know */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>People You May Know</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {peopleYouMayKnow.slice(0, 3).map((person) => (
                  <div key={person.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{person.name}</h4>
                      <p className="text-xs text-gray-600">{person.reason}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {person.location}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="gradient" 
                        size="sm"
                        onClick={() => handleConnect(person.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Connections */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <UserPlus className="h-5 w-5 text-purple-500" />
                  <span>Suggested Connections</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedConnections.slice(0, 3).map((connection) => (
                  <div key={connection.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{connection.name}</h4>
                      <p className="text-xs text-gray-600">{connection.bio}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {connection.trustScore}% trust
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {connection.helpedPeople} helped
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="gradient" 
                      size="sm"
                      onClick={() => handleConnect(connection.id)}
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Smart Networking Features */}
            <SmartNetworkingFeatures
              onStartConversation={handleStartConversation}
              onJoinEvent={handleJoinEvent}
              onSetGoal={handleSetGoal}
            />

            {/* Suggested Groups */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Users className="h-5 w-5 text-green-500" />
                  <span>Groups to Join</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedGroups.slice(0, 2).map((group) => (
                  <div key={group.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{group.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{group.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {group.memberCount} members
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="gradient"
                        onClick={() => handleJoinGroupAction(group.id)}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {/* Connection Insights */}
            <ConnectionInsights onViewDetails={handleViewDetails} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileDiscover;
