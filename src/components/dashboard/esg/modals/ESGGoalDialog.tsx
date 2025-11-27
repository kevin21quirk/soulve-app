import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ESGGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  goal?: any;
}

export const ESGGoalDialog = ({
  open,
  onOpenChange,
  organizationId,
  goal,
}: ESGGoalDialogProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    goal_name: goal?.goal_name || '',
    description: goal?.description || '',
    category: goal?.category || 'environmental',
    target_value: goal?.target_value || 0,
    current_value: goal?.current_value || 0,
    target_year: goal?.target_year || new Date().getFullYear() + 1,
    priority: goal?.priority || 'medium',
  });

  const saveGoal = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (goal) {
        const { error } = await supabase
          .from('esg_goals')
          .update(data)
          .eq('id', goal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('esg_goals')
          .insert([{ ...data, organization_id: organizationId }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-goals'] });
      toast({ title: goal ? "Goal Updated" : "Goal Created", description: "ESG goal saved successfully" });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to save goal: ${error.message}`, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoal.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit' : 'Create'} ESG Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal_name">Goal Name *</Label>
            <Input
              id="goal_name"
              value={formData.goal_name}
              onChange={(e) => setFormData({ ...formData, goal_name: e.target.value })}
              placeholder="e.g., Reduce Carbon Emissions by 50%"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the goal and how it will be achieved"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_value">Current Value</Label>
              <Input
                id="current_value"
                type="number"
                value={formData.current_value}
                onChange={(e) => setFormData({ ...formData, current_value: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_value">Target Value *</Label>
              <Input
                id="target_value"
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) || 0 })}
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_year">Target Year *</Label>
            <Input
              id="target_year"
              type="number"
              value={formData.target_year}
              onChange={(e) => setFormData({ ...formData, target_year: parseInt(e.target.value) || new Date().getFullYear() + 1 })}
              min={new Date().getFullYear()}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={saveGoal.isPending}>
              {saveGoal.isPending ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
