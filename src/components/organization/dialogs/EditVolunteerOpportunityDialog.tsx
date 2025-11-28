import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { VolunteerOpportunity } from "@/services/volunteerManagementService";

interface EditVolunteerOpportunityDialogProps {
  opportunity: VolunteerOpportunity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (opportunityId: string, updates: Partial<VolunteerOpportunity>) => Promise<void>;
}

export const EditVolunteerOpportunityDialog = ({ opportunity, open, onOpenChange, onSave }: EditVolunteerOpportunityDialogProps) => {
  const [formData, setFormData] = useState({
    title: opportunity.title,
    description: opportunity.description,
    requirements: opportunity.requirements || '',
    time_commitment: opportunity.time_commitment || '',
    location: opportunity.location || '',
    is_remote: opportunity.is_remote,
    max_volunteers: opportunity.max_volunteers?.toString() || '',
    application_deadline: opportunity.application_deadline || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(opportunity.id, {
        ...formData,
        max_volunteers: formData.max_volunteers ? parseInt(formData.max_volunteers) : undefined,
        application_deadline: formData.application_deadline || undefined
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Volunteer Opportunity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit_title">Title</Label>
            <Input
              id="edit_title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="edit_description">Description</Label>
            <Textarea
              id="edit_description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="edit_requirements">Requirements</Label>
            <Textarea
              id="edit_requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_location">Location</Label>
              <Input
                id="edit_location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit_time_commitment">Time Commitment</Label>
              <Input
                id="edit_time_commitment"
                value={formData.time_commitment}
                onChange={(e) => setFormData(prev => ({ ...prev, time_commitment: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit_is_remote"
              checked={formData.is_remote}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_remote: !!checked }))}
            />
            <Label htmlFor="edit_is_remote">Remote opportunity</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
