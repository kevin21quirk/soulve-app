import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Clock, ExternalLink, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface PendingBadgeAward {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  verification_status: string;
  evidence_submitted: any;
  contribution_details: any;
  badge: {
    name: string;
    icon: string;
    rarity: string;
    event_identifier?: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

const BadgeVerificationPanel = () => {
  const { toast } = useToast();
  const [pendingAwards, setPendingAwards] = useState<PendingBadgeAward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadPendingAwards();

    // Real-time subscription
    const channel = supabase
      .channel('badge-award-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'badge_award_log' }, () => {
        loadPendingAwards();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPendingAwards = async () => {
    try {
      const { data, error } = await supabase
        .from('badge_award_log')
        .select(`
          *,
          badge:badges(name, icon, rarity, event_identifier),
          profile:profiles(first_name, last_name, avatar_url)
        `)
        .eq('verification_status', 'pending')
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      setPendingAwards((data || []) as any);
    } catch (error) {
      console.error('Error loading pending awards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending badge awards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (awardId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('badge_award_log')
        .update({
          verification_status: status,
          metadata: { admin_notes: adminNotes }
        })
        .eq('id', awardId);

      if (error) throw error;

      toast({
        title: status === 'verified' ? 'Badge Approved' : 'Badge Rejected',
        description: `Badge award has been ${status}`,
      });

      setSelectedAward(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating badge verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update badge verification',
        variant: 'destructive',
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading pending verifications...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Badge Verification Queue
          </CardTitle>
          <CardDescription>
            Review and verify badge awards requiring manual approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAwards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending badge verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAwards.map((award) => (
                <Card key={award.id} className="border-l-4 border-l-yellow-400">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{award.badge.icon}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{award.badge.name}</h3>
                            <Badge className={getRarityColor(award.badge.rarity)} variant="secondary">
                              {award.badge.rarity}
                            </Badge>
                          </div>
                          {award.badge.event_identifier && (
                            <p className="text-sm text-primary font-medium">
                              Event: {award.badge.event_identifier}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{format(new Date(award.awarded_at), 'PPp')}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {award.profile?.first_name} {award.profile?.last_name}
                        </span>
                      </div>
                      
                      {award.contribution_details && Object.keys(award.contribution_details).length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium mb-1">Contribution Details:</p>
                          <pre className="bg-background p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(award.contribution_details, null, 2)}
                          </pre>
                        </div>
                      )}

                      {award.evidence_submitted && Object.keys(award.evidence_submitted).length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium mb-1">Evidence Submitted:</p>
                          <pre className="bg-background p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(award.evidence_submitted, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>

                    {selectedAward === award.id && (
                      <div className="mb-4">
                        <Textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add admin notes (optional)"
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {selectedAward === award.id ? (
                        <>
                          <Button
                            onClick={() => handleVerification(award.id, 'verified')}
                            className="flex-1"
                            variant="gradient"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve Badge
                          </Button>
                          <Button
                            onClick={() => handleVerification(award.id, 'rejected')}
                            className="flex-1"
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Badge
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedAward(null);
                              setAdminNotes('');
                            }}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setSelectedAward(award.id)}
                          className="flex-1"
                          variant="outline"
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeVerificationPanel;
