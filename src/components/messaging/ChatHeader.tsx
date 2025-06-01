
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { CardHeader } from "@/components/ui/card";

interface ActivePartner {
  user_id: string;
  user_name: string;
  avatar_url?: string;
}

interface ChatHeaderProps {
  activePartner?: ActivePartner;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ activePartner, onBack, showBackButton = false }: ChatHeaderProps) => {
  if (!activePartner) return null;

  return (
    <CardHeader className="pb-3 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={activePartner.avatar_url || ''} />
            <AvatarFallback>
              {activePartner.user_name?.split(' ').map(n => n[0]).join('') || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{activePartner.user_name}</h3>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
