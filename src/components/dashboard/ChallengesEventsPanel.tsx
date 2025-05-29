
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Calendar, Plus, Search, Filter, TrendingUp, Users, Star } from "lucide-react";
import CommunityChallenge from "./challenges/CommunityChallenge";
import CommunityEvent from "./events/CommunityEvent";
import { useChallengesEvents } from "@/hooks/useChallengesEvents";

const ChallengesEventsPanel = () => {
  const {
    challenges,
    events,
    userChallenges,
    userEvents,
    joinChallenge,
    registerForEvent,
    loading
  } = useChallengesEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.type === categoryFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallenge(challengeId);
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const handleRegisterEvent = async (eventId: string) => {
    try {
      await registerForEvent(eventId);
    } catch (error) {
      console.error('Failed to register for event:', error);
    }
  };

  const handleViewChallengeDetails = (challengeId: string) => {
    // TODO: Open challenge details modal
    console.log('View challenge details:', challengeId);
  };

  const handleViewEventDetails = (eventId: string) => {
    // TODO: Open event details modal
    console.log('View event details:', eventId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>Challenges & Events</span>
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Join community challenges and events to make an impact
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userChallenges.length}</p>
                <p className="text-sm text-gray-600">Active Challenges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userEvents.length}</p>
                <p className="text-sm text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,250</p>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search challenges and events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Challenges ({filteredChallenges.length})</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Events ({filteredEvents.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          {filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <CommunityChallenge
                  key={challenge.id}
                  challenge={challenge}
                  onJoin={handleJoinChallenge}
                  onViewDetails={handleViewChallengeDetails}
                  userParticipating={userChallenges.some(uc => uc.challengeId === challenge.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold mb-2">No challenges found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or create a new challenge to get started.
                </p>
                <Button>Create Challenge</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <CommunityEvent
                  key={event.id}
                  event={event}
                  onRegister={handleRegisterEvent}
                  onViewDetails={handleViewEventDetails}
                  userRegistered={userEvents.some(ue => ue.eventId === event.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or create a new event to get started.
                </p>
                <Button>Create Event</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengesEventsPanel;
