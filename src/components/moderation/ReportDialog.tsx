
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
import { Flag, AlertTriangle } from 'lucide-react';

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedUserName?: string;
}

const ReportDialog = ({
  isOpen,
  onOpenChange,
  reportedUserId,
  reportedPostId,
  reportedUserName,
}: ReportDialogProps) => {
  const [reportType, setReportType] = useState<string>('');
  const [reason, setReason] = useState('');
  const { reportContent, isReporting } = useReportContent();

  const reportTypes = [
    { value: 'spam', label: 'Spam or unwanted content' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'inappropriate_content', label: 'Inappropriate content' },
    { value: 'fake_account', label: 'Fake account or impersonation' },
    { value: 'other', label: 'Other (please specify)' },
  ];

  const handleSubmit = () => {
    if (!reportType || !reason.trim()) return;

    reportContent({
      reportedUserId,
      reportedPostId,
      reportType: reportType as any,
      reason: reason.trim(),
    });

    onOpenChange(false);
    setReportType('');
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">What's the issue?</Label>
            <RadioGroup value={reportType} onValueChange={setReportType}>
              {reportTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="text-sm cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm font-medium mb-2 block">
              Additional details (required)
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide more details about why you're reporting this..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              False reports may result in action against your account. Only report content that violates our community guidelines.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reportType || !reason.trim() || isReporting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isReporting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
