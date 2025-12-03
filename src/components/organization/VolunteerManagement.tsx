import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Plus, 
  MapPin, 
  Clock, 
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { VolunteerManagementService, VolunteerOpportunity, VolunteerApplication } from "@/services/volunteerManagementService";
import { useVolunteerOpportunities, charityToolsKeys } from "@/hooks/useCharityToolsData";
import ApplicantMiniProfile from "@/components/volunteer/ApplicantMiniProfile";
import ApplicationDetailDialog from "@/components/volunteer/ApplicationDetailDialog";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";

interface VolunteerManagementProps {
  organizationId: string;
}

const VolunteerManagement = ({ organizationId }: VolunteerManagementProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  
  const { data, isLoading: loading } = useVolunteerOpportunities(organizationId);
  const opportunities = data?.opportunities || [];
  const applications = data?.applications || {};
  
  // Get the title of the opportunity for the selected application
  const getOpportunityTitle = (opportunityId: string) => {
    const opp = opportunities.find(o => o.id === opportunityId);
    return opp?.title || 'Volunteer Opportunity';
  };
  
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    requirements: '',
    skills_needed: [] as string[],
    time_commitment: '',
    location: '',
    is_remote: false,
    start_date: '',
    end_date: '',
    max_volunteers: '',
    application_deadline: '',
    background_check_required: false,
    training_required: false
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: charityToolsKeys.volunteers(organizationId) });
    queryClient.invalidateQueries({ queryKey: charityToolsKeys.stats(organizationId) });
  };

  const handleCreateOpportunity = async () => {
    if (!newOpportunity.title || !newOpportunity.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive"
      });
      return;
    }

    try {
      await VolunteerManagementService.createOpportunity(organizationId, {
        ...newOpportunity,
        max_volunteers: newOpportunity.max_volunteers ? parseInt(newOpportunity.max_volunteers) : undefined,
        start_date: newOpportunity.start_date || undefined,
        end_date: newOpportunity.end_date || undefined,
        application_deadline: newOpportunity.application_deadline || undefined
      });
      
      toast({
        title: "Opportunity Created",
        description: "Volunteer opportunity has been created successfully",
      });

      setNewOpportunity({
        title: '',
        description: '',
        requirements: '',
        skills_needed: [],
        time_commitment: '',
        location: '',
        is_remote: false,
        start_date: '',
        end_date: '',
        max_volunteers: '',
        application_deadline: '',
        background_check_required: false,
        training_required: false
      });
      setShowCreateDialog(false);
      refreshData();
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to create opportunity",
        variant: "destructive"
      });
    }
  };

  const handleReviewApplication = async (applicationId: string, status: string) => {
    try {
      await VolunteerManagementService.reviewApplication(applicationId, status);
      
      toast({
        title: "Application Updated",
        description: `Application has been ${status}`,
      });

      refreshData();
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Volunteer Management</h2>
          <p className="text-gray-600">Manage volunteer opportunities and applications</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Volunteer Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newOpportunity.title}
                  onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Food Bank Assistant"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newOpportunity.description}
                  onChange={(e) => setNewOpportunity(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the volunteer role and responsibilities..."
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={newOpportunity.requirements}
                  onChange={(e) => setNewOpportunity(prev => ({ ...prev, requirements: e.target.value }))}
                  rows={3}
                  placeholder="Any specific requirements or qualifications..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newOpportunity.location}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., London, UK"
                  />
                </div>
                <div>
                  <Label htmlFor="time_commitment">Time Commitment</Label>
                  <Input
                    id="time_commitment"
                    value={newOpportunity.time_commitment}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, time_commitment: e.target.value }))}
                    placeholder="e.g., 4 hours per week"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newOpportunity.start_date}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newOpportunity.end_date}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_volunteers">Max Volunteers</Label>
                  <Input
                    id="max_volunteers"
                    type="number"
                    value={newOpportunity.max_volunteers}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, max_volunteers: e.target.value }))}
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={newOpportunity.application_deadline}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, application_deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_remote"
                    checked={newOpportunity.is_remote}
                    onCheckedChange={(checked) => setNewOpportunity(prev => ({ ...prev, is_remote: !!checked }))}
                  />
                  <Label htmlFor="is_remote">Remote opportunity</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="background_check_required"
                    checked={newOpportunity.background_check_required}
                    onCheckedChange={(checked) => setNewOpportunity(prev => ({ ...prev, background_check_required: !!checked }))}
                  />
                  <Label htmlFor="background_check_required">Background check required</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="training_required"
                    checked={newOpportunity.training_required}
                    onCheckedChange={(checked) => setNewOpportunity(prev => ({ ...prev, training_required: !!checked }))}
                  />
                  <Label htmlFor="training_required">Training required</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOpportunity}>
                  Create Opportunity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opportunity) => {
          const opportunityApplications = applications[opportunity.id] || [];
          const pendingApplications = opportunityApplications.filter(app => app.status === 'pending');
          
          return (
            <Card key={opportunity.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{opportunity.title}</CardTitle>
                    <p className="text-gray-600 text-sm mb-3">{opportunity.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {opportunity.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{opportunity.location}</span>
                        </div>
                      )}
                      {opportunity.time_commitment && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{opportunity.time_commitment}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(opportunity.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={opportunity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {opportunity.status}
                    </Badge>
                    {pendingApplications.length > 0 && (
                      <Badge variant="destructive">
                        {pendingApplications.length} pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {opportunityApplications.length > 0 && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Applications ({opportunityApplications.length})</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {opportunityApplications.slice(0, 3).map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                          <div className="flex-1 mr-4">
                            <ApplicantMiniProfile
                              userId={application.user_id}
                              profile={application.profile ? {
                                id: application.user_id,
                                first_name: application.profile.first_name,
                                last_name: application.profile.last_name,
                                avatar_url: application.profile.avatar_url,
                                location: application.profile.location,
                                bio: application.profile.bio,
                                skills: application.profile.skills
                              } : undefined}
                              metrics={application.metrics}
                              compact={true}
                              showMessageButton={application.status !== 'pending'}
                              onMessage={() => navigate(`/dashboard?tab=messaging&userId=${application.user_id}`)}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {/* Trust Score Badge */}
                            {application.metrics?.trust_score && application.metrics.trust_score > 0 && (
                              <Badge 
                                variant="outline" 
                                className={`hidden sm:flex ${getTrustScoreColor(application.metrics.trust_score)}`}
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                {application.metrics.trust_score}
                              </Badge>
                            )}
                            
                            <Badge className={getStatusColor(application.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(application.status)}
                                <span className="hidden sm:inline">{application.status}</span>
                              </div>
                            </Badge>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowApplicationDialog(true);
                              }}
                              className="h-8 px-3 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            
                            {application.status === 'pending' && (
                              <div className="hidden md:flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleReviewApplication(application.id, 'approved')}
                                  className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewApplication(application.id, 'rejected')}
                                  className="h-8 px-3 text-xs"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {opportunityApplications.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => setSelectedOpportunity(opportunity.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View all {opportunityApplications.length} applications
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {opportunities.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No volunteer opportunities yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first volunteer opportunity to start building your volunteer community.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Detail Dialog */}
      <ApplicationDetailDialog
        application={selectedApplication}
        opportunityTitle={selectedApplication ? getOpportunityTitle(selectedApplication.opportunity_id) : ''}
        open={showApplicationDialog}
        onOpenChange={setShowApplicationDialog}
        onStatusChange={refreshData}
      />
    </div>
  );
};

export default VolunteerManagement;
