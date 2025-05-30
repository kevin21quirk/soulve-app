
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MobileConversationList from "./messaging/MobileConversationList";
import MobileMessageThread from "./messaging/MobileMessageThread";
import MobileMessageSearch from "./messaging/MobileMessageSearch";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical, Edit } from "lucide-react";

const MobileMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleSendMessage = (content: string, attachments?: any[]) => {
    toast({
      title: "Message sent!",
      description: "Your message has been delivered",
    });
  };

  const handleCall = () => {
    toast({
      title: "Calling...",
      description: "Starting voice call",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video calling...",
      description: "Starting video call",
    });
  };

  const handleNewMessage = () => {
    toast({
      title: "New message",
      description: "Start a new conversation",
    });
  };

  if (showSearch) {
    return (
      <MobileMessageSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={() => setShowSearch(false)}
        onSelectConversation={setSelectedConversation}
      />
    );
  }

  if (selectedConversation) {
    return (
      <MobileMessageThread
        conversationId={selectedConversation}
        onBack={handleBackToList}
        onSendMessage={handleSendMessage}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
      />
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleNewMessage}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <MobileConversationList
        onSelectConversation={setSelectedConversation}
      />
    </div>
  );
};

export default MobileMessaging;
