import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCheck, Trash2, Clock, MoreVertical } from 'lucide-react';
import { useNotificationBulkOperations } from '@/hooks/useNotificationBulkOperations';

interface NotificationBulkActionsProps {
  selectedIds: string[];
  onActionComplete: () => void;
  onClearSelection: () => void;
}

const NotificationBulkActions = ({
  selectedIds,
  onActionComplete,
  onClearSelection,
}: NotificationBulkActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteOlderDays, setDeleteOlderDays] = useState<number | null>(null);
  const { markAllAsRead, markSelectedAsRead, deleteSelected, deleteOlderThan } =
    useNotificationBulkOperations();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    onActionComplete();
    onClearSelection();
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedIds.length > 0) {
      await markSelectedAsRead(selectedIds);
      onActionComplete();
      onClearSelection();
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length > 0) {
      await deleteSelected(selectedIds);
      setShowDeleteDialog(false);
      onActionComplete();
      onClearSelection();
    }
  };

  const handleDeleteOlder = async (days: number) => {
    await deleteOlderThan(days);
    setDeleteOlderDays(null);
    setShowDeleteDialog(false);
    onActionComplete();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {selectedIds.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkSelectedAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              Clear
            </Button>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All as Read
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setDeleteOlderDays(7);
              setShowDeleteDialog(true);
            }}>
              <Clock className="h-4 w-4 mr-2" />
              Delete Older than 7 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setDeleteOlderDays(30);
              setShowDeleteDialog(true);
            }}>
              <Clock className="h-4 w-4 mr-2" />
              Delete Older than 30 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setDeleteOlderDays(90);
              setShowDeleteDialog(true);
            }}>
              <Clock className="h-4 w-4 mr-2" />
              Delete Older than 90 Days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deleteOlderDays
                ? `Are you sure you want to delete all notifications older than ${deleteOlderDays} days?`
                : `Are you sure you want to delete ${selectedIds.length} selected notification(s)?`}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteOlderDays(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteOlderDays) {
                  handleDeleteOlder(deleteOlderDays);
                } else {
                  handleDeleteSelected();
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationBulkActions;
