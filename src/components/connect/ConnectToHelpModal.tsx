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

interface ConnectToHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  postAuthor: {
    name: string;
    avatar: string;
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

  const handleDonate = () => {
    toast({
      title: "Donation Feature",
      description: "Donation functionality will be available soon.",
    });
    onClose();
  };

  const handleVolunteer = () => {
    toast({
      title: "Volunteer Interest",
      description: "You've expressed interest in volunteering. The requester will be notified.",
    });
    onClose();
  };

  const handleShare = () => {
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
  };

  const handleMessage = () => {
    toast({
      title: "Message Sent",
      description: `Your message to ${postAuthor.name} has been initiated.`,
    });
    onClose();
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
