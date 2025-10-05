import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, Clock, FileText, User } from "lucide-react";
import { useStakeholderContributions } from "@/services/esgService";
import { useVerifyContribution } from "@/hooks/esg/useVerifyContribution";
import { formatDistanceToNow } from "date-fns";

interface DataVerificationPanelProps {
  organizationId: string;
}

const DataVerificationPanel = ({ organizationId }: DataVerificationPanelProps) => {
  const { data: contributions, isLoading } = useStakeholderContributions(organizationId);
  const verifyMutation = useVerifyContribution(organizationId);
  
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approved' | 'rejected' | 'needs_revision'>('approved');

  const pendingContributions = contributions?.filter(c => c.verification_status === 'pending') || [];
  const approvedContributions = contributions?.filter(c => c.verification_status === 'approved') || [];
  const rejectedContributions = contributions?.filter(c => c.verification_status === 'rejected') || [];
  const revisionContributions = contributions?.filter(c => c.verification_status === 'needs_revision') || [];

  const handleVerificationAction = (contribution: any, action: 'approved' | 'rejected' | 'needs_revision') => {
    setSelectedContribution(contribution);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const handleSubmitVerification = async () => {
    if (!selectedContribution) return;

    await verifyMutation.mutateAsync({
      contributionId: selectedContribution.id,
      status: actionType,
      notes: verificationNotes,
      revisionNotes: actionType === 'needs_revision' ? revisionNotes : undefined,
    });

    setIsDialogOpen(false);
    setVerificationNotes("");
    setRevisionNotes("");
    setSelectedContribution(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "outline" as const, icon: Clock, label: "Pending Review" },
      approved: { variant: "default" as const, icon: CheckCircle, label: "Approved" },
      rejected: { variant: "destructive" as const, icon: XCircle, label: "Rejected" },
      needs_revision: { variant: "secondary" as const, icon: AlertCircle, label: "Needs Revision" },
    };
    
    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const ContributionCard = ({ contribution }: { contribution: any }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">{contribution.data_request?.indicator?.name || 'Data Contribution'}</h4>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3 w-3" />
            <span>Contributor: {contribution.contributor_org_id || 'Unknown'}</span>
          </div>
        </div>
        {getStatusBadge(contribution.verification_status)}
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <span className="font-medium">Value:</span> {contribution.data_value || 'N/A'}
        </div>
        {contribution.supporting_documents && (
          <div className="text-sm">
            <span className="font-medium">Documents:</span> {contribution.supporting_documents.length} files
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Submitted {formatDistanceToNow(new Date(contribution.submitted_at), { addSuffix: true })}
        </div>
      </div>

      {contribution.verification_status === 'pending' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleVerificationAction(contribution, 'approved')}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleVerificationAction(contribution, 'needs_revision')}
            className="flex-1"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            Request Revision
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleVerificationAction(contribution, 'rejected')}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </Card>
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Data Verification Center</h3>
          <p className="text-sm text-muted-foreground">
            Review and verify stakeholder ESG data contributions
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              Pending ({pendingContributions.length})
            </TabsTrigger>
            <TabsTrigger value="revision">
              Needs Revision ({revisionContributions.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedContributions.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedContributions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingContributions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending contributions</p>
            ) : (
              pendingContributions.map(contribution => (
                <ContributionCard key={contribution.id} contribution={contribution} />
              ))
            )}
          </TabsContent>

          <TabsContent value="revision" className="space-y-4 mt-4">
            {revisionContributions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No contributions needing revision</p>
            ) : (
              revisionContributions.map(contribution => (
                <ContributionCard key={contribution.id} contribution={contribution} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-4">
            {approvedContributions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No approved contributions</p>
            ) : (
              approvedContributions.map(contribution => (
                <ContributionCard key={contribution.id} contribution={contribution} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 mt-4">
            {rejectedContributions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No rejected contributions</p>
            ) : (
              rejectedContributions.map(contribution => (
                <ContributionCard key={contribution.id} contribution={contribution} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approved' && 'Approve Contribution'}
              {actionType === 'rejected' && 'Reject Contribution'}
              {actionType === 'needs_revision' && 'Request Revision'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approved' && 'This will approve the data and include it in your ESG reports.'}
              {actionType === 'rejected' && 'This will reject the contribution. Please provide a reason.'}
              {actionType === 'needs_revision' && 'Request changes from the contributor.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Verification Notes</label>
              <Textarea
                placeholder="Add notes about this verification decision..."
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={3}
              />
            </div>

            {actionType === 'needs_revision' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Revision Requirements</label>
                <Textarea
                  placeholder="Specify what needs to be changed..."
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitVerification}
              variant={actionType === 'rejected' ? 'destructive' : 'default'}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataVerificationPanel;
