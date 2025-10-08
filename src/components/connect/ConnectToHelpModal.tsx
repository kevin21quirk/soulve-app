import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Share2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useVolunteerInterest } from '@/hooks/useVolunteerInterest';
import { useState } from 'react';

interface ConnectToHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  postAuthor: {
    name: string;
    avatar: string;
    id?: string;
  };
  category?: string;
}

export const ConnectToHelpModal = ({
  isOpen,
  onClose,
  postId,
  postTitle,
  postAuthor,
  category,
}: ConnectToHelpModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createVolunteerInterest, isSubmitting } = useVolunteerInterest();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonate = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to donate.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Track donation intent
      await supabase.from('support_actions').insert({
        post_id: postId,
        user_id: user.id,
        action_type: 'donate_intent',
        status: 'pending',
        metadata: { post_title: postTitle }
      });

      // Navigate to donation page with post context
      navigate(`/donate?postId=${postId}&title=${encodeURIComponent(postTitle)}`);
      onClose();
    } catch (error) {
      console.error('Error tracking donation:', error);
      toast({
        title: "Error",
        description: "Unable to proceed with donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVolunteer = async () => {
    if (!user || !postAuthor.id) {
      toast({
        title: "Error",
        description: "Unable to submit volunteer interest. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const success = await createVolunteerInterest(postId, postAuthor.id);
    if (success) {
      onClose();
    }
  };

  const handleShare = async () => {
    if (!user) {
      // Allow sharing without login
      if (navigator.share) {
        navigator.share({
          title: postTitle,
          text: `Help needed: ${postTitle}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Share this post with your network.",
        });
      }
      onClose();
      return;
    }

    try {
      // Track share action
      await supabase.from('support_actions').insert({
        post_id: postId,
        user_id: user.id,
        action_type: 'share',
        status: 'completed'
      });

      if (navigator.share) {
        await navigator.share({
          title: postTitle,
          text: `Help needed: ${postTitle}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Share this post with your network.",
        });
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
    onClose();
  };

  const handleMessage = async () => {
    if (!user || !postAuthor.id) {
      toast({
        title: "Error",
        description: "Unable to start conversation. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create or get existing conversation
      const { data: conversationId, error } = await supabase.rpc(
        'get_or_create_conversation',
        {
          user1_id: user.id,
          user2_id: postAuthor.id,
        }
      );

      if (error) throw error;

      // Track support action
      await supabase.from('support_actions').insert({
        post_id: postId,
        user_id: user.id,
        action_type: 'message',
        status: 'completed',
        metadata: { conversation_id: conversationId, post_title: postTitle }
      });

      toast({
        title: "Opening Messages",
        description: `Starting conversation with ${postAuthor.name}`,
      });

      // Navigate to messages tab with userId to open conversation
      navigate(`/dashboard?tab=messaging&userId=${postAuthor.id}`);
      onClose();
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect to Help</DialogTitle>
          <DialogDescription>
            Choose how you'd like to support "{postTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={handleDonate}
            disabled={isProcessing}
          >
            <div className="flex items-start gap-3 text-left">
              <DollarSign className="h-5 w-5 mt-0.5 text-green-600" />
              <div>
                <div className="font-semibold">Donate</div>
                <div className="text-sm text-muted-foreground">
                  Support financially
                </div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={handleVolunteer}
            disabled={isSubmitting || isProcessing}
          >
            <div className="flex items-start gap-3 text-left">
              <Users className="h-5 w-5 mt-0.5 text-blue-600" />
              <div>
                <div className="font-semibold">Volunteer</div>
                <div className="text-sm text-muted-foreground">
                  Offer your time or skills
                </div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={handleShare}
          >
            <div className="flex items-start gap-3 text-left">
              <Share2 className="h-5 w-5 mt-0.5 text-purple-600" />
              <div>
                <div className="font-semibold">Share</div>
                <div className="text-sm text-muted-foreground">
                  Spread the word to your network
                </div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={handleMessage}
            disabled={isProcessing}
          >
            <div className="flex items-start gap-3 text-left">
              <MessageCircle className="h-5 w-5 mt-0.5 text-orange-600" />
              <div>
                <div className="font-semibold">Message</div>
                <div className="text-sm text-muted-foreground">
                  Connect directly with {postAuthor.name}
                </div>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
