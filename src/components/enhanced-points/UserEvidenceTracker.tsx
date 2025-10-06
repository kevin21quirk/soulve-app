import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface EvidenceSubmission {
  id: string;
  evidence_type: string;
  verification_status: string;
  created_at: string;
  file_url?: string;
  rejection_reason?: string;
  activity?: {
    description: string;
    points_earned: number;
    points_state: string;
  };
}

export const UserEvidenceTracker = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<EvidenceSubmission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSubmissions();
    }
  }, [user?.id]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('evidence_submissions')
        .select(`
          *,
          activity:impact_activities(description, points_earned, points_state)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const transformedData = (data || []).map(item => ({
        ...item,
        activity: Array.isArray(item.activity) ? item.activity[0] : item.activity
      }));
      
      setSubmissions(transformedData as EvidenceSubmission[]);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending': return 50;
      case 'approved': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Under Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-700">Approved ✓</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Evidence Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No evidence submissions yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Submit evidence for high-value activities to verify your points
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Evidence Submissions
          <Badge variant="secondary">{submissions.length} total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(sub.verification_status)}
                    <h4 className="font-medium text-sm">{sub.activity?.description}</h4>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {sub.evidence_type.replace('_', ' ')}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      +{sub.activity?.points_earned} points
                    </Badge>
                    {sub.activity?.points_state && (
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          sub.activity.points_state === 'active' ? 'border-green-500 text-green-700' :
                          sub.activity.points_state === 'pending' ? 'border-orange-500 text-orange-700' :
                          'border-yellow-500 text-yellow-700'
                        }`}
                      >
                        {sub.activity.points_state === 'active' ? '✓ Active' :
                         sub.activity.points_state === 'pending' ? '⏳ Pending' :
                         sub.activity.points_state === 'escrow' ? '🔒 Escrow' : 
                         '❌ Reversed'}
                      </Badge>
                    )}
                  </div>
                </div>
                {getStatusBadge(sub.verification_status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {sub.verification_status === 'pending' ? 'Submitted' :
                     sub.verification_status === 'approved' ? 'Approved' : 'Reviewed'}
                  </span>
                  <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                </div>
                <Progress value={getProgressValue(sub.verification_status)} />
              </div>

              {sub.rejection_reason && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <strong>Rejection Reason:</strong> {sub.rejection_reason}
                </div>
              )}

              {sub.file_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.open(sub.file_url, '_blank')}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Evidence
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
