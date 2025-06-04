
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  activePartner?: {
    user_id: string;
    user_name: string;
    avatar_url?: string;
  };
  onBack?: () => void;
  showBackButton?: boolean;
  isTyping?: boolean;
}

const ChatHeader = ({ activePartner, onBack, showBackButton = false, isTyping = false }: ChatHeaderProps) => {
  if (!activePartner) return null;

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={activePartner.avatar_url} alt={activePartner.user_name} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              {activePartner.user_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-semibold text-gray-900">{activePartner.user_name}</h3>
            {isTyping ? (
              <p className="text-sm text-green-600">typing...</p>
            ) : (
              <p className="text-sm text-gray-500">Click to start chatting</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
