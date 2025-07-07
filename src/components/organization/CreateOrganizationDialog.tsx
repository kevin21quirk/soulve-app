import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CreateOrganizationDialogProps {
  onOrganizationCreated?: () => void;
}

const CreateOrganizationDialog = ({ onOrganizationCreated }: CreateOrganizationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization_type: '',
    description: '',
    mission: '',
    website: '',
    location: '',
    contact_email: '',
    contact_phone: ''
  });

  const organizationTypes = [
    { value: 'charity', label: 'Charity / Non-Profit' },
    { value: 'business', label: 'Business / Corporation' },
    { value: 'government', label: 'Government Agency' },
    { value: 'educational', label: 'Educational Institution' },
    { value: 'healthcare', label: 'Healthcare Organization' },
    { value: 'community_group', label: 'Community Group' },
    { value: 'religious', label: 'Religious Organization' },
    { value: 'social_enterprise', label: 'Social Enterprise' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name.trim() || !formData.organization_type) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create organization
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          ...formData,
          created_by: user.id
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add creator as admin
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organization.id,
          user_id: user.id,
          role: 'admin',
          title: 'Founder',
          is_active: true,
          is_public: true
        });

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: `${formData.name} has been created successfully!`
      });

      setFormData({
        name: '',
        organization_type: '',
        description: '',
        mission: '',
        website: '',
        location: '',
        contact_email: '',
        contact_phone: ''
      });
      setOpen(false);
      onOrganizationCreated?.();
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Building className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Create New Organization</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter organization name"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Organization Type *</Label>
              <Select value={formData.organization_type} onValueChange={(value) => setFormData(prev => ({ ...prev, organization_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your organization"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
              placeholder="What is your organization's mission?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="contact@organization.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;