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
  Handshake, 
  Plus, 
  Building, 
  Calendar,
  PoundSterling,
  Mail,
  Phone,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessManagementService, BusinessPartnership } from "@/services/businessManagementService";

interface BusinessPartnershipManagementProps {
  organizationId: string;
}

const BusinessPartnershipManagement = ({ organizationId }: BusinessPartnershipManagementProps) => {
  const { toast } = useToast();
  const [partnerships, setPartnerships] = useState<BusinessPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [partnershipForm, setPartnershipForm] = useState({
    partner_name: '',
    partnership_type: 'strategic',
    description: '',
    contact_person: '',
    contact_email: '',
    value: ''
  });

  useEffect(() => {
    loadPartnerships();
  }, [organizationId]);

  const loadPartnerships = async () => {
    try {
      setLoading(true);
      const partnershipData = await BusinessManagementService.getPartnerships(organizationId);
      setPartnerships(partnershipData);
    } catch (error) {
      console.error('Error loading partnerships:', error);
      toast({
        title: "Error",
        description: "Failed to load partnerships",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePartnership = async () => {
    if (!partnershipForm.partner_name) {
      toast({
        title: "Error",
        description: "Partner name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await BusinessManagementService.createPartnership(organizationId, {
        ...partnershipForm,
        value: partnershipForm.value ? parseFloat(partnershipForm.value) : undefined
      });
      toast({
        title: "Success",
        description: "Partnership created successfully",
      });
      setPartnershipForm({ partner_name: '', partnership_type: 'strategic', description: '', contact_person: '', contact_email: '', value: '' });
      setShowCreateDialog(false);
      loadPartnerships();
    } catch (error) {
      console.error('Error creating partnership:', error);
      toast({
        title: "Error",
        description: "Failed to create partnership",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartnershipTypeColor = (type: string) => {
    switch (type) {
      case 'strategic':
        return 'bg-purple-100 text-purple-800';
      case 'supplier':
        return 'bg-blue-100 text-blue-800';
      case 'vendor':
        return 'bg-orange-100 text-orange-800';
      case 'joint_venture':
        return 'bg-indigo-100 text-indigo-800';
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

  const totalValue = partnerships.reduce((sum, p) => sum + (p.value || 0), 0);
  const activePartnerships = partnerships.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Partnerships</h2>
          <p className="text-gray-600">Manage strategic partnerships and business relationships</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Partnership
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Business Partnership</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="partner_name">Partner Name</Label>
                <Input
                  id="partner_name"
                  value={partnershipForm.partner_name}
                  onChange={(e) => setPartnershipForm(prev => ({ ...prev, partner_name: e.target.value }))}
                  placeholder="Company or organization name"
                />
              </div>
              <div>
                <Label htmlFor="partnership_type">Partnership Type</Label>
                <Select value={partnershipForm.partnership_type} onValueChange={(value) => setPartnershipForm(prev => ({ ...prev, partnership_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strategic">Strategic Partnership</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="joint_venture">Joint Venture</SelectItem>
                    <SelectItem value="distribution">Distribution Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={partnershipForm.description}
                  onChange={(e) => setPartnershipForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the partnership details"
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={partnershipForm.contact_person}
                  onChange={(e) => setPartnershipForm(prev => ({ ...prev, contact_person: e.target.value }))}
                  placeholder="Primary contact name"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={partnershipForm.contact_email}
                  onChange={(e) => setPartnershipForm(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="contact@partner.com"
                />
              </div>
              <div>
                <Label htmlFor="value">Partnership Value (£)</Label>
                <Input
                  id="value"
                  type="number"
                  value={partnershipForm.value}
                  onChange={(e) => setPartnershipForm(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePartnership}>
                  Create Partnership
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Handshake className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Partnerships</p>
                <p className="text-2xl font-bold">{activePartnerships}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PoundSterling className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">£{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Partners</p>
                <p className="text-2xl font-bold">{partnerships.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partnerships List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partnerships.map((partnership) => (
          <Card key={partnership.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{partnership.partner_name}</h3>
                  <Badge className={getPartnershipTypeColor(partnership.partnership_type)}>
                    {partnership.partnership_type.replace('_', ' ')}
                  </Badge>
                </div>
                <Badge className={getStatusColor(partnership.status)}>
                  {partnership.status}
                </Badge>
              </div>

              {partnership.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {partnership.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {partnership.contact_person && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{partnership.contact_person}</span>
                  </div>
                )}
                {partnership.contact_email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{partnership.contact_email}</span>
                  </div>
                )}
                {partnership.value && (
                  <div className="flex items-center space-x-2 text-sm">
                    <PoundSterling className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Value: £{partnership.value.toLocaleString()}</span>
                  </div>
                )}
                {partnership.start_date && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      Started: {new Date(partnership.start_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created {new Date(partnership.created_at).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {partnerships.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partnerships Yet</h3>
              <p className="text-gray-600 mb-4">
                Start building strategic business partnerships to grow your organization.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Partnership
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessPartnershipManagement;