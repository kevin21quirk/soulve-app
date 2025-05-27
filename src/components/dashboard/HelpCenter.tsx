
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Globe,
  Zap,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Award,
  Bookmark,
  Share2,
  ArrowRight,
  Activity,
  Bell,
  Settings,
  Eye,
  MessageCircle,
  ThumbsUp,
  User,
  Plus
} from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useToast } from "@/hooks/use-toast";

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showBookmarked, setShowBookmarked] = useState(false);
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

  const urgentOpportunities = [
    {
      id: 1,
      type: "emergency",
      title: "Flood Relief Support Needed",
      description: "Immediate assistance required for families affected by recent flooding",
      location: "Downtown District",
      timeLeft: "2 hours",
      helpers: 45,
      goal: 100,
      category: "Disaster Relief"
    },
    {
      id: 2,
      type: "medical",
      title: "Blood Donation Drive",
      description: "Critical shortage of O-negative blood at local hospitals",
      location: "City Hospital",
      timeLeft: "6 hours",
      helpers: 23,
      goal: 50,
      category: "Health"
    }
  ];

  const trendingCauses = [
    { name: "Climate Action", growth: "+25%", supporters: 12500 },
    { name: "Education Equity", growth: "+18%", supporters: 8900 },
    { name: "Mental Health", growth: "+32%", supporters: 6700 },
    { name: "Food Security", growth: "+15%", supporters: 9800 }
  ];

  const impactStats = {
    totalHelped: 15420,
    hoursVolunteered: 8750,
    moneyRaised: 245000,
    activeCampaigns: 127
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Make a Difference Today</h1>
            <p className="text-blue-100 mb-4">Discover meaningful ways to support your community and causes you care about</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{impactStats.totalHelped.toLocaleString()} people helped</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{impactStats.hoursVolunteered.toLocaleString()} hours volunteered</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>${impactStats.moneyRaised.toLocaleString()} raised</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Button variant="secondary" size="lg" className="mb-2">
              <Plus className="h-4 w-4 mr-2" />
              Create Help Request
            </Button>
            <p className="text-xs text-blue-100">Start your own cause</p>
          </div>
        </div>
      </div>

      {/* Urgent Alerts */}
      {urgentOpportunities.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>Urgent Help Needed</span>
              <Badge variant="destructive" className="ml-2">LIVE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgentOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-red-900">{opportunity.title}</h4>
                    <Badge variant="outline" className="text-red-700 border-red-300">
                      {opportunity.timeLeft} left
                    </Badge>
                  </div>
                  <p className="text-sm text-red-700 mb-3">{opportunity.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-red-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {opportunity.location}
                    </span>
                    <span className="text-xs text-red-600">
                      {opportunity.helpers}/{opportunity.goal} helpers
                    </span>
                  </div>
                  <Progress value={(opportunity.helpers / opportunity.goal) * 100} className="mb-3" />
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                    Help Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search for causes, people, organizations..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="environment">Environment</option>
                <option value="social">Social Justice</option>
              </select>
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
              >
                <option value="all">All Urgency</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Causes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Trending Causes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingCauses.map((cause, index) => (
              <div key={index} className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="font-medium text-sm">{cause.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary" className="text-xs">{cause.growth}</Badge>
                  <span className="text-xs text-gray-500">{cause.supporters.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI-Powered Recommendations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Recommended for You</span>
                  <Badge variant="secondary">AI Powered</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedConnections.slice(0, 3).map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{person.name}</h4>
                        <p className="text-sm text-gray-600">{person.location}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">95% match</Badge>
                          <Badge variant="secondary" className="text-xs">{person.helpedPeople} helped</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleHelpAction("person", person.name)}>
                        Offer Help
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Make a Donation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Volunteer Today
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share a Cause
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Join an Event
                </Button>
              </CardContent>
            </Card>
          </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Skills-Based Volunteering</CardTitle>
              <p className="text-sm text-gray-600">Use your professional skills to make an impact</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { skill: "Web Development", demand: "High", opportunities: 23, rate: "$75/hr" },
                  { skill: "Graphic Design", demand: "Medium", opportunities: 15, rate: "$45/hr" },
                  { skill: "Marketing", demand: "High", opportunities: 31, rate: "$60/hr" },
                  { skill: "Legal Advice", demand: "Medium", opportunities: 8, rate: "$120/hr" },
                  { skill: "Financial Planning", demand: "Low", opportunities: 5, rate: "$90/hr" },
                  { skill: "Teaching/Tutoring", demand: "High", opportunities: 42, rate: "$35/hr" }
                ].map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{skill.skill}</h4>
                      <Badge 
                        variant={skill.demand === "High" ? "default" : skill.demand === "Medium" ? "secondary" : "outline"}
                      >
                        {skill.demand}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{skill.opportunities} opportunities</p>
                    <p className="text-sm text-green-600 font-medium">Avg: {skill.rate}</p>
                    <Button size="sm" className="w-full mt-3">
                      View Opportunities
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-impact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">127</div>
                <p className="text-sm text-gray-600">People Helped</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">342</div>
                <p className="text-sm text-gray-600">Hours Volunteered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">$2,450</div>
                <p className="text-sm text-gray-600">Donations Made</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">15</div>
                <p className="text-sm text-gray-600">Achievements</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Impact Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Today", action: "Donated to Food Bank Drive", impact: "Helped feed 12 families" },
                  { date: "Yesterday", action: "Volunteered at Community Center", impact: "Taught coding to 8 kids" },
                  { date: "3 days ago", action: "Joined Climate Action Campaign", impact: "Part of 250+ member movement" },
                  { date: "1 week ago", action: "Mentored young entrepreneur", impact: "Helped launch startup" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <div className="w-12 text-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto"></div>
                      <div className="w-px h-8 bg-gray-300 mx-auto mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.action}</h4>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.impact}</p>
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
