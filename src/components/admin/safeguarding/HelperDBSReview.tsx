import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DBSDocument {
  id: string;
  user_id: string;
  application_id: string;
  document_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_path: string;
  verification_status: string;
  dbs_certificate_number: string | null;
  dbs_issue_date: string | null;
  dbs_expiry_date: string | null;
  dbs_check_level: string | null;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  uploaded_at?: string;
  created_at: string;
}

export const HelperDBSReview = () => {
  const [documents, setDocuments] = useState<DBSDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DBSDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [checkLevel, setCheckLevel] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDBSDocuments();
  }, []);

  const fetchDBSDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('safe_space_verification_documents')
        .select('*')
        .eq('document_type', 'dbs_certificate')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching DBS documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch DBS documents',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateExpiryDate = (issueDate: string): string => {
    const issue = new Date(issueDate);
    issue.setFullYear(issue.getFullYear() + 3);
    return issue.toISOString().split('T')[0];
  };

  const approveDocument = async () => {
    if (!selectedDoc) return;
    
    if (!certificateNumber || !issueDate || !checkLevel) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all DBS certificate details',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const expiryDate = calculateExpiryDate(issueDate);

      const { error } = await supabase
        .from('safe_space_verification_documents')
        .update({
          verification_status: 'verified',
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
          dbs_certificate_number: certificateNumber,
          dbs_issue_date: issueDate,
          dbs_expiry_date: expiryDate,
          dbs_check_level: checkLevel
        })
        .eq('id', selectedDoc.id);

      if (error) throw error;

      // Update helper DBS requirement status
      const { error: helperError } = await supabase
        .from('safe_space_helpers')
        .update({ dbs_required: true })
        .eq('user_id', selectedDoc.user_id);

      if (helperError) console.error('Error updating helper:', helperError);

      // Log to audit
      await supabase.from('safe_space_audit_log').insert({
        user_id: user?.id!,
        action_type: 'dbs_certificate_approved',
        resource_type: 'verification_document',
        resource_id: selectedDoc.id,
        details: {
          certificate_number: certificateNumber,
          check_level: checkLevel,
          expiry_date: expiryDate
        }
      });

      toast({
        title: 'DBS Certificate Approved',
        description: `Certificate expires on ${new Date(expiryDate).toLocaleDateString()}`
      });

      setSelectedDoc(null);
      setCertificateNumber('');
      setIssueDate('');
      setCheckLevel('');
      fetchDBSDocuments();
    } catch (error) {
      console.error('Error approving document:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve DBS certificate',
        variant: 'destructive'
      });
    }
  };

  const rejectDocument = async () => {
    if (!selectedDoc) return;
    
    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('safe_space_verification_documents')
        .update({
          verification_status: 'rejected',
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
          rejection_reason: rejectionReason
        })
        .eq('id', selectedDoc.id);

      if (error) throw error;

      // Log to audit
      await supabase.from('safe_space_audit_log').insert({
        user_id: user?.id!,
        action_type: 'dbs_certificate_rejected',
        resource_type: 'verification_document',
        resource_id: selectedDoc.id,
        details: {
          rejection_reason: rejectionReason
        }
      });

      toast({
        title: 'DBS Certificate Rejected',
        description: 'Helper has been notified'
      });

      setSelectedDoc(null);
      setRejectionReason('');
      fetchDBSDocuments();
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject DBS certificate',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const checkExpiryWarning = (expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
  };

  if (loading) {
    return <div className="p-8">Loading DBS documents...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            DBS Certificate Review
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve UK DBS certificates for Safe Space helpers
          </p>
        </div>
        <Button onClick={fetchDBSDocuments} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {documents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No DBS certificates to review
            </CardContent>
          </Card>
        ) : (
          documents.map(doc => (
            <Card key={doc.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(doc.verification_status)}
                      DBS Certificate Review
                    </CardTitle>
                    <CardDescription>
                      Uploaded: {new Date(doc.created_at).toLocaleDateString()} | 
                      User ID: {doc.user_id.substring(0, 8)}...
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(doc.verification_status)}>
                    {doc.verification_status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {doc.verification_status === 'verified' && (
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Certificate Number:</strong> {doc.dbs_certificate_number}</p>
                    <p className="text-sm"><strong>Check Level:</strong> {doc.dbs_check_level}</p>
                    <p className="text-sm"><strong>Issue Date:</strong> {doc.dbs_issue_date}</p>
                    <p className="text-sm"><strong>Expiry Date:</strong> {doc.dbs_expiry_date}</p>
                    {checkExpiryWarning(doc.dbs_expiry_date) && (
                      <Badge variant="destructive" className="mt-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Expiring within 90 days
                      </Badge>
                    )}
                  </div>
                )}

                {doc.verification_status === 'rejected' && doc.rejection_reason && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm"><strong>Rejection Reason:</strong> {doc.rejection_reason}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </Button>
                  {doc.verification_status === 'pending' && (
                    <>
                      <Button onClick={() => setSelectedDoc(doc)}>
                        Review & Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          setSelectedDoc(doc);
                          setRejectionReason('');
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Approval Modal */}
      {selectedDoc && !rejectionReason && selectedDoc.verification_status === 'pending' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Approve DBS Certificate</CardTitle>
              <CardDescription>
                Enter certificate details to approve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="certNumber">DBS Certificate Number *</Label>
                <Input
                  id="certNumber"
                  placeholder="e.g., 001234567890"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
                {issueDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Expiry: {calculateExpiryDate(issueDate)} (3 years from issue)
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="checkLevel">DBS Check Level *</Label>
                <Select value={checkLevel} onValueChange={setCheckLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select check level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="enhanced">Enhanced (Required for vulnerable adults)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                <p className="font-semibold">⚠️ Verification Checklist:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Certificate number matches document</li>
                  <li>Issue date is within last 3 years</li>
                  <li>Document is clear and legible</li>
                  <li>Name matches helper profile</li>
                  <li>Check level is appropriate for role</li>
                </ul>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setSelectedDoc(null);
                  setCertificateNumber('');
                  setIssueDate('');
                  setCheckLevel('');
                }}>
                  Cancel
                </Button>
                <Button onClick={approveDocument}>
                  Approve Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedDoc && rejectionReason !== null && selectedDoc.verification_status === 'pending' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Reject DBS Certificate</CardTitle>
              <CardDescription>
                Provide a detailed reason for rejection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., Certificate expired, document unclear, name mismatch..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setSelectedDoc(null);
                  setRejectionReason('');
                }}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={rejectDocument}>
                  Reject Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};