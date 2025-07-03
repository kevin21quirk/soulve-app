
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useReportContent } from '@/hooks/useReportContent';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Flag, AlertTriangle, CheckCircle } from 'lucide-react';

interface EnhancedReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedUserName?: string;
}

const EnhancedReportDialog = ({
  isOpen,
  onOpenChange,
  reportedUserId,
  reportedPostId,
  reportedUserName,
}: EnhancedReportDialogProps) => {
  const [reportType, setReportType] = useState<string>('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { reportContent } = useReportContent();
  const { isLoading, error, executeAsync } = useLoadingState();

  const reportTypes = [
    { value: 'spam', label: 'Spam or unwanted content', description: 'Repetitive, promotional, or irrelevant content' },
    { value: 'harassment', label: 'Harassment or bullying', description: 'Targeting, intimidation, or abusive behavior' },
    { value: 'inappropriate_content', label: 'Inappropriate content', description: 'Content that violates community guidelines' },
    { value: 'fake_account', label: 'Fake account or impersonation', description: 'Pretending to be someone else' },
    { value: 'other', label: 'Other (please specify)', description: 'Something else that concerns you' },
  ];

  const handleSubmit = async () => {
    if (!reportType || !reason.trim()) return;

    const result = await executeAsync(
      () => new Promise<void>((resolve, reject) => {
        reportContent({
          reportedUserId,
          reportedPostId,
          reportType: reportType as any,
          reason: reason.trim(),
        });
        // Simulate async completion
        setTimeout(resolve, 1000);
      })
    );

    if (result !== null) {
      setSubmitted(true);
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
      }, 2000);
    }
  };

  const resetForm = () => {
    setReportType('');
    setReason('');
    setSubmitted(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300); // Allow dialog animation to complete
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h3>
            <p className="text-gray-600">
              Thank you for helping keep our community safe. We'll review this report promptly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Report {reportedPostId ? 'Post' : 'User'}
          </DialogTitle>
          <DialogDescription>
            {reportedPostId 
              ? "Help us understand what's wrong with this post."
              : `Help us understand what's wrong with ${reportedUserName ? `${reportedUserName}'s` : 'this'} account.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">What's the issue?</Label>
            <RadioGroup value={reportType} onValueChange={setReportType} className="space-y-3">
              {reportTypes.map((type) => (
                <div key={type.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={type.value} className="text-sm font-medium cursor-pointer block mb-1">
                      {type.label}
                    </Label>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm font-medium mb-2 block">
              Additional details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide specific details about why you're reporting this..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              False reports may result in action against your account. Only report content that violates our community guidelines.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reportType || !reason.trim() || isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedReportDialog;
