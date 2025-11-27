import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, FileText, User } from "lucide-react";

interface DataRequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: any;
  onSubmitData?: () => void;
}

export const DataRequestDetailsModal = ({
  open,
  onOpenChange,
  request,
  onSubmitData,
}: DataRequestDetailsModalProps) => {
  if (!request) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Data Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {request.indicator?.name || 'ESG Data Request'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Framework: {request.framework?.name || 'Not specified'}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={getStatusColor(request.status)}>
                {request.status}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(request.priority)}>
                {request.priority}
              </Badge>
            </div>
          </div>

          {/* Request Message */}
          {request.request_message && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Request Message
              </h4>
              <p className="text-sm text-muted-foreground">{request.request_message}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Reporting Period</span>
              </div>
              <div className="font-medium">
                {format(new Date(request.reporting_period), 'MMMM yyyy')}
              </div>
            </div>

            {request.due_date && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center text-muted-foreground mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Due Date</span>
                </div>
                <div className="font-medium">
                  {format(new Date(request.due_date), 'MMM d, yyyy')}
                </div>
              </div>
            )}

            {request.requester_id && (
              <div className="p-4 border rounded-lg col-span-2">
                <div className="flex items-center text-muted-foreground mb-2">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">Requested By</span>
                </div>
                <div className="font-medium">Corporate Partner</div>
              </div>
            )}
          </div>

          {/* Indicator Details */}
          {request.indicator && (
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium mb-2">Indicator Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code:</span>
                  <span className="font-medium">{request.indicator.code}</span>
                </div>
                {request.indicator.description && (
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <p className="text-muted-foreground mt-1">{request.indicator.description}</p>
                  </div>
                )}
                {request.indicator.unit && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit:</span>
                    <span className="font-medium">{request.indicator.unit}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {request.status === 'pending' && onSubmitData && (
              <Button variant="gradient" onClick={onSubmitData}>
                Submit Data
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
