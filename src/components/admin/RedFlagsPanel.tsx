import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface RedFlag {
  id: string;
  user_id: string;
  flag_type: string;
  severity: string;
  description: string;
  status: string;
  evidence: any;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
  };
}

const RedFlagsPanel = () => {
  const { toast } = useToast();
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<RedFlag | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    loadRedFlags();
  }, []);

  const loadRedFlags = async () => {
    setLoading(true);
    try {
      const { data: flagsData, error: flagsError } = await supabase
        .from('red_flags')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (flagsError) throw flagsError;

      // Fetch profiles separately
      const userIds = flagsData?.map(f => f.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      // Merge data
      const enrichedFlags = flagsData?.map(flag => ({
        ...flag,
        profile: profilesData?.find(p => p.id === flag.user_id)
      })) || [];

      setRedFlags(enrichedFlags as any);
    } catch (error) {
      console.error('Error loading red flags:', error);
      toast({
        title: 'Error',
        description: 'Failed to load red flags',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveFlag = async (flagId: string, resolution: 'resolved' | 'dismissed') => {
    try {
      const { error } = await supabase
        .from('red_flags')
        .update({
          status: resolution,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', flagId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_action_log').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'red_flag_resolution',
        target_user_id: redFlags.find(f => f.id === flagId)?.user_id,
        details: {
          flag_id: flagId,
          resolution,
          notes: resolutionNotes,
        },
      });

      toast({
        title: resolution === 'resolved' ? 'Flag Resolved' : 'Flag Dismissed',
        description: `Red flag has been ${resolution}`,
      });

      setSelectedFlag(null);
      setResolutionNotes('');
      loadRedFlags();
    } catch (error) {
      console.error('Error resolving flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve red flag',
        variant: 'destructive',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Red Flags Management
          </CardTitle>
          <CardDescription>
            Review and resolve user behavior flags
          </CardDescription>
        </CardHeader>
        <CardContent>
          {redFlags.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Red Flags</h3>
              <p className="text-muted-foreground">All clear! No concerning user behavior detected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {redFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {flag.profile?.first_name} {flag.profile?.last_name}
                        </h3>
                        <Badge className={getSeverityColor(flag.severity)}>
                          {flag.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {flag.flag_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {flag.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Flagged: {new Date(flag.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFlag(flag)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedFlag} onOpenChange={() => setSelectedFlag(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Red Flag</DialogTitle>
            <DialogDescription>
              Investigate and resolve this user behavior flag
            </DialogDescription>
          </DialogHeader>

          {selectedFlag && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">User</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedFlag.profile?.first_name} {selectedFlag.profile?.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <div className="mt-1">
                    <Badge className={getSeverityColor(selectedFlag.severity)}>
                      {selectedFlag.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Flag Type</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFlag.flag_type.replace('_', ' ')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFlag.description}
                </p>
              </div>

              {selectedFlag.evidence && Object.keys(selectedFlag.evidence).length > 0 && (
                <div>
                  <label className="text-sm font-medium">Evidence</label>
                  <div className="mt-2 p-4 bg-muted rounded-md">
                    <pre className="text-xs overflow-auto max-h-40">
                      {JSON.stringify(selectedFlag.evidence, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Add notes about your investigation and resolution..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFlag(null)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => selectedFlag && handleResolveFlag(selectedFlag.id, 'dismissed')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
            <Button
              onClick={() => selectedFlag && handleResolveFlag(selectedFlag.id, 'resolved')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RedFlagsPanel;
