
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DisputeResolutionDialogProps {
  completionRequestId: string;
  children?: React.ReactNode;
}

const DisputeResolutionDialog = ({ completionRequestId, children }: DisputeResolutionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitDispute = async () => {
    if (!disputeReason || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a reason and provide a description.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would call your dispute creation service
      // await createDispute(completionRequestId, { reason: disputeReason, description, evidence });
      
      toast({
        title: "Dispute Submitted",
        description: "Your dispute has been submitted for admin review. You'll be notified of the outcome."
      });
      
      setOpen(false);
      setDisputeReason('');
      setDescription('');
      setEvidence('');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit dispute. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
            <AlertTriangle className="h-4 w-4 mr-2" />
            File Dispute
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            File Dispute
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>Important:</strong> Disputes will be reviewed by our moderation team. 
              Please provide clear evidence and explanation for your dispute.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dispute-reason">Reason for Dispute *</Label>
            <Select value={disputeReason} onValueChange={setDisputeReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select dispute reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work_not_completed">Work Not Completed</SelectItem>
                <SelectItem value="poor_quality">Poor Quality Work</SelectItem>
                <SelectItem value="not_as_agreed">Not As Agreed</SelectItem>
                <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                <SelectItem value="safety_concerns">Safety Concerns</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Please explain the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence">Supporting Evidence (Optional)</Label>
            <Textarea
              id="evidence"
              placeholder="Links to photos, messages, or other evidence..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={2}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">What happens next?</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Your dispute will be reviewed within 48 hours</p>
              <p>• Both parties will be contacted for additional information if needed</p>
              <p>• A final decision will be made and communicated to all parties</p>
              <p>• Points may be awarded, withheld, or redistributed based on findings</p>
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
              onClick={handleSubmitDispute}
              disabled={loading || !disputeReason || !description.trim()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeResolutionDialog;
