
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';
import { CheckCircle, Camera } from 'lucide-react';
import EvidenceSubmissionForm from './EvidenceSubmissionForm';

interface HelpCompletionDialogProps {
  postId: string;
  requesterId: string;
  postTitle: string;
  children?: React.ReactNode;
}

const HelpCompletionDialog = ({ postId, requesterId, postTitle, children }: HelpCompletionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('completion');
  const { createCompletionRequest, loading } = useHelpCompletion();

  const handleSubmit = async () => {
    const completionData = {
      post_id: postId,
      helper_message: message || undefined,
      completion_evidence: evidenceData || {}
    };

    await createCompletionRequest(postId, requesterId, completionData);
    setOpen(false);
    setMessage('');
    setEvidenceData(null);
    setActiveTab('completion');
  };

  const handleEvidenceSubmit = (evidence: any) => {
    setEvidenceData(evidence);
    setActiveTab('completion');
  };

  const canSubmit = message.trim() || evidenceData;

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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Help Completion</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="completion">Completion Details</TabsTrigger>
            <TabsTrigger value="evidence">
              <Camera className="h-4 w-4 mr-2" />
              Evidence
              {evidenceData && <span className="ml-1 text-green-600">✓</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="completion" className="space-y-4">
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
                Completion Details
              </Label>
              <Textarea
                id="completion-message"
                placeholder="Describe what you did to help..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            {evidenceData && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Evidence Attached</span>
                </div>
                <p className="text-xs text-green-700">
                  {evidenceData.type} evidence with {evidenceData.files?.length || 0} files
                </p>
              </div>
            )}

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
                disabled={loading || !canSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Submitting..." : "Submit Completion"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="evidence">
            <EvidenceSubmissionForm
              completionRequestId={postId}
              onSubmit={handleEvidenceSubmit}
              onCancel={() => setActiveTab('completion')}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCompletionDialog;
