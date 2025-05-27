import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building, 
  Heart, 
  Eye,
  Award,
  Activity,
  MapPin,
  Star,
  Bookmark,
  Share2,
  MessageCircle,
  Plus
} from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useToast } from "@/hooks/use-toast";

// Import new components
import HelpCenterHero from "./help-center/HelpCenterHero";
import UrgentAlerts from "./help-center/UrgentAlerts";
import SearchFilters from "./help-center/SearchFilters";
import TrendingCauses from "./help-center/TrendingCauses";
import DiscoverTab from "./help-center/tabs/DiscoverTab";
import SkillsTab from "./help-center/tabs/SkillsTab";
import MyImpactTab from "./help-center/tabs/MyImpactTab";

// Keep existing imports for remaining tabs
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const { toast } = useToast();
  
  const {
    connectedPeople,
    suggestedConnections,
    campaigns,
    suggestedGroups,
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
      {/* Hero Section */}
      <HelpCenterHero />

      {/* Urgent Alerts */}
      <UrgentAlerts />

      {/* Advanced Search & Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedUrgency={selectedUrgency}
        setSelectedUrgency={setSelectedUrgency}
      />

      {/* Trending Causes */}
      <TrendingCauses />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="discover" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Discover</span>
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
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="my-impact" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">My Impact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <DiscoverTab handleHelpAction={handleHelpAction} />
        </TabsContent>

        <TabsContent value="people" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">People Who Need Help</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Nearby
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Highly Rated
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedPeople.concat(suggestedConnections).map((person) => (
              <Card key={person.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{person.name}</h4>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {person.location}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{person.bio}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant="secondary">Trust Score: {person.trustScore}</Badge>
                        <Badge variant="outline">{person.helpedPeople} helped</Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Verified</Badge>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => handleHelpAction("person", person.name)}>
                          <Heart className="h-4 w-4 mr-2" />
                          Offer Help
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg">
                  {group.coverImage && (
                    <img 
                      src={group.coverImage} 
                      alt={group.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {group.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg">{group.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{group.memberCount.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>4.8</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={group.adminAvatar} />
                        <AvatarFallback className="text-xs">
                          {group.adminName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">
                        Led by {group.adminName}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Join & Help
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.filter(c => !c.isParticipating).map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-lg">
                  {campaign.coverImage && (
                    <img 
                      src={campaign.coverImage} 
                      alt={campaign.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {campaign.urgency === "high" && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {campaign.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg">{campaign.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={campaign.organizerAvatar} />
                        <AvatarFallback className="text-xs">
                          {campaign.organizer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">
                        by {campaign.organizer}
                      </span>
                    </div>

                    {campaign.goalAmount && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            ${campaign.currentAmount?.toLocaleString()} / ${campaign.goalAmount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(campaign.currentAmount || 0) / campaign.goalAmount * 100} className="h-2" />
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{campaign.participantCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{campaign.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{campaign.location}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleJoinCampaign(campaign.id)}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillsTab />
        </TabsContent>

        <TabsContent value="my-impact" className="space-y-6">
          <MyImpactTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
