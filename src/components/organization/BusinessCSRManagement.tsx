import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TreePine, 
  Plus, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Target,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessManagementService, CSRInitiative } from "@/services/businessManagementService";

interface BusinessCSRManagementProps {
  organizationId: string;
}

const BusinessCSRManagement = ({ organizationId }: BusinessCSRManagementProps) => {
  const { toast } = useToast();
  const [initiatives, setInitiatives] = useState<CSRInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [initiativeForm, setInitiativeForm] = useState({
    title: '',
    description: '',
    category: 'community',
    budget_allocated: '',
    target_beneficiaries: ''
  });

  useEffect(() => {
    loadInitiatives();
  }, [organizationId]);

  const loadInitiatives = async () => {
    try {
      setLoading(true);
      const initiativeData = await BusinessManagementService.getCSRInitiatives(organizationId);
      setInitiatives(initiativeData);
    } catch (error) {
      console.error('Error loading CSR initiatives:', error);
      toast({
        title: "Error",
        description: "Failed to load CSR initiatives",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInitiative = async () => {
    if (!initiativeForm.title) {
      toast({
        title: "Error",
        description: "Initiative title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await BusinessManagementService.createCSRInitiative(organizationId, {
        ...initiativeForm,
        budget_allocated: initiativeForm.budget_allocated ? parseFloat(initiativeForm.budget_allocated) : undefined,
        target_beneficiaries: initiativeForm.target_beneficiaries ? parseInt(initiativeForm.target_beneficiaries) : undefined
      });
      toast({
        title: "Success",
        description: "CSR initiative created successfully",
      });
      setInitiativeForm({ title: '', description: '', category: 'community', budget_allocated: '', target_beneficiaries: '' });
      setShowCreateDialog(false);
      loadInitiatives();
    } catch (error) {
      console.error('Error creating CSR initiative:', error);
      toast({
        title: "Error",
        description: "Failed to create CSR initiative",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const totalBudget = initiatives.reduce((sum, i) => sum + (i.budget_allocated || 0), 0);
  const totalSpent = initiatives.reduce((sum, i) => sum + (i.budget_spent || 0), 0);
  const totalBeneficiaries = initiatives.reduce((sum, i) => sum + (i.actual_beneficiaries || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Corporate Social Responsibility</h2>
          <p className="text-gray-600">Manage and track your organization's social impact initiatives</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Initiative
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create CSR Initiative</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={initiativeForm.title}
                  onChange={(e) => setInitiativeForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Initiative title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={initiativeForm.category} onValueChange={(value) => setInitiativeForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="disaster_relief">Disaster Relief</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={initiativeForm.description}
                  onChange={(e) => setInitiativeForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your CSR initiative"
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget Allocated (£)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={initiativeForm.budget_allocated}
                  onChange={(e) => setInitiativeForm(prev => ({ ...prev, budget_allocated: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="beneficiaries">Target Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  value={initiativeForm.target_beneficiaries}
                  onChange={(e) => setInitiativeForm(prev => ({ ...prev, target_beneficiaries: e.target.value }))}
                  placeholder="Number of people to help"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInitiative}>
                  Create Initiative
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TreePine className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Initiatives</p>
                <p className="text-2xl font-bold">{initiatives.filter(i => i.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold">£{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Budget Utilized</p>
                <p className="text-2xl font-bold">£{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">People Helped</p>
                <p className="text-2xl font-bold">{totalBeneficiaries.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Initiatives List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{initiative.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{initiative.category}</p>
                </div>
                <Badge className={getStatusColor(initiative.status)}>
                  {initiative.status}
                </Badge>
              </div>

              {initiative.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {initiative.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {initiative.budget_allocated && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">£{initiative.budget_allocated.toLocaleString()}</span>
                  </div>
                )}
                {initiative.budget_spent !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium">£{initiative.budget_spent.toLocaleString()}</span>
                  </div>
                )}
                {initiative.target_beneficiaries && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Target Beneficiaries:</span>
                    <span className="font-medium">{initiative.target_beneficiaries.toLocaleString()}</span>
                  </div>
                )}
                {initiative.actual_beneficiaries !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">People Helped:</span>
                    <span className="font-medium text-green-600">{initiative.actual_beneficiaries.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created {new Date(initiative.created_at).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">
                  <Award className="h-4 w-4 mr-2" />
                  View Impact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {initiatives.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No CSR Initiatives Yet</h3>
              <p className="text-gray-600 mb-4">
                Start creating corporate social responsibility initiatives to track your organization's social impact.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Initiative
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessCSRManagement;