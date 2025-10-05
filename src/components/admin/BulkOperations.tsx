import { useState } from 'react';
import { CheckSquare, Trash2, Mail, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface BulkOperationsProps {
  selectedItems: string[];
  onClearSelection: () => void;
  onBulkAction: (action: string, itemIds: string[]) => Promise<void>;
}

export const BulkOperations = ({
  selectedItems,
  onClearSelection,
  onBulkAction,
}: BulkOperationsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const { toast } = useToast();

  if (selectedItems.length === 0) return null;

  const handleAction = async (action: string) => {
    setPendingAction(action);
    if (action === 'delete' || action === 'ban') {
      setShowConfirm(true);
    } else {
      await executeAction(action);
    }
  };

  const executeAction = async (action: string) => {
    try {
      await onBulkAction(action, selectedItems);
      toast({
        title: 'Success',
        description: `${action} operation completed for ${selectedItems.length} items`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} items`,
        variant: 'destructive',
      });
    }
    setShowConfirm(false);
    setPendingAction(null);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border rounded-lg shadow-lg p-4 flex items-center gap-4 z-50">
        <div className="flex items-center gap-2">
          <Checkbox checked disabled />
          <span className="text-sm font-medium">
            {selectedItems.length} items selected
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('approve')}
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            Approve
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('email')}
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('ban')}
          >
            <Ban className="h-4 w-4 mr-1" />
            Ban
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleAction('delete')}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will {pendingAction} {selectedItems.length} items.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingAction && executeAction(pendingAction)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
