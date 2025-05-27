
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Crown, MoreVertical } from "lucide-react";
import { Conversation } from "@/types/messaging";

interface ConversationParticipantsProps {
  conversation: Conversation;
  onClose: () => void;
}

const ConversationParticipants = ({ conversation, onClose }: ConversationParticipantsProps) => {
  if (conversation.type === "direct") {
    const participant = conversation.participants?.[0];
    if (!participant) return null;

    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Profile</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              <AvatarImage src={participant.avatar} />
              <AvatarFallback className="text-lg">
                {participant.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{participant.name}</h3>
            <Badge variant={participant.isActive ? "default" : "secondary"} className="mt-2">
              {participant.isActive ? "Active now" : `Last seen ${participant.lastSeen}`}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
            <Button variant="outline" className="w-full">
              Call
            </Button>
            <Button variant="outline" className="w-full">
              Video Call
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Group Info</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Avatar className="h-16 w-16 mx-auto mb-3">
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback className="text-lg">
              {conversation.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{conversation.name}</h3>
          {conversation.description && (
            <p className="text-sm text-gray-600 mt-1">{conversation.description}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Participants ({conversation.participants?.length || 0})</span>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {conversation.participants?.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium truncate">{participant.name}</p>
                    {participant.role === "admin" && (
                      <Crown className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {participant.isActive ? "Active" : `Last seen ${participant.lastSeen}`}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationParticipants;
