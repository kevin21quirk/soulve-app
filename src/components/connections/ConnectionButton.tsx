
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, UserCheck, Clock, MessageSquare, UserX, Check } from "lucide-react";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

interface ConnectionButtonProps {
  userId: string;
  variant?: "default" | "compact";
  showMessage?: boolean;
  onMessage?: () => void;
}

const ConnectionButton = ({ 
  userId, 
  variant = "default", 
  showMessage = true,
  onMessage 
}: ConnectionButtonProps) => {
  const { connectionStatus, loading, sendConnectionRequest, respondToConnection } = useConnectionStatus(userId);

  const isCompact = variant === "compact";

  if (connectionStatus === 'connected') {
    return (
      <div className={`flex ${isCompact ? 'flex-col space-y-1' : 'space-x-2'}`}>
        {showMessage && (
          <Button 
            onClick={onMessage} 
            size={isCompact ? "sm" : "default"}
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            {isCompact ? "" : "Message"}
          </Button>
        )}
        <Badge variant="outline" className="text-green-600 border-green-600">
          <UserCheck className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      </div>
    );
  }

  if (connectionStatus === 'pending_sent') {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        <Clock className="h-3 w-3 mr-1" />
        Request Sent
      </Badge>
    );
  }

  if (connectionStatus === 'pending_received') {
    return (
      <div className={`flex ${isCompact ? 'flex-col space-y-1' : 'space-x-2'}`}>
        <Button
          onClick={() => respondToConnection('accepted')}
          disabled={loading}
          size={isCompact ? "sm" : "default"}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 mr-1" />
          Accept
        </Button>
        <Button
          onClick={() => respondToConnection('declined')}
          disabled={loading}
          variant="outline"
          size={isCompact ? "sm" : "default"}
        >
          <UserX className="h-4 w-4 mr-1" />
          Decline
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={sendConnectionRequest}
      disabled={loading}
      variant="outline"
      size={isCompact ? "sm" : "default"}
      className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af] hover:text-white"
    >
      <UserPlus className="h-4 w-4 mr-1" />
      {isCompact ? "" : "Connect"}
    </Button>
  );
};

export default ConnectionButton;
