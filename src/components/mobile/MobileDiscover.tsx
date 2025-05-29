
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DiscoverHeader from "./discover/DiscoverHeader";
import DiscoverTabs from "./discover/DiscoverTabs";

const MobileDiscover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  const handleConnect = (personId: string) => {
    toast({
      title: "Connection request sent!",
      description: "Your request has been sent successfully",
    });
  };

  const handleJoinGroup = (groupId: string) => {
    toast({
      title: "Joined group!",
      description: "You're now a member of this group",
    });
  };

  const handleJoinCampaign = (campaignId: string) => {
    toast({
      title: "Joined campaign!",
      description: "You're now participating in this campaign",
    });
  };

  const handleAcceptConnection = (id: string, message?: string) => {
    toast({
      title: "Connection accepted!",
      description: message ? "Response sent successfully" : "You're now connected",
    });
  };

  const handleDeclineConnection = (id: string) => {
    toast({
      title: "Connection declined",
      description: "The request has been declined",
    });
  };

  const handleSendCustomRequest = (id: string, message: string) => {
    toast({
      title: "Custom request sent!",
      description: "Your personalized connection request has been sent",
    });
  };

  const handleInterestAction = (id: string, type: string) => {
    toast({
      title: `${type === "group" ? "Joined group!" : type === "event" ? "Joined event!" : "Connected!"}`,
      description: "Action completed successfully",
    });
  };

  const handleViewProfile = (userId: string) => {
    toast({
      title: "Profile viewed",
      description: "Opening profile details",
    });
  };

  const handleViewDetails = (type: string) => {
    toast({
      title: `Opening ${type}`,
      description: "Loading detailed analytics",
    });
  };

  const handleStartConversation = (personId: string, message: string) => {
    toast({
      title: "Conversation started!",
      description: "Your AI-suggested message has been sent",
    });
  };

  const handleJoinEvent = (eventId: string) => {
    toast({
      title: "Event joined!",
      description: "You'll receive updates about this networking event",
    });
  };

  const handleSetGoal = (goal: string) => {
    toast({
      title: "Goal set!",
      description: `Your networking goal: ${goal}`,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DiscoverHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <div className="p-4">
        <DiscoverTabs
          activeFilter={activeFilter}
          onConnect={handleConnect}
          onJoinGroup={handleJoinGroup}
          onJoinCampaign={handleJoinCampaign}
          onAcceptConnection={handleAcceptConnection}
          onDeclineConnection={handleDeclineConnection}
          onSendCustomRequest={handleSendCustomRequest}
          onInterestAction={handleInterestAction}
          onViewProfile={handleViewProfile}
          onViewDetails={handleViewDetails}
          onStartConversation={handleStartConversation}
          onJoinEvent={handleJoinEvent}
          onSetGoal={handleSetGoal}
        />
      </div>
    </div>
  );
};

export default MobileDiscover;
