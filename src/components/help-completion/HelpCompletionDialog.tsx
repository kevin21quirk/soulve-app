
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { CheckCircle } from 'lucide-react';

interface HelpCompletionDialogProps {
  postId: string;
  requesterId: string;
  postTitle: string;
  children?: React.ReactNode;
}

const HelpCompletionDialog = ({ postId, requesterId, postTitle, children }: HelpCompletionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { createCompletionRequest, loading } = useHelpCompletion();

  const handleSubmit = async () => {
    await createCompletionRequest(postId, requesterId, {
      post_id: postId,
      helper_message: message || undefined
    });
    setOpen(false);
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Help Completion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              You're submitting completion for: <strong>{postTitle}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              The person who requested help will review and approve your completion before you receive points.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="completion-message">
              Completion Details (Optional)
            </Label>
            <Textarea
              id="completion-message"
              placeholder="Describe what you did to help..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Submitting..." : "Submit Completion"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCompletionDialog;
