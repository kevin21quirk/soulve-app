import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, CheckCircle, XCircle, Clock, Eye, FileText, 
  GraduationCap, UserCheck, Mail, Phone, Briefcase,
  AlertCircle, Download, ExternalLink
} from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelperApplication {
  id: string;
  user_id: string;
  application_status: string;
  personal_statement: string | null;
  experience_description: string | null;
  preferred_specializations: string[] | null;
  qualifications: any;
  reference_contacts: any;
  submitted_at: string | null;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  training_progress?: {
    completed: number;
    total: number;
  };
  documents?: any[];
}

const SafeSpaceHelperVerification = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<HelperApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<HelperApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadApplications();
  }, [activeTab]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      // Query the correct table: safe_space_helper_applications
      let query = supabase
        .from('safe_space_helper_applications')
        .select('*')
        .order('submitted_at', { ascending: false, nullsFirst: false });

      if (activeTab === 'pending') {
        query = query.eq('application_status', 'submitted');
      } else if (activeTab === 'approved') {
        query = query.eq('application_status', 'approved');
      } else if (activeTab === 'rejected') {
        query = query.eq('application_status', 'rejected');
      }

      const { data: applicationsData, error: applicationsError } = await query;

      if (applicationsError) throw applicationsError;

      // Fetch profiles
      const userIds = applicationsData?.map(a => a.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      // Fetch training progress for all users
      const { data: allTrainingProgress } = await supabase
        .from('safe_space_helper_training_progress')
        .select('user_id, status')
        .in('user_id', userIds);

      // Fetch total required modules
      const { data: requiredModules } = await supabase
        .from('safe_space_training_modules')
        .select('id')
        .eq('is_required', true);
      
      const totalModules = requiredModules?.length || 0;

      // Enrich applications with related data
      const enrichedApplications: HelperApplication[] = (applicationsData || []).map(app => {
        const userProgress = allTrainingProgress?.filter(p => p.user_id === app.user_id && p.status === 'completed') || [];
        
        return {
          id: app.id,
          user_id: app.user_id,
          application_status: app.application_status,
          personal_statement: app.personal_statement,
          experience_description: app.experience_description,
          preferred_specializations: app.preferred_specializations,
          qualifications: app.qualifications,
          reference_contacts: app.reference_contacts,
          submitted_at: app.submitted_at,
          created_at: app.created_at,
          profile: profilesData?.find(p => p.id === app.user_id),
          training_progress: { 
            completed: userProgress.length, 
            total: totalModules 
          },
          documents: []
        };
      });
      
      setApplications(enrichedApplications);
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

  const handleVerification = async (appId: string, status: 'approved' | 'rejected') => {
    try {
      // Update the application status - this triggers the database function to create helper record
      const { error } = await supabase
        .from('safe_space_helper_applications')
        .update({
          application_status: status,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewNotes,
        })
        .eq('id', appId);

      if (error) throw error;

      // Log admin action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('admin_action_log').insert({
        admin_id: user?.id,
        action_type: 'helper_verification',
        target_user_id: applications.find(a => a.id === appId)?.user_id,
        details: {
          application_id: appId,
          verification_status: status,
          notes: reviewNotes,
        },
      });

      // Send notification to applicant
      const app = applications.find(a => a.id === appId);
      if (app) {
        await supabase.from('notifications').insert({
          recipient_id: app.user_id,
          type: 'safe_space_verification',
          title: status === 'approved' ? 'Application Approved! 🎉' : 'Application Update',
          message: status === 'approved' 
            ? 'Congratulations! Your Safe Space Helper application has been approved. You can now start helping others.'
            : `Your application requires attention. ${reviewNotes || 'Please contact support for more information.'}`,
          priority: 'high',
        });
      }

      toast({
        title: status === 'approved' ? 'Helper Approved!' : 'Application Rejected',
        description: status === 'approved' 
          ? 'The applicant has been verified and can now accept support sessions.'
          : 'The applicant has been notified.',
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            Safe Space Helper Applications
          </CardTitle>
          <CardDescription>
            Review applications, training progress, and approve helpers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Applications</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'pending' ? 'No pending applications to review' : `No ${activeTab} applications`}
                  </p>
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
                              Submitted: {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Draft'}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {app.preferred_specializations?.slice(0, 3).map((area) => (
                                <Badge key={area} variant="secondary" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                              {(app.preferred_specializations?.length || 0) > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{app.preferred_specializations!.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(app.application_status)}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            <span>{app.training_progress?.completed}/{app.training_progress?.total} modules</span>
                          </div>
                        </div>
                      </div>

                      {/* Training Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Training Progress</span>
                          <span className="font-medium">
                            {app.training_progress?.total 
                              ? Math.round((app.training_progress.completed / app.training_progress.total) * 100)
                              : 0}%
                          </span>
                        </div>
                        <Progress 
                          value={app.training_progress?.total 
                            ? (app.training_progress.completed / app.training_progress.total) * 100
                            : 0} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Application
                        </Button>
                        {app.documents && app.documents.length > 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {app.documents.length} Documents
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Application Review Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Review Helper Application</DialogTitle>
            <DialogDescription>
              Review all application details, training progress, and documents
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Applicant Info */}
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedApp.profile?.avatar_url} />
                    <AvatarFallback>
                      {(selectedApp.profile?.first_name?.[0] || '') + (selectedApp.profile?.last_name?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {selectedApp.profile?.first_name} {selectedApp.profile?.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Applied: {selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleDateString() : 'Draft'}
                    </p>
                  </div>
                  {getStatusBadge(selectedApp.application_status)}
                </div>

                {/* Areas of Focus */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Areas of Focus
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedApp.preferred_specializations?.map((area) => (
                      <Badge key={area}>{area}</Badge>
                    ))}
                  </div>
                </div>

                {/* Personal Statement */}
                {selectedApp.personal_statement && (
                  <div>
                    <h4 className="font-medium mb-2">Personal Statement</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {selectedApp.personal_statement}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {selectedApp.experience_description && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience Summary
                    </h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {selectedApp.experience_description}
                    </p>
                  </div>
                )}

                {/* Qualifications */}
                {selectedApp.qualifications && Object.keys(selectedApp.qualifications).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Qualifications
                    </h4>
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="text-sm overflow-auto max-h-40 whitespace-pre-wrap">
                        {JSON.stringify(selectedApp.qualifications, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* References */}
                {selectedApp.reference_contacts && Array.isArray(selectedApp.reference_contacts) && selectedApp.reference_contacts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      References
                    </h4>
                    <div className="space-y-2">
                      {selectedApp.reference_contacts.map((ref: any, idx: number) => (
                        <div key={idx} className="bg-muted p-3 rounded-md text-sm">
                          <p className="font-medium">{ref.name}</p>
                          <p className="text-muted-foreground">{ref.relationship}</p>
                          <p className="text-muted-foreground">{ref.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Training Progress */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Training Progress
                  </h4>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span>Completed Modules</span>
                      <span className="font-medium">
                        {selectedApp.training_progress?.completed}/{selectedApp.training_progress?.total}
                      </span>
                    </div>
                    <Progress 
                      value={selectedApp.training_progress?.total 
                        ? (selectedApp.training_progress.completed / selectedApp.training_progress.total) * 100
                        : 0} 
                      className="h-3"
                    />
                    {selectedApp.training_progress?.completed !== selectedApp.training_progress?.total && (
                      <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Training not yet complete
                      </p>
                    )}
                  </div>
                </div>

                {/* Documents */}
                {selectedApp.documents && selectedApp.documents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Uploaded Documents
                    </h4>
                    <div className="space-y-2">
                      {selectedApp.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between bg-muted p-3 rounded-md">
                          <div>
                            <p className="font-medium text-sm">{doc.document_type}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={doc.verification_status === 'verified' ? 'default' : 'outline'}>
                              {doc.verification_status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                {selectedApp.application_status === 'submitted' && (
                  <div>
                    <h4 className="font-medium mb-2">Review Notes</h4>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes about this application..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedApp(null)}>
              Close
            </Button>
            {selectedApp?.application_status === 'submitted' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => selectedApp && handleVerification(selectedApp.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => selectedApp && handleVerification(selectedApp.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Helper
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SafeSpaceHelperVerification;
