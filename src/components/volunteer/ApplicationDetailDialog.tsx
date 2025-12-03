import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  MessageCircle,
  ExternalLink,
  FileText,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApplicantMiniProfile from "./ApplicantMiniProfile";
import { VolunteerManagementService } from "@/services/volunteerManagementService";
import { sendMessage } from "@/services/messagingService";
import { useAuth } from "@/contexts/AuthContext";

interface ApplicationDetailDialogProps {
  application: {
    id: string;
    user_id: string;
    opportunity_id: string;
    application_message?: string;
    availability?: string;
    relevant_experience?: string;
    status: string;
    applied_at: string;
    profile?: {
      first_name: string;
      last_name: string;
      avatar_url?: string;
      location?: string;
      bio?: string;
      skills?: string[];
    };
    metrics?: {
      trust_score?: number;
      volunteer_hours?: number;
      impact_score?: number;
    };
  } | null;
  opportunityTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: () => void;
}

const ApplicationDetailDialog = ({
  application,
  opportunityTitle,
  open,
  onOpenChange,
  onStatusChange
}: ApplicationDetailDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!application) return null;

  const fullName = application.profile 
    ? `${application.profile.first_name || ''} ${application.profile.last_name || ''}`.trim() || 'Unknown User'
    : 'Unknown User';

  const handleReview = async (status: 'approved' | 'rejected') => {
    setIsProcessing(true);
    try {
      await VolunteerManagementService.reviewApplication(application.id, status);
      
      // Send notification message to applicant
      if (user) {
        const message = status === 'approved'
          ? `🎉 Great news! Your volunteer application for "${opportunityTitle}" has been approved! We're excited to have you on board. Feel free to message us if you have any questions.`
          : `Thank you for your interest in volunteering for "${opportunityTitle}". Unfortunately, we are unable to proceed with your application at this time. We appreciate your interest and encourage you to apply for future opportunities.`;
        
        await sendMessage({
          sender_id: user.id,
          recipient_id: application.user_id,
          content: message,
          message_type: 'text'
        });
      }

      toast({
        title: status === 'approved' ? "Application Approved" : "Application Rejected",
        description: status === 'approved' 
          ? `${fullName} has been approved and notified via message.`
          : `${fullName} has been notified of the decision.`,
      });

      onStatusChange();
      
      // If approved, prompt to message
      if (status === 'approved') {
        toast({
          title: "Message Sent",
          description: "An approval notification has been sent to the applicant.",
          action: (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/dashboard?tab=messaging&userId=${application.user_id}`)}
            >
              Open Chat
            </Button>
          ),
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast({
        title: "Error",
        description: "Failed to process application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMessage = () => {
    navigate(`/dashboard?tab=messaging&userId=${application.user_id}`);
    onOpenChange(false);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${application.user_id}`);
    onOpenChange(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Volunteer Application</span>
            {getStatusBadge(application.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Applicant Mini Profile */}
          <ApplicantMiniProfile
            userId={application.user_id}
            profile={application.profile ? {
              id: application.user_id,
              ...application.profile
            } : undefined}
            metrics={application.metrics}
            showMessageButton={true}
            onMessage={handleMessage}
          />

          <Separator />

          {/* Application Details */}
          <div className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Applied on {new Date(application.applied_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>

            {application.application_message && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Application Message
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {application.application_message}
                </p>
              </div>
            )}

            {application.availability && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Availability
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {application.availability}
                </p>
              </div>
            )}

            {application.relevant_experience && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Relevant Experience
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {application.relevant_experience}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <Button
            variant="outline"
            onClick={handleViewProfile}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Full Profile
          </Button>
          
          <Button
            variant="outline"
            onClick={handleMessage}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>

          {application.status === 'pending' && (
            <>
              <Button
                variant="outline"
                onClick={() => handleReview('rejected')}
                disabled={isProcessing}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleReview('approved')}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailDialog;
