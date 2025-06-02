
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { CheckCircle, Clock } from 'lucide-react';

interface HelpCompletionButtonProps {
  postId: string;
  requesterId: string;
  postTitle: string;
}

const HelpCompletionButton = ({ postId, requesterId, postTitle }: HelpCompletionButtonProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [effortLevel, setEffortLevel] = useState<string>('3');
  const [timeSpent, setTimeSpent] = useState<string>('');
  
  const { createCompletionRequest, loading } = useHelpCompletion();

  const handleSubmit = async () => {
    if (!message.trim()) return;

    const completionData = {
      helper_message: message,
      completion_evidence: {
        effort_level: parseInt(effortLevel),
        time_spent: timeSpent,
        completion_notes: message
      }
    };

    await createCompletionRequest(postId, requesterId, completionData);
    setOpen(false);
    setMessage('');
    setEffortLevel('3');
    setTimeSpent('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>Mark as Completed</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Help Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Request: <strong>{postTitle}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Let the person know you've completed helping them. They'll be notified to confirm and rate your help.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Completion Message</Label>
            <Textarea
              id="message"
              placeholder="Describe what you did to help..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effort">Effort Level</Label>
              <Select value={effortLevel} onValueChange={setEffortLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Minimal</SelectItem>
                  <SelectItem value="2">2 - Low</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - High</SelectItem>
                  <SelectItem value="5">5 - Exceptional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time Spent</Label>
              <Select value={timeSpent} onValueChange={setTimeSpent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="1hour">1 hour</SelectItem>
                  <SelectItem value="2hours">2 hours</SelectItem>
                  <SelectItem value="4hours">4+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              disabled={loading || !message.trim()}
              className="flex items-center space-x-2"
            >
              {loading && <Clock className="h-4 w-4 animate-spin" />}
              <span>Submit Completion</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCompletionButton;
