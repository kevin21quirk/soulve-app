import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useESGDataRequests } from "@/services/esgService";
import { format } from "date-fns";
import { Clock, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { DataRequestDetailsModal } from "./modals/DataRequestDetailsModal";
import { SubmitDataDialog } from "./modals/SubmitDataDialog";

interface StakeholderDataRequestsPanelProps {
  organizationId: string;
}

const StakeholderDataRequestsPanel = ({ organizationId }: StakeholderDataRequestsPanelProps) => {
  const { data: dataRequests, isLoading } = useESGDataRequests(organizationId);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'submitted': return FileText;
      case 'in_progress': return Clock;
      default: return AlertCircle;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Data Requests</h3>
          <p className="text-sm text-muted-foreground">
            ESG data requested from corporate partners
          </p>
        </div>
        <Badge variant="secondary">
          {dataRequests?.length || 0} total requests
        </Badge>
      </div>

      {dataRequests && dataRequests.length > 0 ? (
        <div className="space-y-3">
          {dataRequests.map((request: any) => {
            const StatusIcon = getStatusIcon(request.status);
            return (
              <Card key={request.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">
                        {request.indicator?.name || 'ESG Data Request'}
                      </h4>
                    </div>
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

                {request.request_message && (
                  <p className="text-sm text-muted-foreground mb-3 p-2 bg-muted rounded">
                    {request.request_message}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reporting Period:</span>
                    <div className="font-medium">
                      {format(new Date(request.reporting_period), 'MMM yyyy')}
                    </div>
                  </div>
                  {request.due_date && (
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <div className="font-medium">
                        {format(new Date(request.due_date), 'MMM d, yyyy')}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsDetailsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  {request.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsSubmitDialogOpen(true);
                      }}
                    >
                      Submit Data
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Data Requests Yet</h3>
          <p className="text-muted-foreground">
            You haven't received any ESG data requests from corporate partners.
          </p>
        </Card>
      )}

      <DataRequestDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        request={selectedRequest}
        onSubmitData={() => {
          setIsDetailsModalOpen(false);
          setIsSubmitDialogOpen(true);
        }}
      />

      <SubmitDataDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        requestId={selectedRequest?.id || ''}
        indicatorName={selectedRequest?.indicator?.name || ''}
        indicatorUnit={selectedRequest?.indicator?.unit}
      />
    </div>
  );
};

export default StakeholderDataRequestsPanel;