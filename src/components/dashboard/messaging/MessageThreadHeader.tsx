
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Users, 
  Pin
} from "lucide-react";
import { Conversation } from "@/types/messaging";

interface MessageThreadHeaderProps {
  selectedConv: Conversation;
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
}

const MessageThreadHeader = ({ 
  selectedConv, 
  showParticipants, 
  setShowParticipants 
}: MessageThreadHeaderProps) => {
  return (
    <CardHeader className="border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={selectedConv.avatar} />
              <AvatarFallback>
                {selectedConv.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {selectedConv.isActive && selectedConv.type === "direct" && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{selectedConv.name}</span>
              {selectedConv.type === "group" && (
                <Badge variant="secondary" className="text-xs">
                  {selectedConv.participants?.length || 0} members
                </Badge>
              )}
              {selectedConv.isPinned && (
                <Pin className="h-4 w-4 text-yellow-500" />
              )}
            </CardTitle>
            <CardDescription>
              {selectedConv.type === "direct" 
                ? (selectedConv.isActive ? 'Active now' : `Last seen ${selectedConv.timestamp}`)
                : selectedConv.description || `${selectedConv.participants?.length || 0} participants`
              }
            </CardDescription>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default MessageThreadHeader;
