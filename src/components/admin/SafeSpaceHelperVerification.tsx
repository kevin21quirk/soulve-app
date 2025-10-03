import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Shield, CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';
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

interface HelperApplication {
  id: string;
  user_id: string;
  specializations: string[];
  professional_credentials: any;
  verification_status: string;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

const SafeSpaceHelperVerification = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<HelperApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<HelperApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data: helpersData, error: helpersError } = await supabase
        .from('safe_space_helpers')
        .select('*')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (helpersError) throw helpersError;

      // Fetch profiles separately
      const userIds = helpersData?.map(h => h.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      // Merge data
      const enrichedApplications = helpersData?.map(helper => ({
        ...helper,
        profile: profilesData?.find(p => p.id === helper.user_id)
      })) || [];
      
      setApplications(enrichedApplications as any);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load helper applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (appId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('safe_space_helpers')
        .update({
          verification_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_action_log').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'helper_verification',
        target_user_id: applications.find(a => a.id === appId)?.user_id,
        details: {
          verification_status: status,
          notes: reviewNotes,
        },
      });

      toast({
        title: status === 'verified' ? 'Helper Verified!' : 'Application Rejected',
        description: `Helper application has been ${status}.`,
      });

      setSelectedApp(null);
      setReviewNotes('');
      loadApplications();
    } catch (error) {
      console.error('Error verifying helper:', error);
      toast({
        title: 'Error',
        description: 'Failed to process verification',
        variant: 'destructive',
      });
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
            <Shield className="h-5 w-5" />
            Safe Space Helper Verification
          </CardTitle>
          <CardDescription>
            Review and approve helper applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending helper applications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={app.profile?.avatar_url} />
                        <AvatarFallback>
                          {(app.profile?.first_name?.[0] || '') + (app.profile?.last_name?.[0] || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {app.profile?.first_name} {app.profile?.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {app.specializations.map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  </div>

                  {app.professional_credentials && Object.keys(app.professional_credentials).length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">Professional Credentials:</p>
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(app.professional_credentials, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApp(app)}
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

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Helper Application</DialogTitle>
            <DialogDescription>
              Verify credentials and approve or reject this application
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApp.profile?.avatar_url} />
                  <AvatarFallback>
                    {(selectedApp.profile?.first_name?.[0] || '') + (selectedApp.profile?.last_name?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedApp.profile?.first_name} {selectedApp.profile?.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Application Date: {new Date(selectedApp.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Specializations</label>
                <div className="flex gap-2 mt-2">
                  {selectedApp.specializations.map((spec) => (
                    <Badge key={spec}>{spec}</Badge>
                  ))}
                </div>
              </div>

              {selectedApp.professional_credentials && (
                <div>
                  <label className="text-sm font-medium">Credentials</label>
                  <div className="mt-2 p-4 bg-muted rounded-md">
                    <pre className="text-sm overflow-auto max-h-40">
                      {JSON.stringify(selectedApp.professional_credentials, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about this verification..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApp(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedApp && handleVerification(selectedApp.id, 'rejected')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => selectedApp && handleVerification(selectedApp.id, 'verified')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SafeSpaceHelperVerification;
