
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lightbulb, MessageCircle, Target, Calendar, Gamepad2, Bell } from "lucide-react";

interface ConversationStarter {
  id: string;
  person: string;
  avatar: string;
  suggestion: string;
  context: string;
}

interface NetworkingEvent {
  id: string;
  title: string;
  type: "virtual" | "in-person";
  date: string;
  attendees: number;
  category: string;
}

interface SmartNetworkingFeaturesProps {
  onStartConversation: (personId: string, message: string) => void;
  onJoinEvent: (eventId: string) => void;
  onSetGoal: (goal: string) => void;
}

const SmartNetworkingFeatures = ({ 
  onStartConversation, 
  onJoinEvent, 
  onSetGoal 
}: SmartNetworkingFeaturesProps) => {
  const [activeTab, setActiveTab] = useState<"starters" | "events" | "goals">("starters");
  
  const [conversationStarters] = useState<ConversationStarter[]>([
    {
      id: "1",
      person: "Alex Rivera", 
      avatar: "/placeholder.svg",
      suggestion: "Ask about their recent photography workshop",
      context: "They posted about hosting a beginner's photography class"
    },
    {
      id: "2",
      person: "Maria Santos",
      avatar: "/placeholder.svg",
      suggestion: "Mention your shared interest in sustainable living",
      context: "You both follow environmental groups and sustainability topics"
    }
  ]);

  const [networkingEvents] = useState<NetworkingEvent[]>([
    {
      id: "1",
      title: "Virtual Coffee Chat: Tech for Good",
      type: "virtual",
      date: "Tomorrow 2 PM",
      attendees: 12,
      category: "Technology"
    },
    {
      id: "2", 
      title: "Community Leaders Meetup",
      type: "in-person",
      date: "Friday 6 PM",
      attendees: 25,
      category: "Leadership"
    }
  ]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Lightbulb className="h-5 w-5 text-orange-500" />
          <span>Smart Networking</span>
          <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("starters")}
            className={`flex-1 text-xs py-2 px-3 rounded-md transition-all ${
              activeTab === "starters" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600"
            }`}
          >
            <MessageCircle className="h-3 w-3 mx-auto mb-1" />
            Starters
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 text-xs py-2 px-3 rounded-md transition-all ${
              activeTab === "events" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600"
            }`}
          >
            <Calendar className="h-3 w-3 mx-auto mb-1" />
            Events
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`flex-1 text-xs py-2 px-3 rounded-md transition-all ${
              activeTab === "goals" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600"
            }`}
          >
            <Target className="h-3 w-3 mx-auto mb-1" />
            Goals
          </button>
        </div>

        {/* Conversation Starters */}
        {activeTab === "starters" && (
          <div className="space-y-3">
            {conversationStarters.map((starter) => (
              <div key={starter.id} className="p-3 border rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={starter.avatar} alt={starter.person} />
                    <AvatarFallback>{starter.person.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{starter.person}</p>
                    <p className="text-xs text-gray-600">{starter.context}</p>
                  </div>
                </div>
                <div className="bg-white p-2 rounded border-l-4 border-orange-300 mb-2">
                  <p className="text-sm italic">"{starter.suggestion}"</p>
                </div>
                <Button
                  size="sm"
                  variant="gradient"
                  className="w-full"
                  onClick={() => onStartConversation(starter.id, starter.suggestion)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Start Conversation
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Networking Events */}
        {activeTab === "events" && (
          <div className="space-y-3">
            {networkingEvents.map((event) => (
              <div key={event.id} className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600">{event.date}</p>
                  </div>
                  <Badge variant={event.type === "virtual" ? "secondary" : "outline"} className="text-xs">
                    {event.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>{event.attendees} attending</span>
                    <Badge variant="outline" className="text-xs">{event.category}</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="gradient"
                  className="w-full"
                  onClick={() => onJoinEvent(event.id)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Join Event
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Connection Goals */}
        {activeTab === "goals" && (
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <h4 className="font-medium text-sm mb-2">Set Connection Goals</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => onSetGoal("5 new connections this week")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  5 new connections this week
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => onSetGoal("Join 2 local groups")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Join 2 local groups
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => onSetGoal("Attend 1 networking event")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Attend 1 networking event
                </Button>
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <h4 className="font-medium text-sm mb-2">Connection Challenges</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Weekly Connector</span>
                  <Badge variant="secondary" className="text-xs">3/5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Community Builder</span>
                  <Badge variant="outline" className="text-xs">1/3</Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="gradient"
                className="w-full mt-2"
                onClick={() => onSetGoal("Join challenge")}
              >
                <Gamepad2 className="h-4 w-4 mr-1" />
                Join Challenge
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartNetworkingFeatures;
