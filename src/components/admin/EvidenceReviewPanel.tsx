import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';

interface EvidenceSubmission {
  id: string;
  user_id: string;
  activity_id: string;
  evidence_type: string;
  file_url?: string;
  metadata: Record<string, any>;
  verification_status: string;
  created_at: string;
  activity?: {
    description: string;
    points_earned: number;
    activity_type: string;
  };
  profile?: {
    first_name: string;
    last_name: string;
  };
}

const EvidenceReviewPanel = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<EvidenceSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('evidence_submissions')
        .select(`
          *,
          activity:impact_activities(description, points_earned, activity_type),
          profile:profiles(first_name, last_name)
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: EvidenceSubmission[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        activity_id: item.activity_id,
        evidence_type: item.evidence_type,
        file_url: item.file_url,
        metadata: item.metadata || {},
        verification_status: item.verification_status,
        created_at: item.created_at,
        activity: item.activity || undefined,
        profile: item.profile || undefined
      }));
      
      setSubmissions(transformedData);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load evidence submissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const reviewEvidence = async (submissionId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('evidence_submissions')
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
          rejection_reason: status === 'rejected' ? reviewNotes : null
        })
        .eq('id', submissionId);

      if (error) throw error;

      // If approved, mark the activity as verified
      if (status === 'approved') {
        const submission = submissions.find(s => s.id === submissionId);
        if (submission?.activity_id) {
          await supabase
            .from('impact_activities')
            .update({ verified: true })
            .eq('id', submission.activity_id);
        }
      }

      toast({
        title: status === 'approved' ? "Evidence Approved! ✅" : "Evidence Rejected",
        description: `Evidence submission has been ${status}.`,
      });

      setSelectedSubmission(null);
      setReviewNotes('');
      loadSubmissions();
    } catch (error) {
      console.error('Error reviewing evidence:', error);
      toast({
        title: "Error",
        description: "Failed to review evidence.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Evidence Review Panel</span>
          <Badge variant="secondary">{submissions.length} pending</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending evidence submissions to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`border rounded-lg p-4 ${
                  selectedSubmission === submission.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">
                      {submission.profile?.first_name} {submission.profile?.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">{submission.activity?.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {submission.evidence_type.replace('_', ' ')}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        +{submission.activity?.points_earned} points
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </Badge>
                  </div>
                </div>

                {submission.file_url && (
                  <div className="mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(submission.file_url, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View Evidence</span>
                    </Button>
                  </div>
                )}

                {submission.metadata.description && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                    <strong>Description:</strong> {submission.metadata.description}
                  </div>
                )}

                {selectedSubmission === submission.id && (
                  <div className="mt-4 space-y-3 border-t pt-3">
                    <Textarea
                      placeholder="Add review notes (required for rejection)..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => reviewEvidence(submission.id, 'approved')}
                        className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </Button>
                      <Button
                        onClick={() => reviewEvidence(submission.id, 'rejected')}
                        disabled={!reviewNotes.trim()}
                        variant="destructive"
                        className="flex items-center space-x-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setReviewNotes('');
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {selectedSubmission !== submission.id && (
                  <Button
                    onClick={() => setSelectedSubmission(submission.id)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Review Evidence
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EvidenceReviewPanel;
