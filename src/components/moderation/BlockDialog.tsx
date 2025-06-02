
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
import { Label } from '@/components/ui/label';
import { useBlockUser } from '@/hooks/useBlockUser';
import { Shield, AlertTriangle } from 'lucide-react';

interface BlockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName?: string;
}

const BlockDialog = ({ isOpen, onOpenChange, userId, userName }: BlockDialogProps) => {
  const [reason, setReason] = useState('');
  const { blockUser, isBlocking } = useBlockUser();

  const handleBlock = () => {
    blockUser({ 
      blockedId: userId, 
      reason: reason.trim() || undefined 
    });
    onOpenChange(false);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Block {userName || 'User'}
          </DialogTitle>
          <DialogDescription>
            {userName 
              ? `${userName} will no longer be able to see your profile, posts, or contact you.`
              : "This user will no longer be able to see your profile, posts, or contact you."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="block-reason" className="text-sm font-medium mb-2 block">
              Reason (optional)
            </Label>
            <Textarea
              id="block-reason"
              placeholder="Why are you blocking this user? (This is private)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-700">
              <p className="font-medium mb-1">What happens when you block someone:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>They can't see your posts or profile</li>
                <li>They can't message or tag you</li>
                <li>You won't see their content</li>
                <li>You can unblock them anytime in settings</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBlock}
              disabled={isBlocking}
              className="bg-red-600 hover:bg-red-700"
            >
              {isBlocking ? 'Blocking...' : 'Block User'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockDialog;
