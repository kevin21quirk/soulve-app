
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Users, CheckCircle, X, Send } from "lucide-react";

interface ConnectionRequest {
  id: string;
  name: string;
  avatar: string;
  message: string;
  mutualConnections: number;
  trustScore: number;
  skills: string[];
  canRespond: boolean;
}

interface EnhancedConnectionRequestsProps {
  onAccept: (id: string, message?: string) => void;
  onDecline: (id: string) => void;
  onSendCustomRequest: (id: string, message: string) => void;
}

const EnhancedConnectionRequests = ({ 
  onAccept, 
  onDecline, 
  onSendCustomRequest 
}: EnhancedConnectionRequestsProps) => {
  const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});
  const [showMessageForm, setShowMessageForm] = useState<{ [key: string]: boolean }>({});
  
  const [requests] = useState<ConnectionRequest[]>([
    {
      id: "1",
      name: "David Martinez",
      avatar: "/placeholder.svg",
      message: "Hi! I saw your post about community gardening and would love to connect. I'm also passionate about sustainable living!",
      mutualConnections: 3,
      trustScore: 92,
      skills: ["Gardening", "Sustainability"],
      canRespond: true
    },
    {
      id: "2",
      name: "Lisa Wang",
      avatar: "/placeholder.svg", 
      message: "Hello! I noticed we share similar interests in tech volunteering. Would love to collaborate on future projects.",
      mutualConnections: 1,
      trustScore: 88,
      skills: ["Programming", "Volunteering"],
      canRespond: true
    }
  ]);

  const handleCustomMessage = (id: string, message: string) => {
    onSendCustomRequest(id, message);
    setCustomMessages(prev => ({ ...prev, [id]: "" }));
    setShowMessageForm(prev => ({ ...prev, [id]: false }));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <span>Connection Requests</span>
          <Badge variant="destructive" className="text-xs">
            {requests.length} new
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start space-x-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={request.avatar} alt={request.name} />
                <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{request.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {request.trustScore}% trust
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                  <Users className="h-3 w-3" />
                  <span>{request.mutualConnections} mutual connections</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {request.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg mb-3 border-l-4 border-blue-200">
              <p className="text-sm text-gray-700">{request.message}</p>
            </div>

            {showMessageForm[request.id] ? (
              <div className="space-y-2 mb-3">
                <Textarea
                  placeholder="Write a personal response..."
                  value={customMessages[request.id] || ""}
                  onChange={(e) => setCustomMessages(prev => ({ 
                    ...prev, 
                    [request.id]: e.target.value 
                  }))}
                  className="text-sm"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={() => handleCustomMessage(request.id, customMessages[request.id] || "")}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send & Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowMessageForm(prev => ({ ...prev, [request.id]: false }))}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={() => onAccept(request.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDecline(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowMessageForm(prev => ({ ...prev, [request.id]: true }))}
                  className="w-full text-xs"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Respond with Message
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EnhancedConnectionRequests;
