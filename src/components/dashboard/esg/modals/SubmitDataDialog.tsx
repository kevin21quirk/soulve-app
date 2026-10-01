import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from "lucide-react";

interface SubmitDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  indicatorName: string;
  indicatorUnit?: string;
}

export const SubmitDataDialog = ({
  open,
  onOpenChange,
  requestId,
  indicatorName,
  indicatorUnit,
}: SubmitDataDialogProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    value: '',
    notes: '',
    evidence_url: '',
  });

  const { api } = useAuth();

  const submitData = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!api) throw new Error('Not authenticated');
      // Server creates/updates the contribution and marks the request
      // submitted when it exists in Neon. The evidence URL is stored as a
      // legacy string entry alongside any {documentId, fileName} objects.
      await api.post('/esg/contributions', {
        dataRequestId: requestId,
        draftData: { value: data.value, notes: data.notes },
        submit: {
          value: data.value,
          notes: data.notes || null,
          supporting_documents: data.evidence_url ? [data.evidence_url] : [],
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-data-requests'] });
      queryClient.invalidateQueries({ queryKey: ['stakeholder-data-contributions'] });
      toast({ title: "Data Submitted", description: "Your data has been submitted for review" });
      onOpenChange(false);
      setFormData({ value: '', notes: '', evidence_url: '' });
    },
    onError: (error) => {
      toast({ title: "Submission Failed", description: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitData.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Submit Data: {indicatorName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="value">
              Value * {indicatorUnit && <span className="text-muted-foreground">({indicatorUnit})</span>}
            </Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder={`Enter value${indicatorUnit ? ` in ${indicatorUnit}` : ''}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any context or explanation for this data"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence_url">Evidence URL (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="evidence_url"
                type="url"
                value={formData.evidence_url}
                onChange={(e) => setFormData({ ...formData, evidence_url: e.target.value })}
                placeholder="https://example.com/evidence.pdf"
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Provide a link to supporting documentation or upload a file
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={submitData.isPending}>
              {submitData.isPending ? 'Submitting...' : 'Submit Data'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
