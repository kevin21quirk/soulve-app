
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Send } from 'lucide-react';
import { ContentModerationService } from '@/services/contentModerationService';
import { useToast } from '@/hooks/use-toast';

interface AppealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  contentTitle?: string;
}

const AppealDialog = ({
  isOpen,
  onOpenChange,
  reportId,
  contentTitle
}: AppealDialogProps) => {
  const [appealReason, setAppealReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!appealReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your appeal",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await ContentModerationService.createAppeal(reportId, appealReason.trim());
      
      toast({
        title: "Appeal Submitted",
        description: "Your appeal has been submitted and will be reviewed by our moderation team."
      });
      
      onOpenChange(false);
      setAppealReason('');
    } catch (error: any) {
      console.error('Error submitting appeal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit appeal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Appeal Content Decision
          </DialogTitle>
          <DialogDescription>
            {contentTitle 
              ? `Submit an appeal for the moderation decision on "${contentTitle}"`
              : "Submit an appeal for the moderation decision on your content"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Why do you believe this decision was incorrect?
            </label>
            <Textarea
              placeholder="Please explain why you think your content was incorrectly flagged or removed. Be specific about how your content follows our community guidelines."
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {appealReason.length}/1000 characters
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Appeal Guidelines:</strong> Appeals are reviewed by human moderators. 
              Please be respectful and provide specific reasons why you believe the decision was incorrect. 
              Frivolous appeals may result in restrictions on future appeal submissions.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!appealReason.trim() || isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Appeal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppealDialog;
