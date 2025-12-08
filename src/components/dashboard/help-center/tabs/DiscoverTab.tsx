import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  PoundSterling, 
  Share2,
  HandHeart,
  Zap,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { usePostCreation } from "@/contexts/PostCreationContext";
import { 
  useUrgentHelpRequests, 
  useVolunteerOpportunities, 
  getRelativeTime 
} from "@/hooks/useHelpCenterData";
import ContentDiscoveryModal from "../ContentDiscoveryModal";

interface DiscoverTabProps {
  handleHelpAction: (type: string, target: string) => void;
}

const DiscoverTab = ({ handleHelpAction }: DiscoverTabProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { openPostComposer } = usePostCreation();

  // Modal states for discovery
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: urgentRequests, isLoading: loadingUrgent } = useUrgentHelpRequests();
  const { data: volunteerOpportunities, isLoading: loadingVolunteer } = useVolunteerOpportunities();

  const handleVolunteerToday = () => {
    setShowVolunteerModal(true);
  };

  const handleMakeDonation = () => {
    setShowDonationModal(true);
  };

  const handleShareCause = () => {
    openPostComposer({ category: 'announcement' });
  };

  const handleOfferHelp = (requestId: string, title: string) => {
    navigate(`/dashboard?tab=feed&post=${requestId}`);
    toast({
      title: "Connecting you",
      description: `Opening "${title}" to offer help`,
    });
    handleHelpAction('help', title);
  };

  const handleJoinOpportunity = (opportunityId: string, title: string) => {
    navigate(`/dashboard?tab=feed&post=${opportunityId}`);
    toast({
      title: "Volunteer opportunity",
      description: `Opening "${title}" to learn more`,
    });
    handleHelpAction('volunteer', title);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handleVolunteerToday}
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              variant="outline"
            >
              <HandHeart className="h-6 w-6" />
              <span className="font-medium">Volunteer Today</span>
              <span className="text-xs text-center">Find volunteer opportunities near you</span>
            </Button>
            <Button 
              onClick={handleMakeDonation}
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              variant="outline"
            >
              <PoundSterling className="h-6 w-6" />
              <span className="font-medium">Make a Donation</span>
              <span className="text-xs text-center">Support causes you care about</span>
            </Button>
            <Button 
              onClick={handleShareCause}
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              variant="outline"
            >
              <Share2 className="h-6 w-6" />
              <span className="font-medium">Share a Cause</span>
              <span className="text-xs text-center">Spread awareness about important issues</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span>Urgent Requests</span>
            </div>
            <Badge variant="outline" className="text-red-600">
              {urgentRequests?.length || 0} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingUrgent ? (
            [1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))
          ) : urgentRequests && urgentRequests.length > 0 ? (
            urgentRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground flex-1 line-clamp-1">{request.title}</h4>
                  <Badge className={getUrgencyColor(request.urgency)}>
                    {request.urgency}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{request.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {request.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{request.response_count} responses</span>
                    </div>
                    <span>{getRelativeTime(request.created_at)}</span>
                  </div>
                  <Button 
                    onClick={() => handleOfferHelp(request.id, request.title)}
                    size="sm" 
                    className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                  >
                    Offer Help
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No urgent requests right now</p>
              <p className="text-sm">Check back later or browse all help requests</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span>Volunteer Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingVolunteer ? (
            [1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))
          ) : volunteerOpportunities && volunteerOpportunities.length > 0 ? (
            volunteerOpportunities.slice(0, 3).map((opportunity) => (
              <div key={opportunity.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-foreground mb-2 line-clamp-1">{opportunity.title}</h4>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{opportunity.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {opportunity.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{opportunity.location}</span>
                      </div>
                    )}
                    {opportunity.commitment && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{opportunity.commitment}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{opportunity.participant_count} volunteers</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleJoinOpportunity(opportunity.id, opportunity.title)}
                    size="sm" 
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                  >
                    Join Now
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No volunteer opportunities available</p>
              <p className="text-sm">Create one to get community support!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discovery Modals */}
      <ContentDiscoveryModal
        isOpen={showVolunteerModal}
        onClose={() => setShowVolunteerModal(false)}
        title="Find Volunteer Opportunities"
        description="Discover volunteer opportunities that match your skills and interests"
        contentType="posts"
        initialCategory="volunteer"
      />

      <ContentDiscoveryModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        title="Support a Cause"
        description="Find campaigns to donate to and support causes you care about"
        contentType="campaigns"
      />

      <ContentDiscoveryModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share a Cause"
        description="Find causes and campaigns to share with your network"
        contentType="campaigns"
        showShareActions
      />
    </div>
  );
};

export default DiscoverTab;
