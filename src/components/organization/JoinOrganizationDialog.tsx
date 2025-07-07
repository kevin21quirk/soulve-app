import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { joinOrganization } from "@/services/organizationService";

interface JoinOrganizationDialogProps {
  onOrganizationJoined?: () => void;
}

const JoinOrganizationDialog = ({ onOrganizationJoined }: JoinOrganizationDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationCode: '',
    title: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an organization code or ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await joinOrganization(formData.organizationCode, 'member', formData.title || undefined);
      
      toast({
        title: "Success",
        description: "Successfully requested to join the organization!"
      });
      
      setFormData({ organizationCode: '', title: '', message: '' });
      setOpen(false);
      onOrganizationJoined?.();
    } catch (error) {
      console.error('Error joining organization:', error);
      toast({
        title: "Error",
        description: "Failed to join organization. Please check the organization code and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Join Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Join Organization</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Organization Code/ID *</Label>
            <Input
              id="code"
              value={formData.organizationCode}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationCode: e.target.value }))}
              placeholder="Enter organization code or ID"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask your organization administrator for the code
            </p>
          </div>

          <div>
            <Label htmlFor="title">Your Title/Role (Optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Volunteer, Employee, Member"
            />
          </div>

          <div>
            <Label htmlFor="message">Introduction Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Introduce yourself to the organization..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Joining...
                </>
              ) : (
                'Join Organization'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinOrganizationDialog;