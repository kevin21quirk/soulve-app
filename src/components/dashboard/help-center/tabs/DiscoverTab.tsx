
import { Zap, DollarSign, Clock, Share2, Calendar, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConnections } from "@/hooks/useConnections";
import { useToast } from "@/hooks/use-toast";

interface DiscoverTabProps {
  handleHelpAction: (type: string, target: string) => void;
}

const DiscoverTab = ({ handleHelpAction }: DiscoverTabProps) => {
  const { suggestedConnections } = useConnections();
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "donation":
        toast({
          title: "Opening Donation Portal",
          description: "Redirecting you to make a meaningful donation...",
        });
        // Here you would redirect to a donation page or modal
        break;
      case "volunteer":
        toast({
          title: "Finding Volunteer Opportunities",
          description: "Showing available volunteer positions in your area...",
        });
        // Here you would filter for volunteer opportunities
        break;
      case "share":
        toast({
          title: "Share a Cause",
          description: "Opening sharing options to spread awareness...",
        });
        // Here you would open sharing modal or redirect
        break;
      case "events":
        toast({
          title: "Upcoming Events",
          description: "Displaying community events you can join...",
        });
        // Here you would show events calendar or list
        break;
      default:
        break;
    }
  };

  return (
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
                <Button 
                  size="sm" 
                  onClick={() => handleHelpAction("person", person.name)}
                  className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] text-white border-none"
                  style={{ background: 'linear-gradient(to right, #0ce4af, #18a5fe)' }}
                >
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
          <Button 
            className="w-full justify-start bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] text-white border-none" 
            style={{ background: 'linear-gradient(to right, #0ce4af, #18a5fe)' }}
            onClick={() => handleQuickAction("donation")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Make a Donation
          </Button>
          <Button 
            className="w-full justify-start bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] text-white border-none"
            style={{ background: 'linear-gradient(to right, #0ce4af, #18a5fe)' }}
            onClick={() => handleQuickAction("volunteer")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Volunteer Today
          </Button>
          <Button 
            className="w-full justify-start bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] text-white border-none"
            style={{ background: 'linear-gradient(to right, #0ce4af, #18a5fe)' }}
            onClick={() => handleQuickAction("share")}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share a Cause
          </Button>
          <Button 
            className="w-full justify-start bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] text-white border-none"
            style={{ background: 'linear-gradient(to right, #0ce4af, #18a5fe)' }}
            onClick={() => handleQuickAction("events")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Join an Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverTab;
