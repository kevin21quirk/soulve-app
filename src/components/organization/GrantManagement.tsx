
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Plus, 
  Calendar, 
  PoundSterling,
  AlertTriangle,
  Clock,
  CheckCircle,
  Target,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GrantManagementService, Grant } from "@/services/grantManagementService";

interface GrantManagementProps {
  organizationId: string;
}

const GrantManagement = ({ organizationId }: GrantManagementProps) => {
  const { toast } = useToast();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  
  const [newGrant, setNewGrant] = useState({
    funder_name: '',
    grant_title: '',
    amount_requested: '',
    amount_awarded: '',
    application_deadline: '',
    decision_date: '',
    project_start_date: '',
    project_end_date: '',
    status: 'researching',
    application_status: 'not_submitted',
    grant_type: '',
    focus_area: '',
    eligibility_requirements: '',
    application_requirements: '',
    notes: '',
    reporting_requirements: ''
  });

  useEffect(() => {
    loadGrantData();
  }, [organizationId]);

  const loadGrantData = async () => {
    try {
      setLoading(true);
      const [grantList, grantAnalytics] = await Promise.all([
        GrantManagementService.getGrants(organizationId),
        GrantManagementService.getGrantAnalytics(organizationId)
      ]);
      
      setGrants(grantList);
      setAnalytics(grantAnalytics);
    } catch (error) {
      console.error('Error loading grant data:', error);
      toast({
        title: "Error",
        description: "Failed to load grant data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrant = async () => {
    if (!newGrant.funder_name || !newGrant.grant_title) {
      toast({
        title: "Error",
        description: "Funder name and grant title are required",
        variant: "destructive"
      });
      return;
    }

    try {
      await GrantManagementService.createGrant(organizationId, {
        ...newGrant,
        amount_requested: newGrant.amount_requested ? parseFloat(newGrant.amount_requested) : undefined,
        amount_awarded: newGrant.amount_awarded ? parseFloat(newGrant.amount_awarded) : undefined,
        application_deadline: newGrant.application_deadline || undefined,
        decision_date: newGrant.decision_date || undefined,
        project_start_date: newGrant.project_start_date || undefined,
        project_end_date: newGrant.project_end_date || undefined
      });
      
      toast({
        title: "Grant Added",
        description: "Grant has been added successfully",
      });

      setNewGrant({
        funder_name: '',
        grant_title: '',
        amount_requested: '',
        amount_awarded: '',
        application_deadline: '',
        decision_date: '',
        project_start_date: '',
        project_end_date: '',
        status: 'researching',
        application_status: 'not_submitted',
        grant_type: '',
        focus_area: '',
        eligibility_requirements: '',
        application_requirements: '',
        notes: '',
        reporting_requirements: ''
      });
      setShowCreateDialog(false);
      loadGrantData();
    } catch (error) {
      console.error('Error creating grant:', error);
      toast({
        title: "Error",
        description: "Failed to create grant",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awarded': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'researching': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awarded': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      case 'submitted': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (deadline: string) => {
    const daysUntil = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 7) return 'text-red-600';
    if (daysUntil < 30) return 'text-yellow-600';
    return 'text-gray-600';
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
          <h2 className="text-2xl font-bold text-gray-900">Grant Management</h2>
          <p className="text-gray-600">Track grant opportunities and applications</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Grant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Grant Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="funder_name">Funder Name *</Label>
                  <Input
                    id="funder_name"
                    value={newGrant.funder_name}
                    onChange={(e) => setNewGrant(prev => ({ ...prev, funder_name: e.target.value }))}
                    placeholder="e.g., Big Lottery Fund"
                  />
                </div>
                <div>
                  <Label htmlFor="grant_title">Grant Title *</Label>
                  <Input
                    id="grant_title"
                    value={newGrant.grant_title}
                    onChange={(e) => setNewGrant(prev => ({ ...prev, grant_title: e.target.value }))}
                    placeholder="e.g., Community Impact Grant"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount_requested">Amount Requested (£)</Label>
                  <Input
                    id="amount_requested"
                    type="number"
                    value={newGrant.amount_requested}
                    onChange={(e) => setNewGrant(prev => ({ ...prev, amount_requested: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="amount_awarded">Amount Awarded (£)</Label>
                  <Input
                    id="amount_awarded"
                    type="number"
                    value={newGrant.amount_awarded}
                    onChange={(e) => setNewGrant(prev => ({ ...prev, amount_awarded: e.target.value }))}
                    placeholder="45000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={newGrant.application_deadline}
                    onChange={(e) => setNewGrant(prev => ({ ...prev, application_deadline: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="decision_date">Decision Date</Label>
                  <Input
                    id="decision_date"
                    type="date"
                    value={newGrant.decision_date}
                    onChange={(e) => setNewGrant(prev => ({ ...prev, decision_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newGrant.status} onValueChange={(value) => setNewGrant(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="researching">Researching</SelectItem>
                      <SelectItem value="eligible">Eligible</SelectItem>
                      <SelectItem value="applying">Applying</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="awarded">Awarded</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grant_type">Grant Type</Label>
                  <Input
                    id="grant_type"
                    value={newGrant.grant_type}
                    onChange={(e) => setNewGrant(prev => ({ ...prev, grant_type: e.target.value }))}
                    placeholder="e.g., Capital, Revenue, Project"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="focus_area">Focus Area</Label>
                <Input
                  id="focus_area"
                  value={newGrant.focus_area}
                  onChange={(e) => setNewGrant(prev => ({ ...prev, focus_area: e.target.value }))}
                  placeholder="e.g., Education, Environment, Health"
                />
              </div>

              <div>
                <Label htmlFor="eligibility_requirements">Eligibility Requirements</Label>
                <Textarea
                  id="eligibility_requirements"
                  value={newGrant.eligibility_requirements}
                  onChange={(e) => setNewGrant(prev => ({ ...prev, eligibility_requirements: e.target.value }))}
                  rows={3}
                  placeholder="List the key eligibility criteria..."
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newGrant.notes}
                  onChange={(e) => setNewGrant(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any additional notes or observations..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGrant}>
                  Add Grant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Grants</p>
                  <p className="text-2xl font-bold">{analytics.totalGrants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">{Math.round(analytics.successRate)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PoundSterling className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Awarded</p>
                  <p className="text-2xl font-bold">£{analytics.totalAwarded.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Awarded Grants</p>
                  <p className="text-2xl font-bold">{analytics.awardedGrants}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grants List */}
      <div className="space-y-4">
        {grants.map((grant) => (
          <Card key={grant.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-lg">{grant.grant_title}</CardTitle>
                    <Badge className={getStatusColor(grant.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(grant.status)}
                        <span>{grant.status}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-1">{grant.funder_name}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {grant.amount_requested && (
                      <div className="flex items-center space-x-1">
                        <PoundSterling className="h-4 w-4" />
                        <span>Requested: £{grant.amount_requested.toLocaleString()}</span>
                      </div>
                    )}
                    {grant.amount_awarded && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Awarded: £{grant.amount_awarded.toLocaleString()}</span>
                      </div>
                    )}
                    {grant.application_deadline && (
                      <div className="flex items-center space-x-1">
                        <Calendar className={`h-4 w-4 ${getUrgencyColor(grant.application_deadline)}`} />
                        <span className={getUrgencyColor(grant.application_deadline)}>
                          Deadline: {new Date(grant.application_deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {grant.grant_type && (
                    <Badge variant="outline" className="mb-2">
                      {grant.grant_type}
                    </Badge>
                  )}
                  {grant.focus_area && (
                    <p className="text-sm text-gray-600">{grant.focus_area}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {grant.notes && (
              <CardContent className="pt-0">
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">{grant.notes}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {grants.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No grants tracked yet</h3>
              <p className="text-gray-600 mb-4">
                Start tracking grant opportunities to manage your funding pipeline effectively.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GrantManagement;
