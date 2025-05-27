
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  Heart, 
  Target, 
  Search, 
  MapPin, 
  Clock, 
  Star,
  Filter,
  TrendingUp,
  Globe
} from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useToast } from "@/hooks/use-toast";

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  
  const {
    connectedPeople,
    suggestedConnections,
    campaigns,
    myGroups,
    suggestedGroups,
    handleSendRequest,
    handleJoinCampaign,
    handleJoinGroup,
  } = useConnections();

  const handleHelpAction = (type: string, target: string) => {
    toast({
      title: "Help Action Initiated",
      description: `You're now helping with ${target}. They'll be notified of your support.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h2>
        <p className="text-gray-600">Find comprehensive ways to support people, organizations, and causes in your community</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search Help Opportunities</span>
          </Button>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Globe className="h-3 w-3" />
          <span>Global Impact Mode</span>
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">People</span>
          </TabsTrigger>
          <TabsTrigger value="organizations" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Organizations</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="causes" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Causes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Users className="h-5 w-5" />
                  <span>People Nearby</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">12</div>
                <p className="text-sm text-blue-700">Need help in your area</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Building className="h-5 w-5" />
                  <span>Organizations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">8</div>
                <p className="text-sm text-green-700">Seeking volunteers</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Heart className="h-5 w-5" />
                  <span>Active Campaigns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">15</div>
                <p className="text-sm text-purple-700">You can support</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <Target className="h-5 w-5" />
                  <span>Urgent Causes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">3</div>
                <p className="text-sm text-orange-700">Need immediate help</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedConnections.slice(0, 3).map((person) => (
                <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-medium">{person.name}</h4>
                      <p className="text-sm text-gray-600">{person.location}</p>
                      <p className="text-sm text-gray-500">{person.bio}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleHelpAction("person", person.name)}
                  >
                    Offer Help
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>People in Your Network</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectedPeople.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-medium">{person.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {person.location}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Trust Score: {person.trustScore}</Badge>
                        <Badge variant="outline">{person.helpedPeople} helped</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Message</Button>
                    <Button size="sm" onClick={() => handleHelpAction("person", person.name)}>
                      Offer Help
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Organizations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={group.coverImage} alt={group.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-gray-600">{group.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{group.memberCount} members</Badge>
                        <Badge variant="outline">{group.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Learn More</Button>
                    <Button 
                      size="sm"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      Join & Help
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.filter(c => !c.isParticipating).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={campaign.coverImage} alt={campaign.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-medium">{campaign.title}</h4>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{campaign.participantCount} participants</Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {campaign.endDate}
                        </Badge>
                        {campaign.urgency === "high" && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Details</Button>
                    <Button 
                      size="sm"
                      onClick={() => handleJoinCampaign(campaign.id)}
                    >
                      Join Campaign
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="causes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Causes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Environmental Protection", supporters: 1250, urgent: true },
                  { name: "Education Access", supporters: 890, urgent: false },
                  { name: "Hunger Relief", supporters: 2100, urgent: true },
                  { name: "Mental Health Support", supporters: 760, urgent: false },
                  { name: "Elderly Care", supporters: 540, urgent: false },
                  { name: "Youth Development", supporters: 980, urgent: false },
                ].map((cause, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{cause.name}</h4>
                      {cause.urgent && <Badge variant="destructive">Urgent</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{cause.supporters} supporters worldwide</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Learn More</Button>
                      <Button size="sm" onClick={() => handleHelpAction("cause", cause.name)}>
                        Support Cause
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
