import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Shield, CheckCircle, XCircle, Eye, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface VerificationWithDocuments {
  id: string;
  user_id: string;
  verification_type: string;
  status: string;
  verification_data: any;
  created_at: string;
  user_email: string;
  user_name: string;
  documents: {
    id: string;
    document_type: string;
    file_path: string;
    file_name: string;
    uploaded_at: string;
  }[];
}

export const IDVerificationReview = () => {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<VerificationWithDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<VerificationWithDocuments | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ url: string; type: string } | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      // Fetch pending ID verifications
      const { data: verificationsData, error: verError } = await supabase
        .from('user_verifications')
        .select(`
          *,
          profiles!inner(email, first_name, last_name)
        `)
        .eq('verification_type', 'government_id')
        .order('created_at', { ascending: false });

      if (verError) throw verError;

      // Fetch associated documents for each verification
      const verificationsWithDocs = await Promise.all(
        (verificationsData || []).map(async (verification) => {
          const { data: docs, error: docError } = await supabase
            .from('verification_documents')
            .select('*')
            .eq('verification_id', verification.id)
            .order('uploaded_at', { ascending: true });

          if (docError) console.error('Error fetching docs:', docError);

          return {
            ...verification,
            user_email: verification.profiles?.email || 'Unknown',
            user_name: `${verification.profiles?.first_name || ''} ${verification.profiles?.last_name || ''}`.trim(),
            documents: docs || []
          };
        })
      );

      setVerifications(verificationsWithDocs);
    } catch (error: any) {
      console.error('Error fetching verifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load verification requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = async (filePath: string, docType: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('id-verifications')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;

      setViewingDocument({ url: data.signedUrl, type: docType });

      // Log document access
      await supabase.from('verification_document_audit').insert({
        document_id: filePath,
        accessed_by: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'view'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load document',
        variant: 'destructive'
      });
    }
  };

  const approveVerification = async (verificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_verifications')
        .update({
          status: 'approved',
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', verificationId);

      if (error) throw error;

      toast({
        title: 'Verification Approved',
        description: 'User has been notified of approval'
      });

      fetchPendingVerifications();
      setSelectedVerification(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to approve verification',
        variant: 'destructive'
      });
    }
  };

  const rejectVerification = async (verificationId: string) => {
    if (!rejectionNotes.trim()) {
      toast({
        title: 'Rejection notes required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_verifications')
        .update({
          status: 'rejected',
          notes: rejectionNotes,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', verificationId);

      if (error) throw error;

      toast({
        title: 'Verification Rejected',
        description: 'User has been notified with feedback'
      });

      fetchPendingVerifications();
      setSelectedVerification(null);
      setRejectionNotes('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to reject verification',
        variant: 'destructive'
      });
    }
  };

  const pendingVerifications = verifications.filter(v => v.status === 'pending');
  const approvedVerifications = verifications.filter(v => v.status === 'approved');
  const rejectedVerifications = verifications.filter(v => v.status === 'rejected');

  const renderVerificationCard = (verification: VerificationWithDocuments) => (
    <Card key={verification.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{verification.user_name}</CardTitle>
            <p className="text-sm text-muted-foreground">{verification.user_email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Submitted: {new Date(verification.created_at).toLocaleString()}
            </p>
          </div>
          <Badge variant={
            verification.status === 'approved' ? 'default' :
            verification.status === 'rejected' ? 'destructive' :
            'secondary'
          }>
            {verification.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Document Type:</span>
              <p>{verification.verification_data?.documentType || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium">Full Name:</span>
              <p>{verification.verification_data?.fullName || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span>
              <p>{verification.verification_data?.dateOfBirth || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium">Documents:</span>
              <p>{verification.documents.length} uploaded</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {verification.documents.map((doc) => (
              <Button
                key={doc.id}
                size="sm"
                variant="outline"
                onClick={() => viewDocument(doc.file_path, doc.document_type)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View {doc.document_type.replace('_', ' ')}
              </Button>
            ))}
          </div>

          {verification.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => approveVerification(verification.id)}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedVerification(verification);
                }}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}

          {verification.status === 'rejected' && verification.notes && (
            <div className="bg-red-50 p-3 rounded-lg mt-3">
              <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
              <p className="text-sm text-red-800">{verification.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ID Verification Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingVerifications.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedVerifications.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedVerifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending verifications
                </div>
              ) : (
                pendingVerifications.map(renderVerificationCard)
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              {approvedVerifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No approved verifications
                </div>
              ) : (
                approvedVerifications.map(renderVerificationCard)
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              {rejectedVerifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No rejected verifications
                </div>
              ) : (
                rejectedVerifications.map(renderVerificationCard)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {viewingDocument?.type.replace('_', ' ')} Document
            </DialogTitle>
          </DialogHeader>
          {viewingDocument && (
            <div className="mt-4">
              <img 
                src={viewingDocument.url} 
                alt="ID Document" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={!!selectedVerification} onOpenChange={() => {
        setSelectedVerification(null);
        setRejectionNotes('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Reject Verification
            </DialogTitle>
            <DialogDescription>
              Please provide a clear reason for rejecting this verification. The user will see this feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="E.g., Document is blurry, expiry date not visible, photo does not match ID, etc."
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedVerification(null);
                  setRejectionNotes('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedVerification && rejectVerification(selectedVerification.id)}
                className="flex-1"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IDVerificationReview;