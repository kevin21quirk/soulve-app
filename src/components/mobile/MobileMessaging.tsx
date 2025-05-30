
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MobileConversationList from "./messaging/MobileConversationList";
import MobileMessageThread from "./messaging/MobileMessageThread";
import MobileMessageSearch from "./messaging/MobileMessageSearch";

const MobileMessaging = () => {
  const [currentView, setCurrentView] = useState<"list" | "thread" | "search">("list");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setCurrentView("thread");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setActiveConversationId(null);
  };

  const handleSearch = () => {
    setCurrentView("search");
  };

  const handleSendMessage = (content: string, attachments?: any[]) => {
    toast({
      title: "Message sent",
      description: "Your message has been delivered",
    });
  };

  const handleCall = () => {
    toast({
      title: "Voice call",
      description: "Starting voice call...",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video call",
      description: "Starting video call...",
    });
  };

  // Render based on current view
  if (currentView === "search") {
    return (
      <MobileMessageSearch
        onBack={handleBackToList}
        onSelectConversation={handleSelectConversation}
      />
    );
  }

  if (currentView === "thread" && activeConversationId) {
    return (
      <MobileMessageThread
        conversationId={activeConversationId}
        onBack={handleBackToList}
        onSendMessage={handleSendMessage}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
      />
    );
  }

  // Default list view
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleSearch}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit3 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Quick search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-gray-50 border-none"
            onClick={handleSearch}
            readOnly
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="p-4">
        <MobileConversationList onSelectConversation={handleSelectConversation} />
      </div>
    </div>
  );
};

export default MobileMessaging;
