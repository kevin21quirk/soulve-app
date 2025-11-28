import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Grant } from "@/services/grantManagementService";

interface EditGrantDialogProps {
  grant: Grant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (grantId: string, updates: Partial<Grant>) => Promise<void>;
}

export const EditGrantDialog = ({ grant, open, onOpenChange, onSave }: EditGrantDialogProps) => {
  const [formData, setFormData] = useState({
    funder_name: grant.funder_name,
    grant_title: grant.grant_title,
    amount_requested: grant.amount_requested?.toString() || '',
    amount_awarded: grant.amount_awarded?.toString() || '',
    application_deadline: grant.application_deadline || '',
    decision_date: grant.decision_date || '',
    status: grant.status,
    grant_type: grant.grant_type || '',
    focus_area: grant.focus_area || '',
    notes: grant.notes || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(grant.id, {
        ...formData,
        amount_requested: formData.amount_requested ? parseFloat(formData.amount_requested) : undefined,
        amount_awarded: formData.amount_awarded ? parseFloat(formData.amount_awarded) : undefined,
        application_deadline: formData.application_deadline || undefined,
        decision_date: formData.decision_date || undefined
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
          <DialogTitle>Edit Grant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_funder_name">Funder Name</Label>
              <Input
                id="edit_funder_name"
                value={formData.funder_name}
                onChange={(e) => setFormData(prev => ({ ...prev, funder_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit_grant_title">Grant Title</Label>
              <Input
                id="edit_grant_title"
                value={formData.grant_title}
                onChange={(e) => setFormData(prev => ({ ...prev, grant_title: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_amount_requested">Amount Requested (£)</Label>
              <Input
                id="edit_amount_requested"
                type="number"
                value={formData.amount_requested}
                onChange={(e) => setFormData(prev => ({ ...prev, amount_requested: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit_amount_awarded">Amount Awarded (£)</Label>
              <Input
                id="edit_amount_awarded"
                type="number"
                value={formData.amount_awarded}
                onChange={(e) => setFormData(prev => ({ ...prev, amount_awarded: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_application_deadline">Application Deadline</Label>
              <Input
                id="edit_application_deadline"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit_status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
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
          </div>
          <div>
            <Label htmlFor="edit_notes">Notes</Label>
            <Textarea
              id="edit_notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
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
