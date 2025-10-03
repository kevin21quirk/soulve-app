import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';

interface QuickConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  helperName: string;
  helperAvatar?: string;
  postTitle: string;
  onConfirm: () => Promise<void>;
}

const QuickConfirmDialog = ({
  open,
  onOpenChange,
  helperName,
  helperAvatar,
  postTitle,
  onConfirm
}: QuickConfirmDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error confirming help:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Quick Confirm Help
          </DialogTitle>
          <DialogDescription>
            This will instantly approve the help with a 5-star rating
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={helperAvatar} alt={helperName} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-2xl">
              {helperName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-2">
            <p className="font-medium text-lg">{helperName}</p>
            <p className="text-sm text-muted-foreground">
              completed helping with:
            </p>
            <p className="font-semibold">{postTitle}</p>
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl">⭐</span>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Confirming...' : 'Confirm & Award Points'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickConfirmDialog;
